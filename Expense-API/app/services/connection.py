"""Connection service for managing connection operations."""

import asyncio
from typing import Optional

import httpx
from sqlalchemy.orm import selectinload
from sqlmodel import Session, func, select

from app.config.database import get_thread_session
from app.config.logger import get_logger
from app.models.connection import Connection
from app.models.whatsapp import WhatsappConfiguration
from app.schemas.configuration import RabbitMQConnectionUpdateDelete
from app.schemas.connection import (
    ConnectionCreate,
    ConnectionListItem,
    ConnectionStatus,
    PaginatedConnectionResponse,
    ProviderType,
    SourceType,
    WebhookConnection,
)
from app.schemas.expense import CategoryType, SubcategoryType

logger = get_logger(__name__)


def get_connections(
    session: Session,
    organization_id: int,
    page: int = 1,
    per_page: int = 10,
    source_type: Optional[SourceType] = None,
    provider_type: Optional[ProviderType] = None,
    status: Optional[ConnectionStatus] = None,
) -> PaginatedConnectionResponse:
    """Get connections with pagination and filtering."""
    query = select(Connection)

    conditions = []
    if source_type is not None:
        conditions.append(Connection.source_type == source_type)
    if provider_type is not None:
        conditions.append(Connection.provider_type == provider_type)
    if status is not None:
        conditions.append(Connection.status == status)
    conditions.append(Connection.organization_id == organization_id)

    if conditions:
        query = query.where(*conditions)

    count_query = select(func.count(Connection.id)).select_from(Connection)
    if conditions:
        count_query = count_query.where(*conditions)
    total = session.exec(count_query).first() or 0

    query = query.options(selectinload(Connection.whatsapp_configuration))
    query = query.order_by(Connection.created_at.desc())
    query = query.offset((page - 1) * per_page).limit(per_page)

    connections = session.exec(query).all()

    connection_items = [ConnectionListItem.model_validate(conn) for conn in connections]

    return PaginatedConnectionResponse(
        total=total,
        page=page,
        per_page=per_page,
        items=connection_items,
    )


def upsert_whatsapp_connection(connection_payload: ConnectionCreate) -> None:
    """Create a new connection."""
    session = get_thread_session()

    try:
        existing_connection = session.exec(
            select(Connection).where(
                Connection.id == connection_payload.id,
                Connection.organization_id == connection_payload.organization_id,
                Connection.provider_type == connection_payload.provider_type,
            )
        ).first()

        if existing_connection:
            existing_connection.status = connection_payload.status
            session.commit()
            return

        connection = Connection(**connection_payload.model_dump())
        session.add(connection)
        session.commit()

        if connection_payload.provider_type == ProviderType.WHATSAPP:
            whatsapp_config = WhatsappConfiguration(
                connection_id=connection.id,
                phone_number_id=connection_payload.phone_number_id,
                phone_number=connection_payload.phone_number,
                access_token=connection_payload.whatsapp_token,
                verification_token=connection_payload.whatsapp_verification_token,
            )

            session.add(whatsapp_config)
            session.commit()

    except Exception as e:
        session.rollback()
        logger.error(f"Failed to create connection: {e}")
        raise
    finally:
        session.close()


def upsert_webhook_connection(connection_payload: WebhookConnection) -> None:
    """Create or update webhook connection."""
    session = get_thread_session()

    try:
        existing_connection = session.exec(
            select(Connection).where(
                Connection.organization_id == connection_payload.organization_id,
                Connection.url == connection_payload.url,
                Connection.provider_type == connection_payload.provider_type,
                Connection.source_type == connection_payload.source_type,
            )
        ).first()

        if existing_connection:
            existing_connection.status = connection_payload.status
        else:
            connection = Connection(**connection_payload.model_dump())
            session.add(connection)

        session.commit()

    except Exception as e:
        session.rollback()
        logger.error(f"Failed to create webhook connection: {e}")
        raise
    finally:
        session.close()


def disconnect_connection(conn_data: RabbitMQConnectionUpdateDelete):
    """Disconnect an existing connection."""
    session = get_thread_session()

    try:
        connection = session.exec(
            select(Connection).where(
                Connection.id == conn_data.id,
                Connection.organization_id == conn_data.organization_id,
            )
        ).first()

        if not connection:
            logger.warning(
                f"Connection not found for id={conn_data.id}, org={conn_data.organization_id}"
            )
            return

        connection.status = ConnectionStatus.DISCONNECTED
        session.commit()

    except Exception as e:
        session.rollback()
        logger.error(f"Failed to disconnect connection: {e}")
    finally:
        session.close()


def delete_connection(conn_data: RabbitMQConnectionUpdateDelete) -> None:
    """Delete a connection."""
    session = get_thread_session()

    try:
        connection = session.exec(
            select(Connection).where(
                Connection.id == conn_data.id,
                Connection.organization_id == conn_data.organization_id,
            )
        ).first()

        if not connection:
            logger.warning(f"Connection with id {conn_data.id} not found for deletion.")
            return
        session.delete(connection)
        session.commit()
    except Exception as e:
        session.rollback()
        logger.error(f"Failed to delete connection: {e}")
    finally:
        session.close()


def get_total_connections(session: Session, organization_id: int) -> int:
    """Return total number of connections for an organization."""
    total_connections_stmt = select(func.count(Connection.id)).where(
        Connection.organization_id == organization_id
    )
    return session.scalar(total_connections_stmt) or 0


async def post_to_webhook_connections(
    organization_id: int,
    data: dict,
    category: CategoryType,
    sub_category: SubcategoryType | None,
):
    """Post given data to organization's webhook urls."""
    try:
        with get_thread_session() as db_session:
            webhook_urls = db_session.exec(
                select(Connection.url).where(
                    Connection.organization_id == organization_id,
                    Connection.provider_type == ProviderType.WEBHOOK,
                )
            ).all()

        if webhook_urls:
            payload = {
                "data": data,
                "category": category.value,
                "sub_category": sub_category.value if sub_category else None,
            }
            asyncio.create_task(send_webhooks(urls=webhook_urls, payload=payload))
    except Exception as e:
        logger.error(f"Failed to post to webhook connections: {e}")


async def send_webhooks(urls: list[str], payload: dict):
    """Send payload data to the given webhook URLs asynchronously."""
    async with httpx.AsyncClient(timeout=10.0) as http_client:
        tasks = [http_client.post(url, json=payload) for url in urls]
        await asyncio.gather(*tasks, return_exceptions=True)

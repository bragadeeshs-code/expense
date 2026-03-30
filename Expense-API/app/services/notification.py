"""Notification service."""

import json

from fastapi import HTTPException, status
from sqlmodel import Session, func, select, update

from app.config.logger import get_logger
from app.models.notification import Notification
from app.models.user import User
from app.schemas.notification import (
    MarkAllResponse,
    NotificationResponse,
    NotificationsResponse,
    NotificationType,
)
from app.services.redis.client import redis_client

logger = get_logger(__name__)


async def publish_notification(user_id: int, payload: dict):
    """Publish notification via redis."""
    channel = f"notifications-{user_id}"
    try:
        await redis_client.publish(channel, json.dumps(payload))
    except Exception as e:
        logger.error(f"Failed to publish notification to Redis: {e}")


async def create_notification(
    session: Session,
    user_id: int,
    message: str,
    notif_type: NotificationType,
    meta_data: dict,
) -> Notification:
    """Add and publish a notification and return it."""
    notif = Notification(
        user_id=user_id, message=message, type=notif_type, meta_data=meta_data
    )

    session.add(notif)
    session.flush()
    await publish_notification(
        user_id,
        {
            "id": notif.id,
            "user_id": user_id,
            "message": message,
            "type": notif_type,
            "meta_data": meta_data,
        },
    )
    return notif


def get_all_notifications(
    session: Session,
    current_user: User,
    page: int,
    per_page: int,
) -> NotificationsResponse:
    """Service to fetch all current user notications."""
    stmt = select(Notification).where(Notification.user_id == current_user.id)

    total = session.exec(select(func.count()).select_from(stmt.subquery())).first() or 0

    notifications = (
        session.exec(
            stmt.order_by(Notification.created_at.desc())
            .offset((page - 1) * per_page)
            .limit(per_page)
        )
        .unique()
        .all()
    )

    return NotificationsResponse(
        total=total,
        page=page,
        per_page=per_page,
        has_next_page=page * per_page < total,
        notifications=notifications,
    )


def mark_notification_as_read(
    session: Session, notification_id: int, current_user: User
) -> NotificationResponse:
    """Mark a single notification as read by setting is_read=True."""
    try:
        stmt = select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == current_user.id,
        )
        notification = session.exec(stmt).one_or_none()

        if not notification:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notification with id({notification_id}) not found.",
            )

        if notification.is_read:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Notification with id {notification_id} is already marked as read.",
            )

        notification.is_read = True
        session.commit()
        return notification
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark notification {notification_id} as read: {e}",
        )


def mark_all_notifications_as_read(
    session: Session,
    current_user: User,
) -> MarkAllResponse:
    """Bulk set is_read=True for all notifications of current_user."""
    try:
        stmt = (
            update(Notification)
            .where(
                Notification.user_id == current_user.id,
                Notification.is_read.is_(False),
            )
            .values(is_read=True)
        )
        result = session.exec(stmt)
        session.commit()
        return MarkAllResponse(total_read=result.rowcount)
    except Exception as e:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to mark all notifications as read for user {current_user.id}: {e}",
        )

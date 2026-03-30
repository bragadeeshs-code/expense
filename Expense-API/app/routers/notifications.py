"""Notification related routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlmodel import Session

from app.config.database import get_session
from app.dependencies.permission import require_user_permission
from app.models.user import User
from app.schemas.notification import (
    MarkAllResponse,
    NotificationResponse,
    NotificationsResponse,
)
from app.services.notification import (
    get_all_notifications,
    mark_all_notifications_as_read,
    mark_notification_as_read,
)
from app.services.redis.notification_stream import redis_event_stream

router = APIRouter(prefix="/notifications", tags=["Notifications"])


@router.get("/", response_model=NotificationsResponse)
def notifications(
    page: int = Query(1, ge=1),
    per_page: int = Query(10, le=100),
    session: Session = Depends(get_session),
    current_user=Depends(require_user_permission),
) -> NotificationsResponse:
    """Get all user notifications."""
    return get_all_notifications(session, current_user, page, per_page)


@router.get("/stream")
async def notifications_stream(
    current_user: Annotated[User, Depends(require_user_permission)],
):
    """SSE notifications stream for the authenticated user."""

    async def event_generator():
        async for event in redis_event_stream(current_user.id):
            yield event

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def read_notification(
    notification_id: int,
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
) -> NotificationResponse:
    """Mark user notification as read."""
    return mark_notification_as_read(db_session, notification_id, current_user)


@router.patch("/read-all", response_model=MarkAllResponse)
def read_all_notification(
    db_session: Annotated[Session, Depends(get_session)],
    current_user: Annotated[User, Depends(require_user_permission)],
) -> MarkAllResponse:
    """Mark all user notification as read."""
    return mark_all_notifications_as_read(db_session, current_user)

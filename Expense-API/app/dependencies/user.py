"""Dependency providers for trip."""

from fastapi import Query

from app.schemas.user import UserListFilters, UserStatus


def get_user_filters(
    search: str | None = Query(None),
    statuses: list[UserStatus] | None = Query(None),
    department_ids: list[int] | None = Query(None),
    role_ids: list[int] | None = Query(None),
    grade_ids: list[int] | None = Query(None),
    cost_center_ids: list[int] | None = Query(None),
) -> UserListFilters:
    """Parse query parameters into UserListFilters schema."""
    return UserListFilters(
        search=search,
        statuses=statuses,
        department_ids=department_ids,
        role_ids=role_ids,
        grade_ids=grade_ids,
        cost_center_ids=cost_center_ids,
    )

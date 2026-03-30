"""Main application router for the FastAPI application."""

from fastapi import APIRouter, Depends

from app.dependencies.auth import get_authenticated_user
from app.routers import (
    assets,
    connection,
    cost_center,
    dashboard,
    department,
    expense,
    grade,
    notifications,
    project,
    report,
    role,
    signup,
    travel_expense,
    trip,
    user,
    user_expense,
)

router = APIRouter(prefix="/v1")

router.include_router(assets.router)
router.include_router(connection.router)
router.include_router(cost_center.router)
router.include_router(dashboard.router)
router.include_router(department.router)
router.include_router(expense.router)
router.include_router(grade.router)
router.include_router(notifications.router)
router.include_router(project.router)
router.include_router(report.router)
router.include_router(role.router)
router.include_router(
    signup.router,
    dependencies=[Depends(get_authenticated_user)],
    include_in_schema=False,
)
router.include_router(travel_expense.router)
router.include_router(trip.router)
router.include_router(user.router)
router.include_router(user_expense.router)

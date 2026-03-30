"""Constant file for user."""

from app.models.user import User

REQUIRED_COLUMNS = {
    "first name",
    "last name",
    "email",
    "mobile number",
    "grade",
    "code",
    "role",
    "cost center",
    "department",
    "reporting manager code",
}

FILTER_MAP = {
    "department_ids": lambda v: User.department_id.in_(v),
    "statuses": lambda v: User.status.in_(v),
    "role_ids": lambda v: User.role_id.in_(v),
    "grade_ids": lambda v: User.grade_id.in_(v),
    "cost_center_ids": lambda v: User.cost_center_id.in_(v),
}

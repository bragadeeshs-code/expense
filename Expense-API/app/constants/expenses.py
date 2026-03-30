"""Expense-related constants."""

from sqlmodel import func, literal_column

from app.models.expense import Expense
from app.models.project import Project
from app.models.user import User
from app.models.user_expense import UserExpense
from app.schemas.expense import (
    ExpenseManagerSortColumn,
    ExpenseSortColumn,
    FinancerExpenseSortColumn,
)
from app.schemas.grade import FlightClassEnum, TrainClassEnum

ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/bmp",
    "image/heic",
    "text/plain",
    "text/csv",
}

OOXML_MIME_TO_EXT = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-excel.sheet.macroEnabled.12": "xlsm",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
    "application/vnd.ms-word.document.macroEnabled.12": "docm",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx",
    "application/vnd.ms-powerpoint.presentation.macroEnabled.12": "pptm",
}

FLIGHT_CLASS_RANK = {
    FlightClassEnum.ECONOMY: 1,
    FlightClassEnum.PREMIUM_ECONOMY: 2,
    FlightClassEnum.BUSINESS: 3,
}

TRAIN_CLASS_RANK = {
    TrainClassEnum.TIER_1: 1,
    TrainClassEnum.TIER_2: 2,
    TrainClassEnum.TIER_3: 3,
}


TEAM_EXPENSE_SORT_MAP = {
    ExpenseManagerSortColumn.BILL_DATE: Expense.bill_date,
    ExpenseManagerSortColumn.NAME: User.first_name,
    ExpenseManagerSortColumn.PROJECT_CODE: Project.code,
    ExpenseManagerSortColumn.AMOUNT: UserExpense.amount,
    ExpenseManagerSortColumn.STATUS: UserExpense.status,
    ExpenseManagerSortColumn.CATEGORY: Expense.category,
    ExpenseManagerSortColumn.SUB_CATEGORY: Expense.sub_category,
    ExpenseManagerSortColumn.UPDATED_AT: UserExpense.updated_at,
}


EXPENSE_SORT_MAP = {
    ExpenseSortColumn.TOTAL_AMOUNT: Expense.total_amount,
    ExpenseSortColumn.PROJECT_CODE: Project.code,
    ExpenseSortColumn.STATUS: UserExpense.status,
    ExpenseSortColumn.BILL_DATE: Expense.bill_date,
    ExpenseSortColumn.VENDOR_NAME: Expense.vendor_name,
    ExpenseSortColumn.UPDATED_AT: Expense.updated_at,
    ExpenseSortColumn.CATEGORY: Expense.category,
    ExpenseSortColumn.SUB_CATEGORY: Expense.sub_category,
    ExpenseSortColumn.NAME: Expense.name,
}


EMPLOYEE_NAME_COL = func.concat(User.first_name, literal_column("' '"), User.last_name)

FINANCER_SORT_MAP = {
    FinancerExpenseSortColumn.EMPLOYEE_NAME: EMPLOYEE_NAME_COL,
    FinancerExpenseSortColumn.AMOUNT: UserExpense.amount,
    FinancerExpenseSortColumn.CATEGORY: Expense.category,
    FinancerExpenseSortColumn.SUBMITTED_AT: UserExpense.submitted_at,
    FinancerExpenseSortColumn.STATUS: UserExpense.status,
}


FINANCER_FILTER_MAP = {
    "employee_ids": lambda v: User.id.in_(v),
    "category": lambda v: Expense.category.in_(v),
    "submitted_at": lambda v: func.date(UserExpense.submitted_at) == v,
    "status": lambda v: UserExpense.status.in_(v),
}

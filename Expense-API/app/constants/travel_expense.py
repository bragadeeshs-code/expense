"""Travel expense related constants."""

from decimal import Decimal

from app.schemas.travel_expense import Vehicles

CARBON_EMISSION = {
    Vehicles.CAR: Decimal("0.171"),  # kg CO2 per kilometer
    Vehicles.BIKE: Decimal("0.101"),  # kg CO2 per kilometer
}


TRAVEL_EXPENSE_MAX_FILE_SIZE = 3 * 1024 * 1024  # 3 MB

ALLOWED_EXTENSIONS = {
    ".pdf",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".jpg",
    ".jpeg",
    ".png",
    ".txt",
    ".csv",
}

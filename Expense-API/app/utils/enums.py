"""Enum validation helpers."""

from fastapi import HTTPException, status

from app.schemas.expense import CategoryType, SubcategoryType
from app.schemas.grade import (
    AutoApprovalThresholdType,
    FlightClassEnum,
    TrainClassEnum,
)


def parse_category(value) -> CategoryType:
    """Return parsed valid CategoryType or OTHERS."""
    try:
        return CategoryType(value)
    except ValueError:
        return CategoryType.OTHERS


def parse_subcategory(value) -> SubcategoryType | None:
    """Return parsed valid SubCategoryType or None."""
    try:
        return SubcategoryType(value)
    except ValueError:
        return None


def is_valid_train_class(value, raise_exc: bool = True) -> TrainClassEnum | None:
    """Validate and return TrainClassEnum."""
    try:
        normalized = str(value).strip().lower()
        return TrainClassEnum(normalized)
    except ValueError:
        if raise_exc:
            raise HTTPException(
                detail="Invalid train class",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )
        return None


def is_valid_flight_class(value, raise_exc: bool = True) -> FlightClassEnum | None:
    """Validate and return FlightClassEnum."""
    try:
        normalized = str(value).strip().lower()
        return FlightClassEnum(normalized)
    except ValueError:
        if raise_exc:
            raise HTTPException(
                detail="Invalid flight class",
                status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            )
        return None


def is_valid_auto_approve_threshold_type(value):
    """Return True if the value is a valid AutoApprovalThresholdType."""
    try:
        AutoApprovalThresholdType(value)
    except ValueError:
        raise HTTPException(
            detail="Invalid auto approve threshold type",
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
        )

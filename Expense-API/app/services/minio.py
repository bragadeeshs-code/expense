"""MinIO service functions."""

import io
from datetime import timedelta

from app.config.config import settings
from app.config.minio import client


def get_presigned_download_url(
    expense_name: str,
    organization_id: int,
    user_id: int,
    expiry_seconds: int = 3600,
):
    """Generate a presigned download URL for a given expense."""
    expense_file_key = build_expense_file_key(
        expense_name=expense_name,
        organization_id=organization_id,
        user_id=user_id,
    )
    return client.presigned_get_object(
        bucket_name=settings.BUCKET_NAME,
        object_name=expense_file_key,
        expires=timedelta(seconds=expiry_seconds),
    )


def upload_object(
    expense_name: str,
    organization_id: int,
    file: bytes,
    mime_type: str,
    user_id: int,
) -> None:
    """Upload a file to MinIO storage."""
    expense_file_key = build_expense_file_key(
        expense_name=expense_name,
        organization_id=organization_id,
        user_id=user_id,
    )
    client.put_object(
        bucket_name=settings.BUCKET_NAME,
        object_name=expense_file_key,
        data=io.BytesIO(file),
        length=len(file),
        content_type=mime_type,
    )


def upload_mileage_calculator_notes_files(
    travel_expense_id: int,
    notes_file_name: str,
    uploaded_file: bytes,
    mime_type: str,
    notes_id: int,
):
    """Upload mileage calculator notes file to MinIO storage."""
    notes_file_key = build_mileage_calculator_notes_file_key(
        travel_expense_id, notes_id, notes_file_name
    )

    client.put_object(
        bucket_name=settings.BUCKET_NAME,
        object_name=notes_file_key,
        data=io.BytesIO(uploaded_file),
        length=len(uploaded_file),
        content_type=mime_type,
    )


def delete_object(expense_name: str, organization_id: int, user_id: int) -> None:
    """Delete a file from MinIO storage."""
    expense_file_key = build_expense_file_key(
        expense_name=expense_name,
        organization_id=organization_id,
        user_id=user_id,
    )
    client.remove_object(settings.BUCKET_NAME, expense_file_key)


def build_expense_file_key(
    organization_id: int,
    user_id: int,
    expense_name: str,
) -> str:
    """Build the MinIO object key for an expense file."""
    return f"{organization_id}/{user_id}/{expense_name}"


def get_file_notes_presigned_download_url(
    travel_expense_id: int,
    notes_id: int,
    notes_file_name: str,
    expiry_seconds: int = 3600,
) -> str:
    """Generate presigned download URL for a notes file."""
    notes_file_key = build_mileage_calculator_notes_file_key(
        travel_expense_id, notes_id, notes_file_name
    )

    return client.presigned_get_object(
        bucket_name=settings.BUCKET_NAME,
        object_name=notes_file_key,
        expires=timedelta(seconds=expiry_seconds),
    )


def build_mileage_calculator_notes_file_key(
    travel_expense_id: int, notes_id: int, notes_file_name: str
) -> str:
    """Build MinIO object key for mileage notes file."""
    return f"mileage_calculator_notes/{travel_expense_id}/{notes_id}/{notes_file_name}"

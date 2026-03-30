"""MinIO client configuration and bucket management."""

from urllib.parse import urlparse

from fastapi import HTTPException, status
from minio import Minio
from minio.error import S3Error

from app.config.config import settings


def get_minio_client():
    """Create and return a MinIO client instance."""
    parsed_url = urlparse(str(settings.MINIO_URL))
    return Minio(
        endpoint=parsed_url.netloc,
        access_key=settings.MINIO_ROOT_USER,
        secret_key=settings.MINIO_ROOT_PASSWORD,
        secure=(parsed_url.scheme == "https"),
    )


client = get_minio_client()


async def ensure_bucket_exists():
    """Ensure that the specified MinIO bucket exists."""
    try:
        if not client.bucket_exists(settings.BUCKET_NAME):
            client.make_bucket(settings.BUCKET_NAME)
    except S3Error as e:
        if e.code in ["BucketAlreadyOwnedByYou", "BucketAlreadyExists"]:
            pass
        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to ensure bucket: {e!s}",
            )

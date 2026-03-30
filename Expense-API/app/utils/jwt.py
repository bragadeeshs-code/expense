"""Utility module for handling JWT operations."""

from datetime import datetime, timedelta, timezone

import jwt
from jwt import ExpiredSignatureError, PyJWTError

from app.config.config import settings


class JWTManager:
    """JWT Manager for encoding and decoding JWT tokens."""

    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60

    def create_access_token(self, payload: dict) -> str:
        """Create access token."""
        data = payload.copy()
        data["exp"] = datetime.now(timezone.utc) + timedelta(
            minutes=self.ACCESS_TOKEN_EXPIRE_MINUTES
        )

        return jwt.encode(
            data,
            settings.SECRET_KEY,
            algorithm=self.ALGORITHM,
        )

    def decode_token(self, token: str) -> dict:
        """Decode a JWT token and return the email contained within."""
        try:
            return jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[self.ALGORITHM],
            )
        except ExpiredSignatureError:
            raise ValueError("Token has expired")
        except PyJWTError as e:
            raise ValueError(f"Token decode error: {str(e)}")

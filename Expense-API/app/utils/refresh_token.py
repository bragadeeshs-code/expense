"""Utility for verifying refresh tokens issued by the Auth service."""

import jwt
from jwt import ExpiredSignatureError, PyJWTError

from app.config.config import settings


class RefreshTokenVerifier:
    """Verifies refresh tokens issued by the Auth service."""

    ALGORITHM = "RS256"

    @staticmethod
    def decode(token: str) -> dict:
        """Decode and validate a refresh token."""
        try:
            return jwt.decode(
                token,
                settings.AUTH_PUBLIC_KEY_PEM,
                algorithms=[RefreshTokenVerifier.ALGORITHM],
                audience="expense",
                issuer="auth",
            )
        except ExpiredSignatureError:
            raise ValueError("Refresh token expired")
        except PyJWTError as e:
            raise ValueError(f"Invalid refresh token: {e}")

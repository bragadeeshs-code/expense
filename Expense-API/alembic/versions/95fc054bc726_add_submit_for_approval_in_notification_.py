"""add Submit for approval in notification type

Revision ID: 95fc054bc726
Revises: ae29491cfd6c
Create Date: 2025-12-19 12:22:25.306367
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "95fc054bc726"
down_revision: Union[str, Sequence[str], None] = "ae29491cfd6c"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # PostgreSQL ENUMs are immutable; values must be added explicitly
    op.execute(
        """
        ALTER TYPE notificationtype
        ADD VALUE IF NOT EXISTS 'SUBMIT_FOR_APPROVAL';
        """
    )


def downgrade() -> None:
    """Downgrade schema."""
    # ❗ PostgreSQL does NOT support removing enum values safely.
    # Downgrade intentionally left empty.
    pass

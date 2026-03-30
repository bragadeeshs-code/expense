"""Add phone_number, backfill from phone_number_id, and enforce NOT NULL

Revision ID: 26543cf589b6
Revises: 4a409176b440
Create Date: 2026-01-20 11:43:07.136101

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "26543cf589b6"
down_revision: Union[str, Sequence[str], None] = "4a409176b440"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""

    # 1. Add phone_number column as nullable
    op.add_column(
        "whatsapp_configurations",
        sa.Column("phone_number", sa.String(), nullable=True),
    )

    # 2. Backfill phone_number from phone_number_id
    op.execute(
        """
        UPDATE whatsapp_configurations
        SET phone_number = phone_number_id
        WHERE phone_number IS NULL
        """
    )

    # 3. Make phone_number NOT NULL
    op.alter_column(
        "whatsapp_configurations",
        "phone_number",
        existing_type=sa.String(),
        nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""

    # Revert schema change
    op.drop_column("whatsapp_configurations", "phone_number")

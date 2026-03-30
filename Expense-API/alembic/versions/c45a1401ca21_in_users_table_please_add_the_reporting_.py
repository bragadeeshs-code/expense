"""in users table please add the reporting_manager columns.

Revision ID: c45a1401ca21
Revises: 3dd5b1822e08
Create Date: 2026-02-11 10:32:41.010708

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c45a1401ca21"
down_revision: Union[str, Sequence[str], None] = "3dd5b1822e08"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "users",
        sa.Column(
            "reporting_manager_id",
            sa.Integer(),
            sa.ForeignKey(
                "users.id",
                name="fk_users_reporting_manager_id",
                ondelete="SET NULL",
            ),
            nullable=True,
        ),
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("users", "reporting_manager_id")

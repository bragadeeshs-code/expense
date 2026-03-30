"""new fields in grade

Revision ID: 31fa2d6e92d8
Revises: 7a3b3d016c6f
Create Date: 2025-12-08 13:52:32.741975

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = "31fa2d6e92d8"
down_revision: Union[str, Sequence[str], None] = "7a3b3d016c6f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add columns as nullable first
    op.add_column(
        "grades", sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=True)
    )
    op.add_column(
        "grades",
        sa.Column("daily_limit", sa.Numeric(precision=18, scale=2), nullable=True),
    )
    op.add_column(
        "grades",
        sa.Column("monthly_limit", sa.Numeric(precision=18, scale=2), nullable=True),
    )
    op.add_column(
        "grades",
        sa.Column("currency", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
    )
    op.add_column(
        "grades",
        sa.Column(
            "auto_approval_threshold", sa.Numeric(precision=18, scale=2), nullable=True
        ),
    )

    op.execute("""
        UPDATE grades
        SET name = 'Grade_' || id,
            daily_limit = 1000,
            monthly_limit = 50000,
            currency = '₹',
            auto_approval_threshold = 50000
        WHERE name IS NULL
    """)

    # Alter columns to be NOT NULL
    op.alter_column("grades", "name", nullable=False)
    op.alter_column("grades", "daily_limit", nullable=False)
    op.alter_column("grades", "monthly_limit", nullable=False)
    op.alter_column("grades", "currency", nullable=False)
    op.alter_column("grades", "auto_approval_threshold", nullable=False)

    # Create index
    op.create_index(op.f("ix_grades_name"), "grades", ["name"], unique=False)

    # Add unique constraint on name + organization_id
    op.create_unique_constraint(
        "uq_grades_name_org", "grades", ["name", "organization_id"]
    )

    # Drop old column
    op.drop_column("grades", "expense_limit")


def downgrade() -> None:
    """Downgrade schema."""
    # Add expense_limit as nullable first
    op.add_column(
        "grades",
        sa.Column("expense_limit", sa.INTEGER(), autoincrement=False, nullable=True),
    )

    # Backfill existing rows with a default value (choose appropriate value)
    op.execute("""
        UPDATE grades
        SET expense_limit = 10000
        WHERE expense_limit IS NULL
    """)

    # Alter column to be NOT NULL
    op.alter_column("grades", "expense_limit", nullable=False)

    # Drop unique constraint
    op.drop_constraint("uq_grades_name_org", "grades", type_="unique")

    # Drop new columns and index
    op.drop_index(op.f("ix_grades_name"), table_name="grades")
    op.drop_column("grades", "auto_approval_threshold")
    op.drop_column("grades", "currency")
    op.drop_column("grades", "monthly_limit")
    op.drop_column("grades", "daily_limit")
    op.drop_column("grades", "name")

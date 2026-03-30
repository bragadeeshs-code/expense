"""convert bill date to date in expense

Revision ID: 4062759a6b3d
Revises: b90a1b39e089
Create Date: 2026-02-27 16:42:05.275206
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "4062759a6b3d"
down_revision: Union[str, Sequence[str], None] = "b90a1b39e089"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "expenses",
        "bill_date",
        existing_type=sa.VARCHAR(),
        type_=sa.Date(),
        existing_nullable=True,
        postgresql_using="""
        CASE

            -- DD/MM/YY  (6/3/25)
            WHEN bill_date ~ '^\\d{1,2}/\\d{1,2}/\\d{2}$'
                THEN TO_DATE(bill_date, 'DD/MM/YY')

            -- DD/MM/YYYY (21/11/2025)
            WHEN bill_date ~ '^\\d{1,2}/\\d{1,2}/\\d{4}$'
                THEN TO_DATE(bill_date, 'DD/MM/YYYY')

            -- DD-MM-YYYY (15-09-2025)
            WHEN bill_date ~ '^\\d{1,2}-\\d{1,2}-\\d{4}$'
                THEN TO_DATE(bill_date, 'DD-MM-YYYY')

            -- DD.MM.YY (18.02.26)
            WHEN bill_date ~ '^\\d{1,2}\\.\\d{1,2}\\.\\d{2}$'
                THEN TO_DATE(bill_date, 'DD.MM.YY')

            -- DD.MM.YYYY
            WHEN bill_date ~ '^\\d{1,2}\\.\\d{1,2}\\.\\d{4}$'
                THEN TO_DATE(bill_date, 'DD.MM.YYYY')

            -- ISO YYYY-MM-DD
            WHEN bill_date ~ '^\\d{4}-\\d{2}-\\d{2}$'
                THEN bill_date::date

            -- Month Day Year (Oct 17th 2025)
            WHEN bill_date ~ '^[A-Za-z]+\\s+\\d{1,2}(st|nd|rd|th)?\\s+\\d{4}$'
                THEN TO_DATE(
                    regexp_replace(
                        bill_date,
                        '(st|nd|rd|th)',
                        '',
                        'g'
                    ),
                    'Mon DD YYYY'
                )

            ELSE NULL
        END
        """,
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.alter_column(
        "expenses",
        "bill_date",
        existing_type=sa.Date(),
        type_=sa.VARCHAR(),
        existing_nullable=True,
        postgresql_using="bill_date::text",
    )

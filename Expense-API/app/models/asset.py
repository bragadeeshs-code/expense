"""Asset model for storing asset data."""

from datetime import datetime
from typing import TYPE_CHECKING, Optional

from sqlmodel import (
    Column,
    DateTime,
    Enum,
    Field,
    ForeignKey,
    Integer,
    Relationship,
    SQLModel,
    String,
    UniqueConstraint,
    func,
)

from app.schemas.asset import AssetCategory, FuelType, GeneratorType, VehicleType

if TYPE_CHECKING:
    from user import User


class Asset(SQLModel, table=True):
    """Database model for assets."""

    __tablename__ = "assets"

    __table_args__ = (
        UniqueConstraint(
            "organization_id",
            "asset_code",
            name="uq_assets_org_asset_code",
        ),
    )

    id: int | None = Field(
        sa_column=Column(
            Integer,
            default=None,
            primary_key=True,
            index=True,
        ),
    )
    organization_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(
                "organizations.id",
                name="fk_asset_organization_id",
                ondelete="CASCADE",
            ),
        )
    )
    category: AssetCategory = Field(
        sa_column=Column(
            Enum(AssetCategory),
            nullable=False,
            index=True,
        ),
    )
    vehicle_type: VehicleType | None = Field(
        sa_column=Column(
            Enum(VehicleType),
            default=None,
            nullable=True,
        ),
    )
    generator_type: GeneratorType | None = Field(
        sa_column=Column(
            Enum(GeneratorType),
            default=None,
            nullable=True,
        ),
    )
    asset_code: str = Field(
        sa_column=Column(String, nullable=False),
    )
    make_model: str = Field(
        sa_column=Column(String, nullable=False),
    )
    fuel_type: FuelType = Field(
        sa_column=Column(
            Enum(FuelType),
            nullable=False,
        ),
    )
    operator_user_id: int = Field(
        sa_column=Column(
            Integer,
            ForeignKey(
                "users.id",
                name="fx_asset_operator_user_id",
                ondelete="RESTRICT",
            ),
            nullable=False,
        )
    )
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            nullable=False,
        )
    )
    updated_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            server_default=func.now(),
            onupdate=func.now(),
            nullable=False,
        )
    )
    operator: Optional["User"] = Relationship(back_populates="operated_assets")

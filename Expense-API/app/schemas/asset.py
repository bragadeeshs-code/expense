"""Asset schemas and enums."""

from enum import Enum

from pydantic import BaseModel, ConfigDict, Field, model_validator

from app.constants.types import NonEmptyStr


class SortOrder(str, Enum):
    """Schema for sort order."""

    asc = "asc"
    desc = "desc"


class AssetSortBy(str, Enum):
    """Schema for asset sortby."""

    created_at = "created_at"
    updated_at = "updated_at"
    asset_code = "asset_code"
    make_model = "make_model"


class AssetCategory(str, Enum):
    """Asset categories."""

    VEHICLE = "vehicle"
    GENERATOR = "generator"


class FuelType(str, Enum):
    """Supported fuel types for assets."""

    PETROL = "petrol"
    DIESEL = "diesel"
    CNG = "cng"
    LPG = "lpg"
    ELECTRIC = "electric"
    HYBRID = "hybrid"
    HYDROGEN = "hydrogen"
    NATURAL_GAS = "natural_gas"
    BIO_DIESEL = "bio_diesel"
    DUAL_FUEL = "dual_fuel"

    @classmethod
    def for_vehicle(cls):
        """Return fuel types allowed for vehicles."""
        return {
            cls.DIESEL,
            cls.PETROL,
            cls.CNG,
            cls.LPG,
            cls.ELECTRIC,
            cls.HYBRID,
            cls.HYDROGEN,
        }

    @classmethod
    def for_generator(cls):
        """Return fuel types allowed for generators."""
        return {
            cls.DIESEL,
            cls.PETROL,
            cls.LPG,
            cls.NATURAL_GAS,
            cls.BIO_DIESEL,
            cls.DUAL_FUEL,
        }


class VehicleType(str, Enum):
    """Vehicle types."""

    SEDAN = "sedan"
    SUV = "suv"
    VAN = "van"
    TRUCK = "truck"


class GeneratorType(str, Enum):
    """Generator types."""

    INDUSTRIAL_BACKUP_UNIT = "industrial_backup_unit"


class BaseAsset(BaseModel):
    """Schema for asset response."""

    category: AssetCategory
    fuel_type: FuelType
    asset_code: NonEmptyStr
    make_model: NonEmptyStr
    vehicle_type: VehicleType | None = None
    generator_type: GeneratorType | None = None

    @model_validator(mode="after")
    def validate_asset(self):
        """Validate asset fields based on category."""
        if self.category == AssetCategory.VEHICLE:
            if not self.vehicle_type:
                raise ValueError("vehicle_type is required for vehicles")
            if self.generator_type:
                raise ValueError("generator_type not allowed for vehicles")
            if self.fuel_type not in FuelType.for_vehicle():
                raise ValueError("fuel_type not allowed for vehicles")

        if self.category == AssetCategory.GENERATOR:
            if not self.generator_type:
                raise ValueError("generator_type is required for generators")
            if self.vehicle_type:
                raise ValueError("vehicle_type not allowed for generators")
            if self.fuel_type not in FuelType.for_generator():
                raise ValueError("fuel_type not allowed for generators")

        return self


class AssetCreate(BaseAsset):
    """Schema for creating an asset."""

    operator_user_id: int


class AssetResponse(AssetCreate):
    """Schema for asset response."""

    id: int


class AssetListQuery(BaseModel):
    """Schema for asset list query."""

    page: int = Field(1, ge=1)
    search: str | None = None
    sort_by: AssetSortBy = AssetSortBy.updated_at
    per_page: int = Field(10, ge=1, le=50)
    category: AssetCategory | None = None
    fuel_type: FuelType | None = None
    sort_order: SortOrder = SortOrder.desc
    vehicle_type: VehicleType | None = None
    generator_type: GeneratorType | None = None


class OperatorInfo(BaseModel):
    """Schema for operator info."""

    id: int
    first_name: str
    last_name: str

    model_config = ConfigDict(from_attributes=True)


class AssetItem(BaseAsset):
    """Schema for asset item in list response."""

    operator: OperatorInfo
    id: int

    model_config = ConfigDict(from_attributes=True)


class AssetListResponse(BaseModel):
    """Schema for assets response."""

    page: int
    per_page: int
    total: int
    data: list[AssetItem]


class AssetUpdate(AssetCreate):
    """Schema for updating an asset."""

    pass


class AssetDeleteResponse(BaseModel):
    """Schema for asset deletion response."""

    id: int


class AssetOverview(BaseModel):
    """Category-wise asset count summary."""

    category: AssetCategory
    category_count: int

    model_config = ConfigDict(from_attributes=True)

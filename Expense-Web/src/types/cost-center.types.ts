import type { Pagination } from "./common.types";

export interface CostCenterBase {
  code: string;
}

export interface CostCenterResponse extends CostCenterBase {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface CostCentersListResponse extends Pagination {
  data: CostCenterResponse[];
}

export interface CostCenterUpdateParams {
  id: number;
  data: CostCenterBase;
}

export interface CostCenterDeleteResponse {
  id: number;
}

export interface CostCenterItem extends CostCenterBase {
  id: number;
}

import type { Pagination } from "@/types/common.types";

export interface AdvanceItem {
  id: number;
  trip_id: number;
  trip_created_at: string;
  employee: string;
  advance_issued: string;
  issued_date: string;
  balance_amount: string;
}

export interface AdvancesListResponse extends Pagination {
  data: AdvanceItem[];
}

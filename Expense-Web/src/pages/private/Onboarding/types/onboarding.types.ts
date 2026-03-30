import type { Pagination } from "@/types/common.types";
import type {
  SourceEnum,
  ONBOARDING_STEP_ENUM,
  ConnectionProviderEnum,
} from "../helpers/constants/onboarding";

export type FolderData = {
  id: string;
  name: string;
};

export type ConfigurationResponse = {
  auto_sync: boolean;
  last_sync?: boolean;
  sync_interval?: string;
  folders: FolderData[];
  auto_label: boolean;
};

export interface Step {
  id: ONBOARDING_STEP_ENUM;
  label: string;
}

export interface Connection {
  id: number;
  status: "connected" | "disconnected";
  expires_at?: string;
  created_at?: string;
  updated_at?: string;
  source_type: SourceEnum;
  access_token?: string;
  provider_type: ConnectionProviderEnum;
  refresh_token?: string;
  connection_email?: string;
  webhook_url?: string;
  phone_number_id?: number;
  connection_configuration?: ConfigurationResponse;
  tally_configuration?: TallyConfigurationResponse;
  whatsapp_configuration?: WhatsappConfigurationResponse;
}

// ORGANIZATION SETUP

export interface CompanyAssetsListFilter {
  page: number;
  perPage?: number;
  search: string;
}

export interface CompanyAssetItem {
  category: string;
  fuel_type: string;
  asset_code: string;
  make_model: string;
  vehicle_type: string;
  generator_type?: string;
  id: number;
  operator: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export type companyAssetForm = "Generator" | "Vehicle";

export interface AddCompanyAssetPayload {
  category: string;
  fuel_type: string;
  asset_code: string;
  make_model: string;
  vehicle_type?: string;
  generator_type?: string;
  operator_user_id: number;
}

export interface AddCompanyAssetResponse {
  category: string;
  fuel_type: string;
  asset_code: string;
  make_model: string;
  vehicle_type: string;
  generator_type: string;
  operator_user_id: number;
  id: number;
}

export interface CompanyAssetsListResponse extends Pagination {
  data: CompanyAssetItem[];
}

export interface DeleteCompanyAssetResponse {
  id: number;
}

export interface ReconnectResponse {
  status: string;
  provider_type: ConnectionProviderEnum;
  email: string;
  url: string;
  phone_number_id: string;
  source_type: SourceEnum;
}

type DataSource = {
  name: string;
  type: ConnectionProviderEnum;
  image: string;
};

type PaginationProps = {
  page: number;
  total: number;
  perPage: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
  hasNextPage: boolean;
};

type TallyConfigurationPayload = {
  url: string;
  username: string;
  password?: string;
};

type TallyConfigurationResponse = Omit<TallyConfigurationPayload, "password">;

interface WhatsappConnectionPayload {
  phone_number_id: string;
  whatsapp_token: string;
}

interface WhatsappConnectionResponse {
  phone_number_id: number;
}

interface WhatsappConfigurationResponse extends WhatsappConnectionResponse {
  verification_token: string;
  phone_number: number;
}

type AccessTokenResponse = {
  access_token: string;
};

type DriveConfigurationPayload = {
  auto_sync: boolean;
  folders: FolderData[];
};

type FoldersResponse = {
  values: FolderData[];
};

type DisconnectConnectionResponse = {
  id: number;
  user_id: number;
  connection_email: string;
  provider_type: ConnectionProviderEnum;
  source_type: SourceEnum;
  status: string;
  created_at: string;
  updated_at: string;
};

type DeleteConnectionResponse = Omit<DisconnectConnectionResponse, "status">;

type ConnectionListResponse = {
  page: number;
  total: number;
  per_page: number;
  items: Connection[];
  has_next_page: boolean;
};

type ConnectionListPagination = Omit<ConnectionListResponse, "items">;

type ConnectionFilters = {
  page?: number;
  per_page?: number;
  provider_type?: ConnectionProviderEnum;
  source_type?: SourceEnum;
  status?: string;
  sort_by?:
    | "id"
    | "connection_email"
    | "provider_type"
    | "source_type"
    | "status"
    | "created_at"
    | "updated_at";
  sort_dir?: "asc" | "desc";
};

type TallyConfigurationResponse = {
  url: string;
  username: string;
};

interface OneDriveFileItem {
  id: string;
  name: string;
  is_folder: boolean;
}

type OneDriveFileItemList = OneDriveFileItem[];

interface OneDriveFileListResponse {
  parent_id: string | null;
  next_cursor: string | null;
  items: OneDriveFileItemList;
}

interface ConnectionResponse {
  status: "connected";
  provider_type: ConnectionProviderEnum;
  email: string;
  source_type: SourceEnum;
  phone_number_id?: string;
}

interface WhatsAppVerifyTokenResponse {
  webhook_url: string;
  verify_token: string;
}

// GRADES

interface Grade {
  id: number;
  name: string;
}

interface Role {
  id: number;
  name: RoleEnum;
}

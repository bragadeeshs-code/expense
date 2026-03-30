import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import axiosInstance, { axiosConnectorsInstance } from "@/lib/axios";
import type {
  ConfigurationResponse,
  ReconnectResponse,
} from "@/pages/private/Onboarding/types/onboarding.types";

export const getConnections = async (
  filters: ConnectionFilters = {},
): Promise<ConnectionListResponse> => {
  const { data } = await axiosInstance.get<ConnectionListResponse>(
    ENDPOINTS.CONNECTION.GET_ALL,
    { params: filters },
  );
  return data;
};

export const configureConnection = async (
  connectionId: number,
  data: DriveConfigurationPayload,
) => {
  const response = await axiosConnectorsInstance.post<ConfigurationResponse>(
    ENDPOINTS.CONNECTION.UPDATE(connectionId),
    data,
  );
  return response.data;
};

export const disconnectConnection = async (connectionId: number) => {
  const response =
    await axiosConnectorsInstance.patch<DisconnectConnectionResponse>(
      ENDPOINTS.CONNECTION.DISCONNECT(connectionId),
    );
  return response.data;
};

export const connectTally = async (data: TallyConfigurationPayload) => {
  const response =
    await axiosConnectorsInstance.post<TallyConfigurationResponse>(
      ENDPOINTS.CONNECTION.TALLY,
      data,
    );
  return response.data;
};

export const configureTally = async (
  id: number,
  data: TallyConfigurationResponse,
) => {
  const response =
    await axiosConnectorsInstance.post<TallyConfigurationResponse>(
      ENDPOINTS.CONNECTION.UPDATE(id),
      data,
    );
  return response.data;
};

export const deleteConnection = async (connectionId: number) => {
  const response =
    await axiosConnectorsInstance.delete<DeleteConnectionResponse>(
      ENDPOINTS.CONNECTION.DELETE(connectionId),
    );
  return response.data;
};

export const getAccessToken = async (connection_id: number) => {
  const response = await axiosConnectorsInstance.get<AccessTokenResponse>(
    ENDPOINTS.CONNECTION.ACCESS_TOKEN(connection_id),
  );
  return response.data;
};

export const getFolders = async (connectionId: number) => {
  const response = await axiosConnectorsInstance.get<FoldersResponse>(
    ENDPOINTS.CONNECTION.LABELS(connectionId),
  );
  return response.data;
};

export const getFiles = async (
  id: number,
  parent_id?: string | null,
  cursor?: string | null,
): Promise<OneDriveFileListResponse> => {
  const params = new URLSearchParams();
  if (parent_id) params.append("parent_id", parent_id);
  if (cursor) params.append("cursor", cursor);

  const { data } = await axiosConnectorsInstance.get<OneDriveFileListResponse>(
    `${ENDPOINTS.CONNECTION.FOLDERS(id)}?${params}`,
  );

  return data;
};

export const connectWhatsapp = async (
  whatsAppPayload: WhatsappConnectionPayload,
) => {
  const response =
    await axiosConnectorsInstance.post<WhatsappConnectionResponse>(
      ENDPOINTS.CONNECTION.WHATSAPP,
      whatsAppPayload,
    );
  return response.data;
};

export const reConnectConnection = async (connectionId: number) => {
  const response = await axiosConnectorsInstance.patch<ReconnectResponse>(
    ENDPOINTS.CONNECTION.RECONNECT(connectionId),
  );
  return response.data;
};

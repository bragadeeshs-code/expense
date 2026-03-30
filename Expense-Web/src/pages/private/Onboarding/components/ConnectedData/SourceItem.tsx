import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { Loader, Trash2, Unplug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import {
  deleteConnection,
  disconnectConnection,
  reConnectConnection,
} from "@/services/connection.service";
import {
  ConnectionProviderEnum,
  NON_CONFIGURABLE_PROVIDERS,
  SourceEnum,
  dataSourceIcons,
  dataSourceNames,
  supportedProviders,
} from "../../helpers/constants/onboarding";
import ConnectionConfigureButton from "./ConnectionConfigureButton";
import type { Connection } from "../../types/onboarding.types";

interface SourceItemProps {
  item: Connection;
  onConnectionComplete: () => void;
}

const SourceItem: React.FC<SourceItemProps> = ({
  item,
  onConnectionComplete,
}) => {
  const isGoogleMap = item.provider_type === ConnectionProviderEnum.GOOGLE_MAP;

  const { mutate: disconnectConnectionMutate, isPending: isDisconnecting } =
    useMutation({
      mutationFn: () => disconnectConnection(item.id),
      onSuccess: () => {
        notifySuccess(
          "Connection",
          "Your connection have been successfully disconnected.",
        );
        onConnectionComplete();
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError("Connection", formatApiError(error));
      },
    });

  const { mutate: deleteConnectionMutate, isPending: isDeleting } = useMutation(
    {
      mutationFn: () => deleteConnection(item.id),

      onSuccess() {
        onConnectionComplete();
        notifySuccess(
          "Connection",
          "Your connection have been successfully deleted.",
        );
      },
      onError(error: AxiosError<APIErrorResponse>) {
        notifyError("Connection", formatApiError(error));
      },
    },
  );

  const { mutate: mutateReconnect, isPending: isReconnecting } = useMutation({
    mutationFn: () => reConnectConnection(item.id),
    onSuccess: () => {
      notifySuccess(
        "Reconnection Succeed",
        "Your connection have been successfully reconnected.",
      );
      onConnectionComplete();
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Reconnection failed", formatApiError(error));
    },
  });

  return (
    <li className="border-cloud-silver flex flex-col border-b py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="mb-3 flex items-center gap-2.5 sm:mb-0">
        <img
          src={dataSourceIcons[item.provider_type]}
          alt={dataSourceNames[item.provider_type]}
          className={cn(
            "size-[30px] object-contain",
            item.provider_type === ConnectionProviderEnum.MANUAL_UPLOAD &&
              "size-8",
          )}
        />
        <div className="space-y-2">
          <h3 className="text-sm leading-[100%] font-semibold tracking-[-1%] text-black">
            {dataSourceNames[item.provider_type]}
          </h3>
          <p className="text-ash-gray text-xs leading-[100%] font-normal tracking-[-1%]">
            {item.connection_email ??
              item.whatsapp_configuration?.phone_number ??
              item.webhook_url}
          </p>
        </div>
      </div>
      {item.provider_type !== ConnectionProviderEnum.MANUAL_UPLOAD && (
        <div className="mt-2 flex items-center gap-2 sm:mt-0">
          {isGoogleMap && (
            <Button
              variant="outline"
              size="sm"
              title="Connect"
              className="hover:bg-frosted-lavender hover:border-primary text-xs text-black"
            >
              Connect
            </Button>
          )}
          {item.status === "connected" &&
            !isGoogleMap &&
            (item.source_type === SourceEnum.INPUT ||
              supportedProviders.includes(item.provider_type)) && (
              <>
                {!NON_CONFIGURABLE_PROVIDERS.includes(item.provider_type) && (
                  <ConnectionConfigureButton
                    connection={item}
                    onSuccess={onConnectionComplete}
                  />
                )}
                <Button
                  variant="outline"
                  size="sm"
                  title="Disconnect"
                  className="flex items-center justify-center rounded-md border-red-400 text-xs font-medium tracking-[0%] text-red-400 hover:bg-red-50 hover:text-red-400"
                  onClick={() => disconnectConnectionMutate()}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <Loader />
                  ) : (
                    <Unplug className="h-4 w-4" />
                  )}
                </Button>
              </>
            )}
          {item.status === "disconnected" && (
            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isReconnecting}
              onClick={() => mutateReconnect()}
              className="border-border-muted hover:bg-frosted-lavender hover:border-primary rounded-[8px] text-xs leading-[100%] font-medium tracking-[0%] text-black"
            >
              Reconnect
            </Button>
          )}
          {!isGoogleMap && (
            <Button
              variant="outline"
              size="sm"
              title="Delete"
              className="flex items-center justify-center rounded-md border-red-400 text-xs font-medium tracking-[0%] text-red-400 hover:bg-red-50 hover:text-red-400"
              onClick={() => deleteConnectionMutate()}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader /> : <Trash2 className="h-4 w-4" />}
            </Button>
          )}
        </div>
      )}
    </li>
  );
};

export default SourceItem;

import { Loader } from "lucide-react";
import { useState, useEffect } from "react";

import SourceList from "./SourceList";
import DataSourcesSheet from "./DataSourcesSheet";
import DataSourcePagination from "./DataSourcePagination";
import {
  ConnectionProviderEnum,
  isConnectionResponse,
  SourceEnum,
  SUPPORTED_INTEGRATION_PROVIDERS,
} from "../../helpers/constants/onboarding";
import AppDialog from "@/components/common/AppDialog";
import { WhatsappConnection } from "./WhatsappConnection";
import type { Connection } from "../../types/onboarding.types";

interface SourceListContainerProps {
  type: SourceEnum;
  items: Connection[];
  title: string;
  error?: string | null;
  isLoading: boolean;
  isPending: boolean;
  pagination: PaginationProps;
  description: string;
  onConnectionComplete: (type: SourceEnum) => void;
}

const SourceListContainer: React.FC<SourceListContainerProps> = ({
  type,
  items,
  title,
  error,
  isLoading,
  isPending,
  pagination,
  description,
  onConnectionComplete,
}) => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [whatsappConnectDialog, setWhatsappConnectDialog] =
    useState<boolean>(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const response = event.data;
      if (
        isConnectionResponse(response) &&
        response.status === "connected" &&
        response.source_type === type
      ) {
        onConnectionComplete(type);
        setIsSheetOpen(false);
      }
      if (event.data?.type === "WEBHOOK_CONNECTION_SUCCESS") {
        onConnectionComplete(type);
        setIsSheetOpen(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConnect = (provider: ConnectionProviderEnum) => {
    if (SUPPORTED_INTEGRATION_PROVIDERS.includes(provider)) {
      window.open(
        `${import.meta.env.VITE_CONNECTORS_API_URL}/v1/oauth/${provider}?frontend_url=${window.location.origin}&source_type=${type}`,
        "_blank",
        "width=500,height=600",
      );
    }
    if (provider === ConnectionProviderEnum.WHATSAPP) {
      setIsSheetOpen(false);
      setWhatsappConnectDialog(true);
    } else if (provider === ConnectionProviderEnum.WEBHOOK) {
      window.open(
        `${import.meta.env.VITE_CONNECTORS_URL}/webhook?api_url=${import.meta.env.VITE_CONNECTORS_API_URL}/v1/connections/webhook&origin=${window.origin}`,
        "_blank",
        "width=500,height=600",
      );
    }
  };

  return (
    <div className="shadow-ambient border-athens-gray max-h- flex flex-col rounded-xl border p-5">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-lg leading-[100%] font-semibold tracking-[-1%] text-black">
            {title}
          </h3>
          <span className="text-cool-gray text-sm leading-[100%] font-medium tracking-[-1%]">
            {description}
          </span>
        </div>
        <DataSourcesSheet
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={setIsSheetOpen}
          handleConnect={handleConnect}
          type={type}
        />
      </div>
      {isPending ? (
        <div className="m-6 flex justify-center">
          <Loader className="size-4 animate-spin" />
        </div>
      ) : error ? (
        <p className="text-muted-foreground m-6 text-center text-sm">{error}</p>
      ) : (
        <div className="relative flex-1">
          <SourceList
            items={items}
            onConnectionComplete={() => {
              onConnectionComplete(type);
            }}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader className="text-muted-foreground size-4 animate-spin" />
            </div>
          )}
        </div>
      )}
      <DataSourcePagination
        isLoading={isLoading}
        pagination={{ ...pagination }}
      />
      <AppDialog
        isOpen={whatsappConnectDialog}
        setIsOpen={setWhatsappConnectDialog}
        dialogHeader="Connect Whatsapp"
        isWrapperDivAvailable={false}
        dialogInnerContainerClassName="p-4"
        closeIconClassName="top-4.5 right-4.5"
      >
        <WhatsappConnection
          setWhatsappConnectDialog={setWhatsappConnectDialog}
        />
      </AppDialog>
    </div>
  );
};

export default SourceListContainer;

import { useState } from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetTrigger, Sheet } from "@/components/ui/sheet";
import WhatsappConfiguration from "./WhatsappConfiguration";
import { ConnectionProviderEnum } from "../../helpers/constants/onboarding";
import type { Connection } from "../../types/onboarding.types";

const ConnectionConfigureButton = ({
  connection,
  // onSuccess,
}: {
  connection: Connection;
  onSuccess: () => void;
}) => {
  const [open, setOpen] = useState(false);

  // const handleSuccess = () => {
  //   setOpen(false);
  //   onSuccess();
  // };

  const renderForm = () => {
    switch (connection.provider_type) {
      case ConnectionProviderEnum.WHATSAPP:
        return (
          <WhatsappConfiguration
            configuration={connection.whatsapp_configuration!}
          />
        );
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title="Configure"
          className="border-border-muted rounded-md text-xs leading-[100%] font-medium tracking-[0%] text-black"
        >
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </SheetTrigger>
      {renderForm()}
    </Sheet>
  );
};

export default ConnectionConfigureButton;

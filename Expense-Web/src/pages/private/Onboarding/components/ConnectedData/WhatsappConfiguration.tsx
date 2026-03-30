import CopyField from "@/components/common/CopyField";
import DataConfigureSheet from "./DataConfigureSheet";
import { dataSourceIcons } from "../../helpers/constants/onboarding";

type WhatsappConfigurationProps = {
  configuration: WhatsappConfigurationResponse;
};

const WhatsappConfiguration: React.FC<WhatsappConfigurationProps> = ({
  configuration,
}) => {
  return (
    <DataConfigureSheet
      image={dataSourceIcons.whatsapp}
      onSave={() => {}}
      isSubmitting={false}
      title="Configure Whatsapp"
      saveButtonState={true}
      description="Link your Whatsapp account"
    >
      <div className="mt-3 space-y-5">
        <CopyField
          label="Webhook URL"
          value={import.meta.env.VITE_WHATSAPP_WEBHOOK_URL}
        />
        <CopyField
          label="Verify token"
          value={configuration?.verification_token}
        />
        <div className="mb-3 rounded-xl bg-gray-50 p-4 text-sm text-gray-700">
          <p className="mb-2 font-medium">Setup Instructions</p>
          <ol className="list-decimal space-y-1 pl-4">
            <li>Copy the webhook URL and token above</li>
            <li>
              Paste them in your{" "}
              <a
                href="https://developers.facebook.com/apps"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 no-underline"
              >
                Meta App Dashboard
              </a>{" "}
              and verify
            </li>
          </ol>
        </div>
      </div>
    </DataConfigureSheet>
  );
};

export default WhatsappConfiguration;

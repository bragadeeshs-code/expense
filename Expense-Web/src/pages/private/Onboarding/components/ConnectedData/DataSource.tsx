import SourceListContainer from "./SourceListContainer";
import { useAvailableSources } from "../../helpers/hooks/useAvailableSources";
import { ASSET_PATH } from "@/helpers/constants/common";
import { OnboardingContentHeader } from "../OnboardingContentHeader";
import MileageCalculator from "./MileageCalculator";
import { SourceEnum } from "../../helpers/constants/onboarding";
import { formatApiError } from "@/lib/utils";

const DataSource = () => {
  const { input, output } = useAvailableSources();

  const refetchConnections = (type: SourceEnum) =>
    type === SourceEnum.INPUT ? input.refetch() : output.refetch();

  return (
    <div className="flex h-full flex-col">
      <OnboardingContentHeader
        title="Connect your data sources and systems"
        description=" Set up how your expenses will enter the system and where your
          processed data will be sent."
      />
      <div className="scrollbar-thin flex-1 space-y-4 overflow-y-auto">
        <div className="border-cloud-silver bg-gray-goose mx-5 flex items-start gap-4 rounded-xl border p-5 xl:mx-20">
          <img
            src={`${ASSET_PATH}/icons/alert.svg`}
            alt="Alert Icon"
            className="h-5 w-5"
          />
          <div className="flex flex-col gap-1.5">
            <h4 className="text-base leading-none font-semibold tracking-tight">
              Admin Setup Required
            </h4>
            <p className="text-cool-gray text-xs font-medium">
              Admins need to set up account credentials for each connection.
              Account linking can only happen after the back office setup is
              done.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 px-5 lg:grid-cols-2 xl:px-20">
          <SourceListContainer
            type={SourceEnum.INPUT}
            items={input.connections}
            title="Input Sources"
            error={input.error && formatApiError(input.error)}
            onConnectionComplete={refetchConnections}
            isLoading={input.fetching}
            isPending={input.pending}
            description="Email, Drive, and Manual Upload options"
            pagination={input.pagination}
          />
          <SourceListContainer
            type={SourceEnum.OUTPUT}
            items={output.connections}
            title="Output Sources"
            error={output.error && formatApiError(output.error)}
            onConnectionComplete={refetchConnections}
            isLoading={output.fetching}
            description="Email, Drive, and Manual Upload options"
            isPending={output.pending}
            pagination={output.pagination}
          />
        </div>
        <MileageCalculator />
      </div>
    </div>
  );
};

export default DataSource;

import { useState } from "react";

import { Switch } from "@/components/ui/switch";
import { GOOGLE_MAP_DATA } from "../../helpers/constants/onboarding";

import SourceItem from "./SourceItem";

const MileageCalculator = () => {
  const [isAutoSyncEnabled, setIsAutoSyncEnabled] = useState<boolean>(true);

  return (
    <div className="shadow-ambient border-athens-gray mx-5 mb-2 flex flex-col rounded-xl border p-5 xl:mx-20">
      <div className="mb-3 flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-lg leading-[100%] font-semibold tracking-[-1%] text-black">
            Mileage Calculator
          </h3>
          <span className="text-cool-gray text-sm leading-[100%] font-medium tracking-[-1%]">
            Email, Drive, and Manual Upload options
          </span>
        </div>
        <Switch
          checked={isAutoSyncEnabled}
          onCheckedChange={setIsAutoSyncEnabled}
          className="h-6 w-10 cursor-pointer"
          thumbClassName="size-5"
        />
      </div>
      <hr />

      <SourceItem item={GOOGLE_MAP_DATA} onConnectionComplete={() => {}} />
    </div>
  );
};

export default MileageCalculator;

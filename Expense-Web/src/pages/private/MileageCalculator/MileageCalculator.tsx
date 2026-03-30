import { RoleEnum } from "@/helpers/constants/common";
import { hasAccess } from "@/lib/utils";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import {
  MILEAGE_TOP_TABS,
  EXPENSE_TRAVEL_ENUM,
} from "@/pages/private/MileageCalculator/helpers/constants/mileage";

import AppTabs from "@/components/common/AppTabs";
import MileageCalculatorHeader from "@/pages/private/MileageCalculator/components/MileageCalculatorHeader";
import MileageDashboardMetrics from "@/pages/private/MileageCalculator/components/MileageDashboardMetrics";
import { useState } from "react";
import MileageMyTravelList from "./components/MileageMyTravelList";
import MileageTeamTravelList from "./components/MileageTeamTravelList";

const MileageCalculator = () => {
  const [activeTab, setActiveTab] = useState<EXPENSE_TRAVEL_ENUM>(
    EXPENSE_TRAVEL_ENUM.MY_TRAVEL,
  );
  const { data: user } = useCurrentuser();

  if (!user) return null;

  const isRoleAdminOrManager = hasAccess(user, [
    RoleEnum.ADMIN,
    RoleEnum.MANAGER,
  ]);

  return (
    <div className="@container flex h-full flex-col space-y-4">
      <MileageCalculatorHeader />

      <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-5 pt-0">
        <div className="flex flex-col gap-5">
          {isRoleAdminOrManager && (
            <div className="my-3.5 flex flex-col items-end justify-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
              <AppTabs<EXPENSE_TRAVEL_ENUM>
                value={activeTab}
                tabsList={MILEAGE_TOP_TABS}
                defaultValue={EXPENSE_TRAVEL_ENUM.MY_TRAVEL}
                onTabChange={(value) => setActiveTab(value)}
                className="shadow-subtle max-w-2xl"
              />
            </div>
          )}
          <MileageDashboardMetrics activeTab={activeTab} />
          {activeTab === EXPENSE_TRAVEL_ENUM.MY_TRAVEL ? (
            <MileageMyTravelList activeTab={activeTab} />
          ) : (
            <MileageTeamTravelList activeTab={activeTab} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MileageCalculator;

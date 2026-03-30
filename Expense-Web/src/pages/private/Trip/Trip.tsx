import { useState } from "react";
import AppHeader from "@/components/common/AppHeader";
import AppTabs from "@/components/common/AppTabs";
import {
  TRAVEL_REQUEST_TAB_ENUM,
  TRAVEL_REQUESTS_TABS_LIST,
} from "./helpers/constants/trips";
import MyTrips from "./components/MyTrips";
import TeamTrips from "./components/TeamTrips";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import { hasAccess } from "@/lib/utils";
import { RoleEnum } from "@/helpers/constants/common";

const Trip: React.FC = () => {
  const { data: user } = useCurrentuser();

  const [activeTab, setActiveTab] = useState<TRAVEL_REQUEST_TAB_ENUM>(
    TRAVEL_REQUEST_TAB_ENUM.MY_REQUESTS,
  );

  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Travel request"
        description="Create and manage travel requests with trip details and approvals, and use them when submitting related expenses."
      />
      {user && hasAccess(user, [RoleEnum.MANAGER]) && (
        <div className="my-3.5 px-5">
          <AppTabs<TRAVEL_REQUEST_TAB_ENUM>
            value={activeTab}
            tabsList={TRAVEL_REQUESTS_TABS_LIST}
            defaultValue={TRAVEL_REQUEST_TAB_ENUM.MY_REQUESTS}
            onTabChange={(value) => setActiveTab(value)}
            className="shadow-subtle max-w-2xl"
          />
        </div>
      )}
      <div className="overflow-y-auto px-5 pb-5">
        {activeTab === TRAVEL_REQUEST_TAB_ENUM.MY_REQUESTS ? (
          <MyTrips />
        ) : (
          <TeamTrips />
        )}
      </div>
    </section>
  );
};

export default Trip;

import { useState } from "react";
import AppHeader from "@/components/common/AppHeader";
import AppTabs from "@/components/common/AppTabs";
import {
  ADVANCES_TAB_ENUM,
  ADVANCES_TABS_LIST,
} from "./helpers/constants/advances";
import PendingIssuance from "./components/PendingIssuance";
import IssuedAdvances from "./components/IssuedAdvances";

const Advances: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ADVANCES_TAB_ENUM>(
    ADVANCES_TAB_ENUM.PENDING_ISSUANCE,
  );

  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Advances"
        description="Issue and manage advance payments for trips, and track balances against submitted expenses."
      />
      <div className="mb-3.5 px-5">
        <AppTabs<ADVANCES_TAB_ENUM>
          value={activeTab}
          tabsList={ADVANCES_TABS_LIST}
          defaultValue={ADVANCES_TAB_ENUM.PENDING_ISSUANCE}
          onTabChange={(value) => setActiveTab(value)}
          className="shadow-subtle max-w-2xl"
        />
      </div>
      <div className="scrollbar-thin overflow-y-auto px-5 pb-5">
        {activeTab === ADVANCES_TAB_ENUM.PENDING_ISSUANCE ? (
          <PendingIssuance />
        ) : (
          <IssuedAdvances />
        )}
      </div>
    </section>
  );
};

export default Advances;

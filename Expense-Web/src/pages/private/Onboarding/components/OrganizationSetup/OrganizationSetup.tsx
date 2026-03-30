import { useState } from "react";

import AppTabs from "@/components/common/AppTabs";

import { OnboardingContentHeader } from "../OnboardingContentHeader";
import {
  ORGANIZATION_SETUP,
  OrganizationSetupTabs,
} from "../../helpers/constants/onboarding";
import CompanyAssets from "./CompanyAssets";

const OrganizationSetup = () => {
  const [activeTab, setActiveTab] = useState<ORGANIZATION_SETUP>(
    ORGANIZATION_SETUP.COMPANY_ASSETS,
  );

  return (
    <div className="@container flex h-full flex-col">
      <OnboardingContentHeader
        title="Organization Setup"
        description="Add and manage corporate cards, fuel cards, vehicles, generators, and more"
      />

      <div className="px-5 xl:px-20">
        <AppTabs<ORGANIZATION_SETUP>
          value={activeTab}
          tabsList={OrganizationSetupTabs}
          defaultValue={ORGANIZATION_SETUP.COMPANY_ASSETS}
          onTabChange={(value) => setActiveTab(value)}
          className="shadow-subtle w-full @2xl:w-125"
        />
      </div>

      <div className="min-h-0 flex-1 px-5 py-4 xl:px-20">
        {activeTab === ORGANIZATION_SETUP.COMPANY_ASSETS && <CompanyAssets />}
      </div>
    </div>
  );
};

export default OrganizationSetup;

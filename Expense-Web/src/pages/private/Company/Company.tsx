import { useState } from "react";

import { COMPANY, CompanyTabs } from "./helpers/constants/company";
import AppTabs from "@/components/common/AppTabs";
import AppHeader from "@/components/common/AppHeader";
import CompanyAssets from "./components/CompanyAssets";
import CompanyCostCenters from "./components/CompanyCostCenters";
import CompanyGradesAndPolicies from "./components/CompanyGradesAndPolicies";
import CompanyDepartments from "./components/CompanyDepartments";
import RolesAndAccess from "@/components/common/RolesAndAccess/RolesAndAccess";

const Company = () => {
  const [activeTab, setActiveTab] = useState<COMPANY>(COMPANY.COMPANY_ASSETS);
  const renderTabs = (activeTab: COMPANY) => {
    switch (activeTab) {
      case COMPANY.COMPANY_ASSETS:
        return <CompanyAssets />;
      case COMPANY.COST_CENTERS:
        return <CompanyCostCenters />;
      case COMPANY.DEPARTMENTS:
        return <CompanyDepartments />;
      case COMPANY.GRADES_POLICIES:
        return <CompanyGradesAndPolicies />;
      default:
        return <RolesAndAccess className="mx-5" />;
    }
  };
  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Organization"
        description="Manage organization assets, departments, and global policies."
      />
      <div className="px-5">
        <AppTabs<COMPANY>
          value={activeTab}
          tabsList={CompanyTabs}
          defaultValue={COMPANY.COMPANY_ASSETS}
          onTabChange={(value) => setActiveTab(value)}
          className="shadow-subtle"
        />
      </div>

      <div className="scrollbar-thin overflow-y-auto py-5">
        {renderTabs(activeTab)}
      </div>
    </section>
  );
};

export default Company;

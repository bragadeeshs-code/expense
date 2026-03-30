import { useState } from "react";

import { OnboardingContentHeader } from "../OnboardingContentHeader";
import {
  ROLES_AND_GRADES,
  RolesAndGradesTabs,
} from "../../helpers/constants/onboarding";

import AppTabs from "@/components/common/AppTabs";
import CostCenters from "../CostCenters/CostCenters";
import Departments from "../Departments/Departments";
import RolesAndAccess from "@/components/common/RolesAndAccess/RolesAndAccess";
import GradesAndPolicies from "../GradesAndPolicies/GradesAndPolicies";

const RolesAndGrades = () => {
  const [activeTab, setActiveTab] = useState<ROLES_AND_GRADES>(
    ROLES_AND_GRADES.ROLES_AND_ACCESS,
  );

  const renderContent = () => {
    switch (activeTab) {
      case ROLES_AND_GRADES.ROLES_AND_ACCESS:
        return <RolesAndAccess />;
      case ROLES_AND_GRADES.GRADES_AND_POLICIES:
        return <GradesAndPolicies />;
      case ROLES_AND_GRADES.COST_CENTERS:
        return <CostCenters />;
      case ROLES_AND_GRADES.DEPARTMENTS:
        return <Departments />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full flex-col">
      <OnboardingContentHeader
        title="Define Roles & Grades"
        description="Manage the core roles, permissions, and grade structures for your organization."
      />

      <div className="px-5 xl:px-20">
        <AppTabs<ROLES_AND_GRADES>
          value={activeTab}
          tabsList={RolesAndGradesTabs}
          defaultValue={ROLES_AND_GRADES.ROLES_AND_ACCESS}
          onTabChange={(value) => setActiveTab(value)}
          className="shadow-subtle"
        />
      </div>

      <div className="mt-4 mb-0.5 min-h-0 flex-1 px-5 sm:mt-[26px] xl:px-20">
        {renderContent()}
      </div>
    </div>
  );
};

export default RolesAndGrades;

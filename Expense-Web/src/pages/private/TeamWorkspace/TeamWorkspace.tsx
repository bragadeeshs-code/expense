import { useState } from "react";

import {
  TEAM_WORKSPACE,
  TeamWorkSpaceTabs,
} from "./helpers/constants/team-workspace";

import AppTabs from "@/components/common/AppTabs";
import TeamExpense from "./components/TeamExpense";
import TeamMembers from "./components/TeamMembers";
import TeamWorkspaceHeader from "./components/TeamWorkspaceHeader";

const TeamWorkspace = () => {
  const [activeTab, setActiveTab] = useState<TEAM_WORKSPACE>(
    TEAM_WORKSPACE.EXPENSE,
  );
  return (
    <section className="@container flex h-full flex-col">
      <TeamWorkspaceHeader />
      <div className="mb-3.5 px-5">
        <AppTabs<TEAM_WORKSPACE>
          value={activeTab}
          tabsList={TeamWorkSpaceTabs}
          defaultValue={TEAM_WORKSPACE.EXPENSE}
          onTabChange={(value) => setActiveTab(value)}
          className="shadow-subtle"
        />
      </div>

      <div className="scrollbar-thin overflow-y-auto">
        {activeTab === TEAM_WORKSPACE.EXPENSE ? (
          <TeamExpense />
        ) : (
          <TeamMembers />
        )}
      </div>
    </section>
  );
};

export default TeamWorkspace;

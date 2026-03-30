import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import AppHeader from "@/components/common/AppHeader";

const TeamWorkspaceHeader = () => {
  return (
    <AppHeader
      title="Team workspace"
      description="Keep track of expenses with real-time metrics"
    >
      <Button
        variant="default"
        className="[background-image:var(--gradient-primary)] px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] text-white"
      >
        Add Employee Expense <Plus className="size-5" />
      </Button>
    </AppHeader>
  );
};

export default TeamWorkspaceHeader;

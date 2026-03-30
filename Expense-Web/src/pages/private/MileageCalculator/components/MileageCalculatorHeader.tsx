import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import AppHeader from "@/components/common/AppHeader";
import MileageExpenseSheet from "@/pages/private/MileageCalculator/components/MileageExpenseSheet";

const MileageCalculatorHeader = () => {
  return (
    <AppHeader
      title=" Mileage Overview"
      description=" Track and review all travel-based mileage submissions in one place."
    >
      <MileageExpenseSheet>
        <Button
          type="button"
          className="h-10 [background-image:var(--gradient-primary)] px-4 py-2 text-sm font-medium text-white"
        >
          Add Expense <Plus className="ml-1 size-5 shrink-0" />
        </Button>
      </MileageExpenseSheet>
    </AppHeader>
  );
};

export default MileageCalculatorHeader;

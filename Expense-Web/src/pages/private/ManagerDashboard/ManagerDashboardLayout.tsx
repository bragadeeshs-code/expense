import { useState } from "react";
import { format } from "date-fns";
import AppHeader from "@/components/common/AppHeader";
import { YearMonthSelect } from "@/components/common/YearMonthSelect";
import ManagerDashboard from "./components/ManagerDashboard";

const ManagerDashboardLayout = () => {
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(
    format(new Date(), "yyyy-MM"),
  );
  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Dashboard"
        description="Welcome back! Here's a overview of the expense management"
      >
        <YearMonthSelect
          onSelectMonth={(selectedYearMonth) =>
            setSelectedYearMonth(selectedYearMonth)
          }
        />
      </AppHeader>
      <ManagerDashboard selectedYearMonth={selectedYearMonth} />
    </section>
  );
};

export default ManagerDashboardLayout;

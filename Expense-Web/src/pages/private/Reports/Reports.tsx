import { format } from "date-fns";
import { useState } from "react";
import { Outlet, useParams } from "react-router";

import { cn } from "@/lib/utils";
import { REPORTS } from "./helpers/constants/reports";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import { getVisibleReportsTab } from "./lib/reportsUtils";

import AppTabs from "@/components/common/AppTabs";
import MyReports from "./components/MyReports";
import TeamReports from "./components/TeamReports";
import AppHeader from "@/components/common/AppHeader";
import { YearMonthSelect } from "@/components/common/YearMonthSelect";

const Reports = () => {
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>(
    format(new Date(), "yyyy-MM"),
  );

  const { data: user } = useCurrentuser();
  const { id } = useParams();
  const tabs = getVisibleReportsTab(user);
  const isMultiTab = tabs.length > 1;
  const [activeTab, setActiveTab] = useState<REPORTS>(REPORTS.MY_REPORTS);

  return (
    <section className="@container flex h-full flex-col">
      {!id && (
        <>
          <AppHeader
            title="Reports"
            description="Your personal expenses, reimbursements, and card activity at a glance."
          >
            <YearMonthSelect
              onSelectMonth={(selectedYearMonth) =>
                setSelectedYearMonth(selectedYearMonth)
              }
            />
          </AppHeader>
          {isMultiTab && (
            <div className="my-3.5 px-5">
              <AppTabs<REPORTS>
                value={activeTab}
                tabsList={tabs}
                defaultValue={REPORTS.MY_REPORTS}
                onTabChange={(value) => setActiveTab(value)}
                className="shadow-subtle"
              />
            </div>
          )}
        </>
      )}
      <div
        className={cn(
          "h-full",
          !id && "overflow-y-auto @4xl:min-h-0 @4xl:flex-1",
          !isMultiTab && "my-3.5",
        )}
      >
        {id ? (
          <Outlet />
        ) : activeTab === REPORTS.MY_REPORTS ? (
          <MyReports selectedYearMonth={selectedYearMonth} />
        ) : (
          <TeamReports selectedYearMonth={selectedYearMonth} />
        )}
      </div>
    </section>
  );
};

export default Reports;

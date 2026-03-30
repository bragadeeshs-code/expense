import AppHeader from "@/components/common/AppHeader";
import FinanceExpenseList from "./components/FinanceExpenseList";
import FinanceDashboardStats from "./components/FinanceDashboardStats";

const FinanceDashboard = () => {
  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Dashboard"
        description="Welcome back! Here’s an overview of finance activities and expenses."
      />
      <div className="scrollbar-thin overflow-y-auto px-5">
        <FinanceDashboardStats />
        <FinanceExpenseList />
      </div>
    </section>
  );
};

export default FinanceDashboard;

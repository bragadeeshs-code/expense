import AppHeader from "@/components/common/AppHeader";
import UserDashboard from "./components/UserDashboard";
import AddExpenseButton from "@/components/common/AddExpenseButton";

const UserDashboardLayout = () => {
  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Expense Management"
        description="Keep track of expenses with real-time metrics"
      >
        <AddExpenseButton />
      </AppHeader>
      <UserDashboard />
    </section>
  );
};

export default UserDashboardLayout;

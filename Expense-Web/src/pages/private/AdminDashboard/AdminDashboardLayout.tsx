import AppHeader from "@/components/common/AppHeader";
import AdminDashboard from "./components/AdminDashboard";

const AdminDashboardLayout = () => {
  return (
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="Dashboard"
        description="Welcome back! Here's a overview of the expense management"
      />
      <AdminDashboard />
    </section>
  );
};

export default AdminDashboardLayout;

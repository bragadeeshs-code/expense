import StatusCard from "@/components/common/StatusCard";

interface ManagerDashboardStatsProps {
  activeProjects?: number;
  totalApprovedExpensesAmount?: number;
  totalPendingExpenses?: number;
}

const ManagerDashboardStats: React.FC<ManagerDashboardStatsProps> = ({
  activeProjects = 0,
  totalApprovedExpensesAmount = 0,
  totalPendingExpenses = 0,
}) => {
  return (
    <div className="grid grid-cols-1 gap-2.5 @3xl:grid-cols-3">
      <StatusCard
        isPrimaryValueAmount={false}
        title="Total spend"
        primaryValue={totalApprovedExpensesAmount}
        className="bg-herbal-snow border-pistachio-cream shadow-ambient gap-9"
      />
      <StatusCard
        isPrimaryValueAmount={false}
        title="Pending Approvals"
        primaryValue={totalPendingExpenses}
        className="bg-powder-blue-haze border-baby-blue shadow-ambient gap-9"
      />
      <StatusCard
        isPrimaryValueAmount={false}
        title="Active projects"
        primaryValue={activeProjects}
        className="bg-lilac-smoke border-amethyst-pastel shadow-ambient gap-9"
      />
    </div>
  );
};

export default ManagerDashboardStats;

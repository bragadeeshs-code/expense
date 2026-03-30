import StatusCard from "@/components/common/StatusCard";

interface AdminDashboardStatsProps {
  totalAssets?: number;
  totalProjects?: number;
  totalEmployees?: number;
  totalConnections?: number;
}

const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
  totalAssets = 0,
  totalProjects = 0,
  totalEmployees = 0,
  totalConnections = 0,
}) => {
  return (
    <div className="grid grid-cols-1 gap-2.5 @3xl:grid-cols-4">
      <StatusCard
        title="Total employees"
        className="border-pistachio-cream bg-herbal-snow shadow-ambient"
        primaryValue={totalEmployees}
        isPrimaryValueAmount={false}
      />

      <StatusCard
        title="Active projects"
        className="border-baby-blue bg-powder-blue-haze shadow-ambient"
        primaryValue={totalProjects}
        isPrimaryValueAmount={false}
      />

      <StatusCard
        title="Company assets"
        className="border-amethyst-pastel bg-lilac-smoke shadow-ambient"
        primaryValue={totalAssets}
        isPrimaryValueAmount={false}
      />

      <StatusCard
        title="Integrations"
        className="border-lemon-chiffon bg-pale-marigold shadow-ambient"
        primaryValue={totalConnections}
        isPrimaryValueAmount={false}
      />
    </div>
  );
};

export default AdminDashboardStats;

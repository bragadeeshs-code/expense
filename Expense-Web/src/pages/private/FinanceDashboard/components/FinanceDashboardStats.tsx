import StatusCard from "@/components/common/StatusCard";
import { ASSET_PATH } from "@/helpers/constants/common";

const FinanceDashboardStats = () => {
  return (
    <div className="grid grid-cols-1 gap-2.5 @3xl:grid-cols-4">
      <StatusCard
        title="Total expenses"
        imgUrl={`${ASSET_PATH}/icons/cash_icon.svg`}
        className="border-pistachio-cream bg-herbal-snow shadow-ambient"
        primaryValue={20}
      />
      <StatusCard
        title="Pending Approvals"
        imgUrl={`${ASSET_PATH}/icons/time-quarter.svg`}
        className="border-lemon-chiffon bg-pale-marigold shadow-ambient"
        primaryValue={17}
        isPrimaryValueAmount={false}
      />

      <StatusCard
        title="Completed"
        imgUrl={`${ASSET_PATH}/icons/checkmark-badge.svg`}
        className="border-baby-blue bg-powder-blue-haze shadow-ambient"
        primaryValue={1}
        isPrimaryValueAmount={false}
      />
      <StatusCard
        title="Team amount"
        imgUrl={`${ASSET_PATH}/icons/cash_icon.svg`}
        className="border-petal-bloom bg-lavender-mist shadow-ambient"
        description="Compared to last month"
        primaryValue={20}
      />
    </div>
  );
};

export default FinanceDashboardStats;

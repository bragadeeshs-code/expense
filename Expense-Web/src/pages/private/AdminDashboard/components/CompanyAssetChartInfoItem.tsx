import { startCase } from "lodash";
import CountUp from "react-countup";

interface CompanyAssetChartInfoItemProps {
  color: string;
  name: string;
  value: number;
}

const CompanyAssetChartInfoItem: React.FC<CompanyAssetChartInfoItemProps> = ({
  color,
  name,
  value,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded" style={{ backgroundColor: color }} />
        <span className="text-xs font-medium text-black">
          {startCase(name)}
        </span>
      </div>

      <div className="text-xs leading-[100%] font-medium tracking-[0%]">
        <CountUp start={0} end={value} duration={1} />
      </div>
    </div>
  );
};

export default CompanyAssetChartInfoItem;

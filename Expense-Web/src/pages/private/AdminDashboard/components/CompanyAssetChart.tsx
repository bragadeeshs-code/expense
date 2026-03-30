import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { Card } from "@/components/ui/card";
import {
  COMPANY_ASSET_COLORS,
  companyAssetChartConfig,
} from "../helpers/constants/admin-dashboard";
import {
  ChartTooltip,
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";

import EmptyState from "../../Extraction/components/EmptyState";
import CompanyAssetChartInfoItem from "./CompanyAssetChartInfoItem";

interface CompanyAssetChartProps {
  companyAssets?: CompanyAsset[];
}

const CompanyAssetChart: React.FC<CompanyAssetChartProps> = ({
  companyAssets = [],
}) => {
  const chartData = companyAssets.map((item, index) => ({
    name: item.category,
    value: item.category_count,
    color: COMPANY_ASSET_COLORS[index % COMPANY_ASSET_COLORS.length],
  }));

  return (
    <Card className="border-athens-gray shadow-ambient scrollbar-thin max-h-full gap-0 overflow-y-auto rounded-2xl p-6 lg:@3xl:max-h-[440px] lg:@3xl:w-[300px]">
      <h3 className="mb-4 text-base leading-[100%] font-medium tracking-[-0.2px] text-black">
        Company assets overview
      </h3>

      {chartData.length > 0 ? (
        <div className="flex justify-center">
          <ChartContainer
            config={companyAssetChartConfig}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius="40%"
                  outerRadius="80%"
                  dataKey="value"
                  nameKey="name"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      ) : (
        <EmptyState
          type="no-data"
          className="flex h-[250px] items-center justify-center"
        />
      )}

      <div className="space-y-3">
        {chartData.map((item, index) => (
          <CompanyAssetChartInfoItem
            key={index}
            name={item.name}
            color={item.color}
            value={item.value}
          />
        ))}
      </div>
    </Card>
  );
};

export default CompanyAssetChart;

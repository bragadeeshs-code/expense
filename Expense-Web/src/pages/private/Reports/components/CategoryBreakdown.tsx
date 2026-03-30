import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { isEmpty } from "lodash";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { categoryBreakdownChartConfig } from "../helpers/constants/reports";
import EmptyState from "../../Extraction/components/EmptyState";

interface CategoryBreakdownProps {
  categoryBreakdown: CategoryBreakdown[] | undefined;
  isLoading: boolean;
}

const getDiscreteCountTicks = (categoryBreakdown: CategoryBreakdown[] = []) => {
  const maxCount = Math.max(
    ...categoryBreakdown.map((item) => Number(item.count ?? 0)),
    0,
  );

  if (maxCount <= 1) {
    return [0, 1];
  }

  const step = Math.max(1, Math.ceil(maxCount / 4));
  const ticks = Array.from(
    { length: Math.floor(maxCount / step) + 1 },
    (_, index) => index * step,
  );

  if (ticks[ticks.length - 1] !== maxCount) {
    ticks.push(maxCount);
  }

  return ticks;
};

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({
  categoryBreakdown,
  isLoading,
}) => {
  const yAxisTicks = getDiscreteCountTicks(categoryBreakdown);

  return (
    <Card className="border-athens-gray shadow-ambient rounded-2xl px-4 sm:px-6">
      <CardHeader className="px-0">
        <CardTitle className="text-sm leading-[100%] font-medium tracking-[0%] text-black">
          Category breakdown
        </CardTitle>
      </CardHeader>

      <CardContent className="h-60 p-0">
        {!isLoading && isEmpty(categoryBreakdown) ? (
          <span className="flex h-full items-center justify-center">
            <EmptyState type="no-chart-data" className="shadow-none" />
          </span>
        ) : (
          <ChartContainer
            config={categoryBreakdownChartConfig}
            className="h-full w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={categoryBreakdown}
                margin={{ left: -20, right: 12 }}
                barSize={50}
              >
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                  ticks={yAxisTicks}
                  domain={[0, yAxisTicks[yAxisTicks.length - 1] ?? 0]}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="count" fill="#CE7DFF" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryBreakdown;

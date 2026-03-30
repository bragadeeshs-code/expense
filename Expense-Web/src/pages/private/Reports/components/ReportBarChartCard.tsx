import { isEmpty } from "lodash";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Spinner } from "@/components/ui/spinner";
import EmptyState from "@/pages/private/Extraction/components/EmptyState";

interface ReportBarChartCardProps<TData extends object> {
  title: string;
  data: TData[];
  isLoading: boolean;
  chartConfig: ChartConfig;
  xAxisDataKey: keyof TData;
  barDataKey: keyof TData;
  barFill?: string;
  yAxisTickCount?: number;
  xAxisTickFormatter?: (value: string) => string;
  yAxisTickFormatter?: (value: number) => string;
  hideTooltipLabel?: boolean;
}

const ReportBarChartCard = <TData extends object>({
  title,
  data,
  isLoading,
  chartConfig,
  xAxisDataKey,
  barDataKey,
  barFill = "#CE7DFF",
  yAxisTickCount = 4,
  xAxisTickFormatter,
  yAxisTickFormatter,
  hideTooltipLabel = true,
}: ReportBarChartCardProps<TData>) => {
  return (
    <Card className="border-athens-gray shadow-ambient rounded-2xl px-4 sm:px-6">
      <CardHeader className="px-0">
        <CardTitle className="text-sm leading-[100%] font-medium tracking-[0%] text-black">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="h-60 p-0">
        {isLoading ? (
          <div className="flex h-full items-center justify-center gap-4">
            <Spinner />
            <p>Loading...</p>
          </div>
        ) : isEmpty(data) ? (
          <span className="flex h-full items-center justify-center">
            <EmptyState type="no-chart-data" className="shadow-none" />
          </span>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                accessibilityLayer
                data={data}
                margin={{ left: -20, right: 12 }}
                barSize={42}
              >
                <CartesianGrid vertical={false} strokeDasharray="4 4" />
                <XAxis
                  dataKey={xAxisDataKey as string}
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={xAxisTickFormatter}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={yAxisTickCount}
                  tickFormatter={yAxisTickFormatter}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel={hideTooltipLabel} />}
                />
                <Bar
                  dataKey={barDataKey as string}
                  fill={barFill}
                  radius={8}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportBarChartCard;

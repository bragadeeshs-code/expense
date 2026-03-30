import { isEmpty } from "lodash";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
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

interface TrendSeries {
  dataKey: string;
  type: "bar" | "line";
  yAxisId?: "left" | "right";
  color?: string;
  strokeWidth?: number;
}

interface ReportTrendChartCardProps<TData extends object> {
  title: string;
  data: TData[];
  isLoading: boolean;
  chartConfig: ChartConfig;
  xAxisDataKey: keyof TData;
  series: TrendSeries[];
  leftYAxisTickFormatter?: (value: number) => string;
  rightYAxisTickFormatter?: (value: number) => string;
}

const ReportTrendChartCard = <TData extends object>({
  title,
  data,
  isLoading,
  chartConfig,
  xAxisDataKey,
  series,
  leftYAxisTickFormatter,
  rightYAxisTickFormatter,
}: ReportTrendChartCardProps<TData>) => {
  const hasRightAxis = series.some((item) => item.yAxisId === "right");

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
            <ComposedChart
              accessibilityLayer
              data={data}
              margin={{ left: -16, right: hasRightAxis ? 0 : 12 }}
              barGap={6}
            >
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey={xAxisDataKey as string}
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                minTickGap={16}
              />
              <YAxis
                yAxisId="left"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={leftYAxisTickFormatter}
              />
              {hasRightAxis ? (
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  allowDecimals={false}
                  tickFormatter={rightYAxisTickFormatter}
                />
              ) : null}
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              {series.map((item) =>
                item.type === "bar" ? (
                  <Bar
                    key={item.dataKey}
                    dataKey={item.dataKey}
                    yAxisId={item.yAxisId ?? "left"}
                    fill={item.color ?? `var(--color-${item.dataKey})`}
                    radius={8}
                    barSize={18}
                  />
                ) : (
                  <Line
                    key={item.dataKey}
                    type="monotone"
                    dataKey={item.dataKey}
                    yAxisId={item.yAxisId ?? "left"}
                    stroke={item.color ?? `var(--color-${item.dataKey})`}
                    strokeWidth={item.strokeWidth ?? 2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ),
              )}
            </ComposedChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ReportTrendChartCard;

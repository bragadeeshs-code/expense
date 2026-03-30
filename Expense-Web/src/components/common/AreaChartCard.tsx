import { isEmpty } from "lodash";
import { Area, YAxis, XAxis, AreaChart, CartesianGrid } from "recharts";

import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartTooltip,
  ChartContainer,
  type ChartConfig,
  ChartTooltipContent,
} from "@/components/ui/chart";
import EmptyState from "@/pages/private/Extraction/components/EmptyState";

interface AreaChartCardProps {
  children?: React.ReactNode;
  isLoading: boolean;
  cardTitle: string;
  chartData: unknown[];
  chartConfig: ChartConfig;
  xAxisDataKey: string;
  cardClassName?: string;
  yAxisTickCount?: number;
  chartAreaDataKey: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xAxisTickFormatter?: (value: any) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yAxisTickFormatter: (value: any) => string;
  cardTitleClassName?: string;
  cardContentClassName?: string;
}

const AreaChartCard: React.FC<AreaChartCardProps> = ({
  children,
  isLoading,
  cardTitle,
  chartData,
  chartConfig,
  xAxisDataKey,
  cardClassName,
  yAxisTickCount = 4,
  chartAreaDataKey,
  yAxisTickFormatter,
  cardTitleClassName,
  cardContentClassName,
  xAxisTickFormatter,
}) => {
  return (
    <Card
      className={cn(
        "border-athens-gray shadow-ambient rounded-2xl px-4 sm:px-6",
        cardClassName,
      )}
    >
      <CardHeader
        className={cn("px-0", children && "grid-cols-1 @4xl:grid-cols-2")}
      >
        <CardTitle
          className={cn(
            "text-sm leading-[100%] font-medium tracking-[0%] text-black",
            cardTitleClassName,
          )}
        >
          {cardTitle}
        </CardTitle>
        {children}
      </CardHeader>

      <CardContent className={cn("h-60 p-0", cardContentClassName)}>
        {isLoading ? (
          <div className="flex h-full items-center justify-center gap-4">
            <Spinner />
            <p>Loading...</p>
          </div>
        ) : isEmpty(chartData) ? (
          <span className="flex h-full items-center justify-center">
            <EmptyState type="no-chart-data" className="shadow-none" />
          </span>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#773DD0" stopOpacity={0.2} />
                  <stop offset="85%" stopColor="#FFFFFF" stopOpacity={0.2} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis
                dataKey={xAxisDataKey}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
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
                content={<ChartTooltipContent indicator="line" />}
              />

              <Area
                dataKey={chartAreaDataKey}
                type="monotone"
                fill="url(#fillDesktop)"
                stroke="#B973EA"
                strokeWidth={1.5}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default AreaChartCard;

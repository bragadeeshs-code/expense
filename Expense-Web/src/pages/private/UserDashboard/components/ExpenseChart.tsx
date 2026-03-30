import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDashboardCategory } from "@/services/dashboard.service";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, startCase } from "lodash";
import { useState } from "react";
import CountUp from "react-countup";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import EmptyState from "../../Extraction/components/EmptyState";
import {
  COLORS,
  expenseChartConfig,
  frequencyOptions,
  FREQUENCY,
} from "../helpers/constants/dashboard";

const ExpenseChart: React.FC = () => {
  const [range, setRange] = useState<Frequency>(FREQUENCY.TODAY);

  const { data } = useQuery<DashboardExpenseSummary>({
    queryKey: ["dashboard", "expense-summary", range],
    queryFn: () => getDashboardCategory(range),
    refetchOnWindowFocus: false,
  });

  return (
    <Card className="border-porcelain shadow-card-soft scrollbar-thin max-h-[749px] gap-0 overflow-y-auto rounded-2xl p-6 sm:max-h-full lg:@3xl:w-[350px]">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-black">Your expenses</h3>
        <Select
          value={range}
          onValueChange={(value) => setRange(value as Frequency)}
        >
          <SelectTrigger className="border-fog-gray min-w-24 cursor-pointer rounded-[10px] align-middle text-sm leading-5 font-medium tracking-[-0.3px]">
            <SelectValue placeholder="Select a date" />
          </SelectTrigger>
          <SelectContent className="border-fog-gray text-sm font-medium text-black">
            {frequencyOptions.map((option) => (
              <SelectItem
                key={option.label}
                value={option.value}
                className="cursor-pointer"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {data && data?.total_spent > 0 ? (
        <div className="flex justify-center">
          <ChartContainer
            config={expenseChartConfig}
            className="h-[250px] w-full"
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />

                <Pie
                  cx="50%"
                  cy="50%"
                  data={
                    data?.by_category
                      ? Object.entries(data.by_category).map(
                          ([name, amount], index) => ({
                            name,
                            amount,
                            color: COLORS[index % COLORS.length],
                          }),
                        )
                      : []
                  }
                  innerRadius="40%"
                  outerRadius="80%"
                  dataKey="amount"
                  nameKey="name"
                >
                  {Object.entries(data?.by_category ?? {}).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      ) : (
        <EmptyState
          type="no-data"
          className="flex h-[250px] flex-none items-center justify-center border-none text-sm font-medium shadow-none md:p-4"
        />
      )}

      <div className="mb-8">
        <h2 className="text-steel-gray text-base font-medium">You've spent</h2>
        <div className="flex items-baseline gap-1">
          <span className="text-midnight-black text-[2rem] font-medium">
            <CountUp
              start={0}
              end={data?.total_spent ?? 0}
              duration={1}
              prefix={"₹"}
            />
          </span>
        </div>
      </div>

      {!isEmpty(data?.by_category) && <hr className="border-fog-gray mb-8" />}

      <div className="space-y-5">
        {data?.by_category &&
          Object.entries(data.by_category).map(([name, amount], index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-xs font-medium text-black">
                  {startCase(name)}
                </span>
              </div>
              <div className="bg-cloud-white border-sky-mist text-navy-deep min-w-16 rounded-[8px] border px-2.5 text-center text-xs font-medium">
                <CountUp start={0} end={amount} duration={1} prefix={"₹"} />
              </div>
            </div>
          ))}
      </div>
    </Card>
  );
};

export default ExpenseChart;

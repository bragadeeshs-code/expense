import { isEmpty } from "lodash";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EmptyState from "../../Extraction/components/EmptyState";
import { formatToINR } from "@/lib/utils";

interface TopSpendersCardProps {
  topSpenders: TopSpenderItem[] | undefined;
  isLoading: boolean;
}

const TopSpendersCard: React.FC<TopSpendersCardProps> = ({
  topSpenders,
  isLoading,
}) => {
  return (
    <Card className="border-athens-gray shadow-ambient rounded-2xl px-4 sm:px-6">
      <CardHeader className="px-0">
        <CardTitle className="text-sm leading-[100%] font-medium tracking-[0%] text-black">
          Top spenders
        </CardTitle>
      </CardHeader>

      <CardContent className="flex h-60 flex-col gap-3 overflow-y-auto p-0">
        {!isLoading && isEmpty(topSpenders) ? (
          <span className="flex h-full items-center justify-center">
            <EmptyState type="no-chart-data" className="shadow-none" />
          </span>
        ) : (
          topSpenders?.map((spender, index) => (
            <div
              key={`${spender.user_id}-${index}`}
              className="border-athens-gray flex items-center justify-between rounded-2xl border bg-white px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div className="bg-lavender-mist flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold text-black">
                  {index + 1}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-black">
                    {spender.user_name}
                  </p>
                  <p className="text-steel-gray text-xs">
                    {spender.expense_count} approved expense
                    {spender.expense_count === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
              <p className="text-right text-sm font-semibold text-black">
                ₹{formatToINR(Number(spender.total_amount ?? 0))}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TopSpendersCard;

import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import ExtractionHeaderBadge from "./ExtractionHeaderBadge";

const ExtractionHeader = () => {
  const { data: user } = useCurrentuser();

  return (
    <div className="shadow-card-soft border-porcelain flex flex-col items-start gap-2 rounded-2xl border bg-white px-6 py-5 @min-3xl:flex-row @min-3xl:items-center @min-3xl:justify-between">
      <div className="space-y-1">
        <h2 className="text-rich-black text-xl font-semibold md:text-2xl">
          Expense Extraction
        </h2>
        <p className="text-steel-gray text-sm">
          Keep track of expenses with real-time metrics
        </p>
      </div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        {user?.grade && (
          <ExtractionHeaderBadge title="Employee grade:" value={user?.grade} />
        )}
        {user?.cost_center && (
          <ExtractionHeaderBadge
            title="Cost center:"
            value={user?.cost_center}
          />
        )}
      </div>
    </div>
  );
};

export default ExtractionHeader;

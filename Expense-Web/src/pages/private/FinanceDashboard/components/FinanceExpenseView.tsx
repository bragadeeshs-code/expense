import { useParams } from "react-router";
import { startCase } from "lodash";
import { FileText, ReceiptText, Users } from "lucide-react";

import { Spinner } from "@/components/ui/spinner";

import InfoCard from "@/components/common/InfoCard";
import InfoCardItem from "@/components/common/InfoCardItem";
import WorkflowProgress from "./WorkflowProgress";
import useFinanceExpenseDetails from "../helpers/hooks/useFinanceExpenseDetails";
import FinanceExpenseViewHeader from "./FinanceExpenseViewHeader";
import { format } from "date-fns";

const FinanceExpenseView = () => {
  const { id } = useParams();

  const { expenseDetails, isExpenseDetailsLoading } = useFinanceExpenseDetails(
    Number(id),
  );

  if (isExpenseDetailsLoading || !expenseDetails) {
    return (
      <div className="flex h-full items-center justify-center gap-2">
        <Spinner />
        Fetching expense details...
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <FinanceExpenseViewHeader
        id={expenseDetails.id}
        status={expenseDetails.status}
      />

      <div className="scrollbar-thin h-full space-y-6 overflow-y-auto px-5 pb-5">
        <WorkflowProgress status={expenseDetails.status} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InfoCard
            title="Employee Information"
            titleIcon={<Users className="size-5" />}
          >
            <InfoCardItem title="Name" value={expenseDetails.employee.name} />
            <InfoCardItem title="Email" value={expenseDetails.employee.email} />
            <InfoCardItem
              title="Employee ID"
              value={expenseDetails.employee.code}
            />
          </InfoCard>

          <InfoCard
            title="Expense Information"
            titleIcon={<ReceiptText className="size-5" />}
          >
            <InfoCardItem
              title="Amount"
              value={`₹ ${expenseDetails.amount}`}
              valueClassName="text-green-600 font-bold text-lg"
            />
            <InfoCardItem
              title="Category"
              value={startCase(expenseDetails.category)}
            />
            <InfoCardItem
              title="Submitted Date"
              value={format(
                expenseDetails.submitted_at,
                "MMMM d, yyyy 'at' hh:mm a",
              )}
            />
          </InfoCard>
        </div>
        <InfoCard
          title="Description & Receipts"
          titleIcon={<FileText className="size-5" />}
        >
          <InfoCardItem
            title="Description"
            value={expenseDetails.note}
            valueClassName="font-normal"
          />
          <InfoCardItem
            title="Receipts"
            value={
              <div className="bg-frosted-lavender flex items-center gap-2 rounded-lg p-3">
                <FileText className="size-4" />
                <InfoCardItem
                  className="space-y-1"
                  title={expenseDetails.name}
                  titleClassName="text-black text-sm"
                  valueClassName="text-xs text-ash-gray"
                  value={`Uploaded ${format(expenseDetails.uploaded_at, "MMMM d, yyyy 'at' hh:mm a")}`}
                />
              </div>
            }
          />
        </InfoCard>
      </div>
    </div>
  );
};

export default FinanceExpenseView;

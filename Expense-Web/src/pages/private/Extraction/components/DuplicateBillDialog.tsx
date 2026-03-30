import { format } from "date-fns";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ASSET_PATH } from "@/helpers/constants/common";
import { cn } from "@/lib/utils";

interface DuplicateBillDialogProps {
  existingExpenseId?: number;
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  title: string;
  billName: string;
  amount: string;
  date?: string;
}

export const DuplicateBillDialog: React.FC<DuplicateBillDialogProps> = ({
  existingExpenseId,
  title,
  onOpen,
  isOpen,
  billName,
  amount,
  date,
}) => {
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={onOpen}>
      <DialogContent className="rounded-3xl px-3 py-8 sm:max-w-[568px] sm:px-6.5">
        <DialogHeader className="gap-2 text-left sm:text-left">
          <div className="mb-6.5 flex">
            <img src={`${ASSET_PATH}/icons/warning.svg`} alt="icon" />
          </div>
          <DialogTitle className="text-xl leading-[100%] font-semibold tracking-[0%] text-black">
            {title}
          </DialogTitle>
          <DialogDescription className="text-ash-gray mt-4 text-sm leading-6 tracking-[0%]">
            A bill with the details —
            <span className="text-sm font-semibold text-black italic">
              {billName}, ₹{amount} {date && format(date, "d MMM yyyy")}{" "}
            </span>
            already exists.{" "}
            {existingExpenseId
              ? "You can either view the existing bill or skip this one."
              : "You can skip this one."}
          </DialogDescription>
        </DialogHeader>

        <div
          className={cn(
            "flex flex-col items-center justify-between gap-2.5 sm:flex-row",
            !existingExpenseId && "justify-end",
          )}
        >
          {existingExpenseId && (
            <Button
              variant="outline"
              onClick={() => {
                onOpen(false);
                navigate(`/my_expenses/${existingExpenseId}`);
              }}
              className="border-vivid-violet text-vivid-violet min-w-61.5 bg-transparent px-7.5 py-3 text-sm leading-[100%] font-medium tracking-[0%]"
            >
              View Existing Bill
            </Button>
          )}
          <Button
            className="min-w-61.5 [background-image:var(--gradient-primary)] px-7.5 py-3 text-sm leading-[100%] font-medium tracking-[0%] text-white"
            onClick={() => {
              onOpen(false);
              navigate("/my_expenses");
            }}
          >
            Skip Duplicate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

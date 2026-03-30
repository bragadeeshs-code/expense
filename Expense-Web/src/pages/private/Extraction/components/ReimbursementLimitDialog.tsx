import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ASSET_PATH } from "@/helpers/constants/common";
import FormTextAreaField from "@/components/common/FormTextAreaField";
import { Form } from "@/components/ui/form";
import {
  reimbursementLimitFormSchema,
  type ReimbursementLimitFormValues,
} from "../helpers/zod-schema/extractionSchema";
import { EXCEED_LIMIT_SUBMIT_TYPE_ENUM } from "../helpers/constants/extraction";

interface ReimbursementLimitDialogProps {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  totalAmount?: number;
  approval_limit?: number;
  handleSubmit: (
    submitType: ExceedLimitSubmitType,
    notesFormDialog: string,
  ) => void;
  title: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  shouldShowSubmitLimitButton?: boolean;
  errorCode?: string;
}

const ReimbursementLimitDialog: React.FC<ReimbursementLimitDialogProps> = ({
  isOpen,
  onOpen,
  handleSubmit,
  title,
  isLoading = false,
  totalAmount,
  approval_limit,
  isDisabled,
  shouldShowSubmitLimitButton = true,
  errorCode,
}) => {
  const form = useForm<ReimbursementLimitFormValues>({
    resolver: zodResolver(reimbursementLimitFormSchema),
    mode: "onTouched",
    defaultValues: {
      notes: "",
    },
  });

  const notes = form.getValues("notes");

  const onSubmit = (
    _data: ReimbursementLimitFormValues,
    event?: React.BaseSyntheticEvent,
  ) => {
    const nativeEvent = event?.nativeEvent;
    if (nativeEvent instanceof SubmitEvent) {
      const submitter = nativeEvent.submitter as HTMLButtonElement | null;
      const submitType = submitter?.name;

      if (submitType === "review") {
        handleSubmit(EXCEED_LIMIT_SUBMIT_TYPE_ENUM.SUBMIT_TO_MANAGER, notes);
      } else if (submitType === "limit") {
        handleSubmit(EXCEED_LIMIT_SUBMIT_TYPE_ENUM.SUBMIT_UPTO_LIMIT, notes);
      }
    }

    onOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpen}>
      <DialogContent
        className="rounded-3xl px-3 py-8 lg:max-w-173 lg:min-w-173 lg:px-6.5"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader className="gap-2 text-left sm:text-left">
          <div className="mb-6.5 flex">
            <img src={`${ASSET_PATH}/icons/warning.svg`} alt="icon" />
          </div>
          <DialogTitle className="text-xl leading-[100%] font-semibold tracking-[0%] text-black">
            {title}
          </DialogTitle>
          <DialogDescription className="text-ash-gray text-sm leading-6 tracking-[0%]">
            {errorCode === "LIMIT_EXHAUSTED"
              ? "This expense exceeds your grade limit and cannot be auto-approved. Please submit it to your manager for review and approval."
              : `Your expense of ₹${totalAmount} exceeds your grade limit of ₹
            ${approval_limit}. You can auto-approve ₹${approval_limit} within your
            limit, or send the full amount to your manager for review.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormTextAreaField
              name="notes"
              control={form.control}
              placeholder="Note.."
              className="border-athens-gray shadow-ultra-subtle-shadow mb-6.5 min-h-21.5 resize-none rounded-2xl"
              disabled={isDisabled}
            />

            <div className="flex flex-col justify-end gap-2.5 lg:flex-row">
              <Button
                name="review"
                variant="outline"
                type="submit"
                disabled={isDisabled}
                className="border-vivid-violet text-vivid-violet min-w-61.5 bg-transparent px-7.5 py-3 text-sm leading-[100%] font-medium tracking-[0%]"
              >
                {isLoading ? "Submitting..." : "Submit for Manager Review"}
              </Button>
              {shouldShowSubmitLimitButton && (
                <Button
                  name="limit"
                  disabled={isDisabled}
                  type="submit"
                  className="min-w-61.5 [background-image:var(--gradient-primary)] px-7.5 py-3 text-sm leading-[100%] font-medium tracking-[0%] text-white"
                >
                  {isLoading ? "Submitting..." : "Submit Only Limit Amount"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ReimbursementLimitDialog;

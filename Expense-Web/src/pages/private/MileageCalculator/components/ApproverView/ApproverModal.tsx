import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ASSET_PATH } from "@/helpers/constants/common";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";

interface ApproverModalProps {
  title: string;
  isOpen: boolean;
  isLoading?: boolean;
  isReject?: boolean;
  children?: React.ReactNode;
  description: string;
  confirmLabel: string;
  isConfirmDisabled?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ApproverModal: React.FC<ApproverModalProps> = ({
  title,
  isOpen,
  children,
  isReject,
  isLoading = false,
  description,
  confirmLabel,
  isConfirmDisabled = false,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="scrollbar-hide flex max-h-[90vh] flex-col gap-6 overflow-y-auto rounded-[32px] border-none p-8 shadow-2xl sm:max-w-[440px]">
        <div className="flex flex-col items-start gap-4 text-left">
          <img
            src={`${ASSET_PATH}/icons/alert.svg`}
            alt="Alert"
            className="h-10 w-10 shrink-0"
          />
          <DialogHeader className="gap-2 text-left">
            <DialogTitle className="text-xl font-bold tracking-tight text-black">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-cool text-sm leading-relaxed font-medium">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>

        {children && <div className="mt-0">{children}</div>}

        <DialogFooter className="mt-2 flex gap-3 sm:justify-end">
          <Button
            onClick={onClose}
            className="border-fog-gray hover:border-fog-gray min-w-[120px] border bg-white px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] text-black hover:bg-white"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={cn(
              "min-w-[120px] px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] text-white",
              isReject
                ? "bg-tomato-red!"
                : "[background-image:var(--gradient-primary)]",
            )}
            disabled={isLoading || isConfirmDisabled}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproverModal;

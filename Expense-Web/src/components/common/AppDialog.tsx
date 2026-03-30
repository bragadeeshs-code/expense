import type { ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "../ui/dialog";

interface AppDialogProps {
  isOpen: boolean;
  children?: ReactNode;
  className?: string;
  description?: string;
  dialogHeader: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogHeaderImage?: React.ReactNode;
  closeIconClassName?: string;
  isWrapperDivAvailable: boolean;
  dialogTitleClassName?: string;
  dialogHeaderClassName?: string;
  shouldShowDialogClose?: boolean;
  dialogInnerContainerClassName?: string;
}

const AppDialog: React.FC<AppDialogProps> = ({
  isOpen,
  children,
  className,
  description,
  setIsOpen,
  dialogHeader,
  dialogHeaderImage,
  closeIconClassName = "",
  isWrapperDivAvailable = false,
  dialogTitleClassName = "",
  dialogHeaderClassName = "",
  shouldShowDialogClose = true,
  dialogInnerContainerClassName,
}: AppDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "bg-white-smoke rounded-[26px] border-none outline-none",
          `${isWrapperDivAvailable ? "p-1" : "p-0"}`,
          className,
        )}
      >
        <div
          className={cn(
            "border-slate-whisper shadow-gray-soft rounded-[26px] border bg-white p-4 sm:p-8",
            dialogInnerContainerClassName,
          )}
        >
          <DialogHeader
            className={cn("text-left sm:text-center", dialogHeaderClassName)}
          >
            {dialogHeaderImage}
            <DialogTitle
              className={cn(
                "text-lg font-semibold text-black",
                dialogTitleClassName,
              )}
            >
              {dialogHeader}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-ash-gray text-sm font-normal">
                {description}
              </DialogDescription>
            )}

            {shouldShowDialogClose && (
              <span
                className={cn(
                  "bg-snow-gray absolute top-9 right-9 cursor-pointer rounded-full p-2",
                  closeIconClassName,
                )}
                onClick={() => setIsOpen(false)}
              >
                <X size={14} strokeWidth={3.2} />
              </span>
            )}
          </DialogHeader>
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppDialog;

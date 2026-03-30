import clsx from "clsx";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

type ConfirmAlertDialog = {
  open?: boolean;
  title: string;
  content: string;
  disabled?: boolean;
  children?: React.ReactNode;
  onCancel?: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  onOpenChange?: (val: boolean) => void;
  confirmVariant?: "primary" | "destructive";
  isApiResponseLoading?: boolean;
};

const confirmVariantClasses: Record<
  NonNullable<ConfirmAlertDialog["confirmVariant"]>,
  string
> = {
  primary:
    "bg-primary hover:bg-primary/90 focus-visible:ring-primary/20 dark:focus-visible:ring-primary/40 dark:bg-primary/60 ",
  destructive:
    "bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive/20 ",
};

const ConfirmAlertDialog: React.FC<ConfirmAlertDialog> = ({
  open,
  title,
  content,
  disabled,
  children,
  onCancel = () => {},
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Confirm",
  onOpenChange,
  confirmVariant = "primary",
  isApiResponseLoading = false,
}) => {
  const confirmClasses = clsx(
    confirmVariantClasses[confirmVariant],
    "rounded-[8px] text-sm leading-[100%] font-medium tracking-[0%] text-white shadow-xs",
  );
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children && (
        <AlertDialogTrigger
          disabled={disabled}
          className={cn(disabled && "cursor-not-allowed opacity-50")}
        >
          {children}
        </AlertDialogTrigger>
      )}
      <AlertDialogContent className="w-full rounded-2xl wrap-anywhere sm:w-108.5">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl leading-[100%] font-semibold tracking-[0%]">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-6 font-medium tracking-[0%]">
            {content}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            className="rounded-[8px] border text-sm leading-[100%] font-medium tracking-[0%]"
            disabled={isApiResponseLoading}
            onClick={onCancel}
          >
            {cancelText}
          </AlertDialogCancel>
          <Button
            onClick={onConfirm}
            className={confirmClasses}
            disabled={isApiResponseLoading}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmAlertDialog;

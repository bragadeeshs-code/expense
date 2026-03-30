import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ConfigureSheetProps = {
  image: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onSave?: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  saveButtonState: boolean;
  loadingText?: string;
  submitText?: string;
};

const ConfigureSheet: React.FC<ConfigureSheetProps> = ({
  image,
  title,
  children,
  description,
  onSave = () => {},
  onCancel = () => {},
  isSubmitting,
  saveButtonState,
  loadingText = "Saving...",
  submitText = "Save",
}) => {
  return (
    <SheetContent
      showCloseButton={false}
      className="w-full py-8 sm:min-w-[37.313rem]"
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <SheetHeader className="mb-4 flex flex-row gap-2.5 px-6 md:px-8">
        <div className="bg-light-lavender-purple/15 flex h-10 w-10 items-center justify-center rounded-full">
          <img src={image} alt={title} className="h-6 w-6 object-contain" />
        </div>
        <div className="space-y-1">
          <SheetTitle className="text-lg leading-[100%] font-semibold tracking-[-1%] text-black md:text-2xl">
            {title}
          </SheetTitle>
          <SheetDescription className="text-ash-gray text-sm font-medium tracking-[-1%]">
            {description}
          </SheetDescription>
        </div>
      </SheetHeader>
      <div className="scrollbar-thin overflow-y-auto">
        <div className="px-6 pb-2 @md:px-8">{children}</div>
      </div>
      <SheetFooter className="flex-row justify-end gap-4 px-6 py-0 @md:px-8">
        <SheetClose asChild>
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-cool-gray flex-1 rounded-md text-sm leading-[100%] font-medium tracking-[0%] text-black sm:flex-none sm:px-8"
          >
            Cancel
          </Button>
        </SheetClose>
        <Button
          onClick={onSave}
          disabled={isSubmitting || saveButtonState}
          className="flex-1 rounded-md [background-image:var(--gradient-primary)] text-sm leading-[100%] font-medium tracking-[0%] sm:flex-none sm:px-4"
        >
          {isSubmitting ? loadingText : submitText}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default ConfigureSheet;

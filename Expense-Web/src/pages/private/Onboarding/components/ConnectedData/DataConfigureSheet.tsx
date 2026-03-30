import { Button } from "@/components/ui/button";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type DataConfigureSheetProps = {
  image: string;
  title: string;
  description: string;
  children: React.ReactNode;
  onSave?: () => void;
  isSubmitting?: boolean;
  saveButtonState: boolean;
};

const DataConfigureSheet: React.FC<DataConfigureSheetProps> = ({
  image,
  title,
  children,
  description,
  onSave = () => {},
  isSubmitting,
  saveButtonState,
}) => {
  return (
    <SheetContent
      className="w-full py-5 sm:min-w-md"
      onOpenAutoFocus={(event) => event.preventDefault()}
    >
      <SheetHeader className="flex flex-row space-x-2 p-0 px-5">
        <div className="bg-preview-item-hover flex h-10 w-10 min-w-10 items-center justify-center rounded-full">
          <img src={image} alt={title} className="h-6 w-6 object-contain" />
        </div>
        <div className="space-y-1">
          <SheetTitle className="text-lg font-semibold tracking-[-1%] text-black md:text-xl">
            {title}
          </SheetTitle>
          <SheetDescription className="text-document-tbl-header text-sm font-medium tracking-[-1%]">
            {description}
          </SheetDescription>
        </div>
      </SheetHeader>
      <div className="scrollbar-thin h-full overflow-y-auto px-5">
        {children}
      </div>
      <SheetFooter className="ml-auto flex-row px-5 py-0">
        <SheetClose asChild>
          <Button
            variant="outline"
            className="border-alert-dialog-dismiss w-36 rounded-[8px] p-2 text-sm leading-[100%] font-medium tracking-[0%] text-black"
          >
            Cancel
          </Button>
        </SheetClose>
        <Button
          onClick={onSave}
          disabled={isSubmitting || saveButtonState}
          className="w-36 rounded-[8px] [background-image:var(--gradient-primary)] p-2 text-sm leading-[100%] font-medium tracking-[0%]"
        >
          {isSubmitting ? "Saving..." : "Save"}
        </Button>
      </SheetFooter>
    </SheetContent>
  );
};

export default DataConfigureSheet;

import FormInputField from "@/components/common/FormInputField";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ASSET_PATH } from "@/helpers/constants/common";
import { cn } from "@/lib/utils";
import { useFormContext } from "react-hook-form";

interface DocumentTableItemProps {
  index: number;
  isViewMode: boolean;
}

const DocumentTableItem: React.FC<DocumentTableItemProps> = ({
  index,
  isViewMode,
}: DocumentTableItemProps) => {
  const { control } = useFormContext();

  return (
    <div className="bg-ice-white rounded-2xl px-1 pt-2 pb-1">
      <div className="mb-1.5 flex items-center gap-1 pl-2.5">
        <img
          src={`${ASSET_PATH}/icons/bracket-circle.svg`}
          alt="icon"
          className="h-3"
        />
        <span className="text-xs leading-[100%] font-semibold tracking-[-1%] text-black">
          Item {index + 1}
        </span>
      </div>
      <div className="shadow-item-card border-periwinkle-mist rounded-2xl border bg-white">
        <Table className="px-4 py-3">
          <TableHeader className="text-ash-gray [&_tr]:border-periwinkle-mist text-xs leading-[100%] font-semibold tracking-[0%]">
            <TableRow>
              <TableHead className="p-2.5">Item</TableHead>
              <TableHead className="w-32 p-2.5">Amount (INR)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-sm leading-[100%] font-medium tracking-[0%] text-black">
            <TableRow>
              <TableCell className="p-2.5">
                <FormInputField
                  control={control}
                  name={`table_fields.${index}.item_name`}
                  placeholder="Enter item name"
                  fieldClassName="gap-0"
                  variant={"inline"}
                  labelVariant={"inline"}
                  readOnly={isViewMode}
                  className={cn(isViewMode && "border-none")}
                />
              </TableCell>
              <TableCell className="p-2.5 text-left">
                <FormInputField
                  control={control}
                  name={`table_fields.${index}.amount`}
                  placeholder="Enter amount"
                  fieldClassName="gap-0"
                  variant={"inline"}
                  labelVariant={"inline"}
                  readOnly={isViewMode}
                  className={cn(isViewMode && "border-none")}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DocumentTableItem;

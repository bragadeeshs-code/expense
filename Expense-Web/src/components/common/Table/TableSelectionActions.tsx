import { Button } from "@/components/ui/button";

interface TableSelectionActionsProps {
  rowSelectedCount: number;
  onDeleteAll: () => void;
}

const TableSelectionActions: React.FC<TableSelectionActionsProps> = ({
  rowSelectedCount,
  onDeleteAll,
}) => {
  return (
    <div className="@container">
      <div className="flex flex-row items-center gap-2">
        <span className="text-sm text-black">
          {`${rowSelectedCount} Selected`}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="border-coral-red hover:text-coral-red text-coral-red h-5 rounded-[8px] px-2 py-3 text-sm leading-[100%] font-medium tracking-[0%] hover:bg-red-50"
          onClick={onDeleteAll}
        >
          Delete All
        </Button>
      </div>
    </div>
  );
};

export default TableSelectionActions;

import { EyeIcon, Trash2 } from "lucide-react";
import { FiEdit3 } from "react-icons/fi";

import TooltipWrapper from "../TooltipWrapper";
import { Button } from "@/components/ui/button";

interface TableActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TableActions: React.FC<TableActionsProps> = ({
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="flex items-center gap-x-2">
      {onView && (
        <TooltipWrapper content="View">
          <Button
            variant="ghost"
            className="size-6"
            onClick={(event) => {
              event.stopPropagation();
              onView();
            }}
          >
            <EyeIcon className="size-3.5" />
          </Button>
        </TooltipWrapper>
      )}
      {onEdit && (
        <TooltipWrapper content="Edit">
          <Button
            variant="ghost"
            size="sm"
            onClick={(event) => {
              event.stopPropagation();
              onEdit();
            }}
            className="size-6"
          >
            <FiEdit3 className="size-3.5" />
          </Button>
        </TooltipWrapper>
      )}
      {onDelete && (
        <TooltipWrapper content="Delete">
          <Button
            variant="ghost"
            size="sm"
            className="size-6"
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="size-3.5 text-red-400" />
          </Button>
        </TooltipWrapper>
      )}
    </div>
  );
};

export default TableActions;

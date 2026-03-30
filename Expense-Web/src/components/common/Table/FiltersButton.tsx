import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "../TooltipWrapper";

interface FiltersButtonProps {
  isFilterActive: boolean;
  onFiltersPanelViewToggle: () => void;
}

const FiltersButton: React.FC<FiltersButtonProps> = ({
  isFilterActive,
  onFiltersPanelViewToggle,
}) => {
  return (
    <TooltipWrapper content="Toggle filters panel" buttonClassName="rounded-md">
      <Button
        variant="outline"
        size="sm"
        className="group hover:bg-frosted-lavender hover:border-primary relative"
        onClick={onFiltersPanelViewToggle}
      >
        <Filter className="group-hover:text-primary text-black" />
        {isFilterActive && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-green-500" />
        )}
      </Button>
    </TooltipWrapper>
  );
};

export default FiltersButton;

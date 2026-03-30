import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import TooltipWrapper from "../TooltipWrapper";

interface FiltersPanelProps {
  onReset: () => void;
  children: React.ReactNode;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({ onReset, children }) => {
  return (
    <div className="shadow-card-soft border-light-gray-blue mb-2 space-y-2 rounded-2xl border p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-black">Filters</span>
        <TooltipWrapper content="Reset filters" buttonClassName="rounded-md">
          <Button variant="outline" className="size-8" onClick={onReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </TooltipWrapper>
      </div>
      {children}
    </div>
  );
};

export default FiltersPanel;

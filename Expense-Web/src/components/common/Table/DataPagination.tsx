import { ChevronLeft, ChevronRight } from "lucide-react";

import type { Pagination } from "@/types/common.types";
import { PER_PAGE_OPTIONS } from "@/helpers/constants/common";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from "@/components/ui/select";

interface DataPaginationProps {
  pagination: Pagination;
  paginationLabel?: string;
  isLoading?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  onPerPageChange?: (value: number) => void;
  perPageOptions?: string[];
}

const DataPagination: React.FC<DataPaginationProps> = ({
  onNext,
  onPrevious,
  isLoading = false,
  onPerPageChange,
  pagination,
  paginationLabel = "items",
  perPageOptions = PER_PAGE_OPTIONS,
}) => {
  const { total, per_page, has_next_page, page } = pagination;
  const firstItemIndex = total === 0 ? 0 : (page - 1) * per_page + 1;
  const lastItemIndex = Math.min(page * per_page, total);

  return (
    <div className="@container">
      <div className="flex w-full flex-col items-center justify-between space-y-4 @md:flex-row @md:space-y-0">
        <span className="text-cool-gray text-xs font-medium whitespace-nowrap">
          Showing {firstItemIndex} - {lastItemIndex} of {total}{" "}
          {paginationLabel}
        </span>

        <div className="flex w-fit items-center gap-x-4">
          <div className="flex items-center gap-x-1.5">
            <button
              disabled={isLoading || page === 1}
              className="text-primary cursor-pointer disabled:cursor-not-allowed disabled:text-purple-300"
              onClick={onPrevious}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="border-fog-gray w-fit rounded-md border px-2.5 py-1.5 text-xs text-black">
              {String(page).padStart(2, "0")}
            </div>
            <button
              disabled={isLoading || !has_next_page}
              className="text-primary cursor-pointer disabled:cursor-not-allowed disabled:text-purple-300"
              onClick={onNext}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="flex w-fit items-center gap-x-2">
            <span className="text-ash-gray text-xs font-semibold whitespace-nowrap">
              Showing per page
            </span>
            <Select
              value={String(per_page)}
              disabled={isLoading}
              onValueChange={(val) => {
                onPerPageChange?.(Number(val));
              }}
            >
              <SelectTrigger className="border-fog-gray !h-fit cursor-pointer rounded-md border !px-3 !py-2 text-xs text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {perPageOptions.map((e: string, index: number) => {
                  return (
                    <SelectItem
                      value={e}
                      className="cursor-pointer text-xs"
                      key={index}
                    >
                      {e}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPagination;

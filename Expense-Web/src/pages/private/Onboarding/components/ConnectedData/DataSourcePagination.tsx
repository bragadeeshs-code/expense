import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataSourcePaginationProps {
  isLoading: boolean;
  pagination: PaginationProps;
}

const DataSourcePagination: React.FC<DataSourcePaginationProps> = ({
  isLoading,
  pagination,
}) => {
  const { hasNextPage, page, perPage, setPage, setPerPage, total } = pagination;
  const totalPages = Math.ceil(total / perPage);

  if (totalPages > 1)
    return (
      <div className="mt-4 flex items-center justify-end gap-3">
        <div className="flex items-center gap-2 text-sm">
          <p>Rows per page:</p>
          <Select
            value={String(perPage)}
            onValueChange={(val) => {
              setPerPage(Number(val));
              setPage(1);
            }}
            disabled={isLoading}
          >
            <SelectTrigger className="rounded-[8px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="rounded-[8px]"
            disabled={page === 1 || isLoading}
            onClick={() => setPage(page - 1)}
          >
            <IoIosArrowBack />
          </Button>
          <p className="text-sm">{page}</p>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-[8px]"
            disabled={!hasNextPage || isLoading}
            onClick={() => setPage(page + 1)}
          >
            <IoIosArrowForward />
          </Button>
        </div>
      </div>
    );
};

export default DataSourcePagination;

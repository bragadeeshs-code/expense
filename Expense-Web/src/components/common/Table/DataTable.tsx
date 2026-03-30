import {
  flexRender,
  useReactTable,
  type ColumnDef,
  getCoreRowModel,
  type SortingState,
  type RowSelectionState,
  type VisibilityState,
  type Row,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import { isEmpty, size } from "lodash";

import { Spinner } from "@/components/ui/spinner";
import type { Pagination } from "@/types/common.types";
import { SORTING_ORDER_ENUM } from "@/helpers/constants/common";
import { cn, getSortingState } from "@/lib/utils";
import type { SortingStateUpdater } from "@/types/common.types";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import EmptyState from "@/pages/private/Extraction/components/EmptyState";
import DataPagination from "./DataPagination";
import TableSelectionActions from "./TableSelectionActions";

interface DataTableProps<TData> {
  data: TData[];
  onNext?: () => void;
  columns: ColumnDef<TData>[];
  isLoading: boolean;
  pagination?: Pagination;
  onPrevious?: () => void;
  sorting?: SortingState;
  onSortingChange?: (sortingState: SortingState) => void;
  emptyState: EmptyStateType;
  onRowClick?: (row: TData) => void;
  handlePerPage?: (value: number) => void;
  loadingMessage: string;
  paginationLabel?: string;
  headerClassName?: string;
  tableRowClassName?: string;
  getTableRowClassName?: (row: TData) => string;
  enableRowSelection?: boolean | ((row: Row<TData>) => boolean);
  getRowId?: (row: TData) => string;
  columnVisibility?: VisibilityState;
  onDeleteAll?: () => void;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: React.Dispatch<
    React.SetStateAction<RowSelectionState>
  >;
  enableColumnResize?: boolean;
}

export function DataTable<TData>({
  data,
  onNext,
  columns,
  isLoading,
  pagination,
  emptyState,
  sorting,
  onSortingChange,
  onPrevious,
  onRowClick,
  handlePerPage,
  loadingMessage = "Loading records...",
  headerClassName,
  tableRowClassName,
  paginationLabel,
  getTableRowClassName,
  enableRowSelection,
  getRowId,
  columnVisibility,
  onDeleteAll,
  rowSelection,
  onRowSelectionChange,
  enableColumnResize = false,
}: DataTableProps<TData>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [lockedHeight, setLockedHeight] = useState<number | null>(null);

  const selectedCount = size(rowSelection);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowId,
    enableRowSelection,
    enableColumnResizing: enableColumnResize,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
    },
    defaultColumn: {
      enableSorting: false,
      sortDescFirst: false,
    },
    onSortingChange: (updater: SortingStateUpdater) =>
      onSortingChange?.(getSortingState(sorting ?? [], updater)),
    onRowSelectionChange,
    manualSorting: true,
    enableMultiSort: true,
    enableSortingRemoval: true,
    columnResizeMode: "onChange",
  });

  useLayoutEffect(() => {
    if (!isLoading && data.length && containerRef.current) {
      setLockedHeight(containerRef.current.offsetHeight);
    }
  }, [isLoading, data.length]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col gap-4">
      <div
        ref={containerRef}
        className="border-light-gray-blue scrollbar-thin w-full overflow-y-auto rounded-2xl border"
        style={{
          minHeight:
            isLoading && lockedHeight ? `${lockedHeight}px` : undefined,
        }}
      >
        <Table
          className={cn(
            "[&_td]:px-5 [&_td]:py-2 [&_th]:px-5 [&_th]:py-2",
            (!data.length || isLoading) && "h-full",
            enableColumnResize && "table-fixed",
          )}
          tableContainerClassName={cn((!data.length || isLoading) && "h-full")}
        >
          <TableHeader className={cn(headerClassName)}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn("hover:bg-frosted-lavender", tableRowClassName)}
              >
                {headerGroup.headers.map((header) => {
                  const isSortable = header.column.getCanSort();
                  const sortOrder = header.column.getIsSorted();
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                      className={cn(
                        "text-ash-gray relative text-xs font-semibold select-none",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-1",
                          isSortable &&
                            "group hover:text-rich-black cursor-pointer transition-colors",
                        )}
                        onClick={() => {
                          if (isSortable) {
                            header.column.toggleSorting(undefined, true);
                          }
                        }}
                      >
                        {!header.isPlaceholder &&
                          flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        {isSortable && sortOrder && (
                          <div className="text-cool-gray/50 group-hover:text-cool-gray flex items-center transition-colors">
                            {sortOrder === SORTING_ORDER_ENUM.ASC ? (
                              <ChevronUp className="size-3.5" />
                            ) : (
                              <ChevronDown className="size-3.5" />
                            )}
                          </div>
                        )}
                      </div>
                      {enableColumnResize && header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="table-column-resize-handle"
                        />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow className="hover:bg-frosted-lavender h-full">
                <TableCell
                  colSpan={columns.length}
                  className="h-full text-center"
                >
                  <div className="flex h-full items-center justify-center gap-4">
                    <Spinner />
                    <p>{loadingMessage}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "border-gainsboro hover:bg-frosted-lavender animate-slide-up border-b",
                    getTableRowClassName?.(row.original),
                  )}
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => onRowClick && onRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-[13px] font-medium text-black"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-frosted-lavender h-full">
                <TableCell colSpan={columns.length} className="h-full">
                  <EmptyState type={emptyState} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination && (
        <DataPagination
          onNext={onNext}
          isLoading={isLoading}
          onPrevious={onPrevious}
          pagination={pagination}
          onPerPageChange={handlePerPage}
          paginationLabel={paginationLabel}
        />
      )}

      {!isEmpty(data) && !!selectedCount && onDeleteAll && (
        <TableSelectionActions
          rowSelectedCount={selectedCount}
          onDeleteAll={onDeleteAll}
        />
      )}
    </div>
  );
}

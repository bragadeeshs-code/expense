import { isEqual } from "lodash";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { DataTable } from "./DataTable";
import { ASSET_PATH } from "@/helpers/constants/common";

import FiltersPanel from "../Table/FiltersPanel";
import FiltersButton from "../Table/FiltersButton";
import DebouncedSearchField from "@/components/common/DebouncedSearchField";
import ExpandableDebouncedSearch from "../ExpandableDebouncedSearch";
import FileUploadDialog from "../FileUploadDialog";
import type { FileUploadDialogProps } from "@/types/common.types";
import GradientOutlineButton from "../GradientOutlineButton";

interface DataTableLayoutProps<TData, TFilters> {
  title: string;
  className?: string;
  isLoading: boolean;
  search: string;
  onSearch: (value: string) => void;
  columnFilters?: TFilters;
  defaultFilters?: TFilters;
  filtersComponent?: React.ReactNode;
  tableTabs?: React.ReactNode;
  children?: React.ReactNode;
  onResetFilters?: () => void;
  isSearchFieldExpandable?: boolean;
  tableProps: React.ComponentProps<typeof DataTable<TData>>;
  onAddNew?: () => void;
  fileUploadProps?: FileUploadDialogProps;
}

const DataTableLayout = <TData, TFilters>({
  title,
  className,
  isLoading,
  search,
  onSearch,
  columnFilters,
  defaultFilters,
  filtersComponent,
  tableTabs,
  children,
  onResetFilters,
  tableProps,
  onAddNew,
  fileUploadProps,
  isSearchFieldExpandable = false,
}: DataTableLayoutProps<TData, TFilters>) => {
  const [isShowingFilters, setIsShowingFilters] = useState(false);

  const isFilterActive = !isEqual(defaultFilters, columnFilters);

  return (
    <Card
      className={cn(
        "border-porcelain shadow-card-soft @container gap-4.5 rounded-2xl border px-6 py-5",
        className,
      )}
    >
      <div className="@sm:flex @sm:items-center @sm:justify-between">
        <p className="mb-4 font-semibold text-black @sm:mb-0 @sm:flex-1">
          {title}
        </p>

        <div className="flex flex-col items-end gap-2 @xl:flex-row @xl:items-center @xl:justify-between">
          {isSearchFieldExpandable ? (
            <ExpandableDebouncedSearch
              search={search}
              onSearch={onSearch}
              isLoading={isLoading}
              placeholder="Search ..."
            />
          ) : (
            <DebouncedSearchField
              isLoading={isLoading}
              search={search}
              onSearch={onSearch}
              className="w-fit"
            />
          )}
          <div className="flex gap-2">
            {columnFilters && (
              <FiltersButton
                isFilterActive={isFilterActive}
                onFiltersPanelViewToggle={() =>
                  setIsShowingFilters((prev) => !prev)
                }
              />
            )}
            {fileUploadProps && <FileUploadDialog {...fileUploadProps} />}
            {onAddNew && (
              <GradientOutlineButton
                onClick={() => onAddNew()}
                disabled={isLoading}
              >
                <div className="flex items-center gap-0.5 px-2">
                  <img
                    src={`${ASSET_PATH}/icons/plus_icon.svg`}
                    alt="plus icon"
                  />
                  <p className="hidden @sm:block">Add New</p>
                  <p className="@sm:hidden">Add</p>
                </div>
              </GradientOutlineButton>
            )}
          </div>
        </div>
      </div>

      {isShowingFilters && onResetFilters && (
        <FiltersPanel onReset={onResetFilters}>{filtersComponent}</FiltersPanel>
      )}

      {tableTabs}

      <DataTable<TData> {...tableProps} />

      {children}
    </Card>
  );
};

export default DataTableLayout;

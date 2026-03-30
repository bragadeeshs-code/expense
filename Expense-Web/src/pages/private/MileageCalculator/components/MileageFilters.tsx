import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { MultiValue, MenuListProps } from "react-select";
import { components } from "react-select";
import { cn } from "@/lib/utils";

import {
  MILEAGE_STATUS_FILTER_OPTIONS,
  EXPENSE_TRAVEL_ENUM,
} from "../helpers/constants/mileage";
import { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";
import type { SelectOption, CurrentUserProject } from "@/types/common.types";
import useCurrentUserProjectsList from "@/helpers/hooks/useCurrentUserProjectsList";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import DatePicker from "@/components/common/DatePicker";
import SelectField from "@/components/common/SelectField";
import { Button } from "@/components/ui/button";
import type { MileageColumnFilters } from "../helpers/types/mileage.types";

interface MileageFiltersProps {
  onFiltersChange: (filters: MileageColumnFilters) => void;
  columnFilters: MileageColumnFilters;
  activeTab: EXPENSE_TRAVEL_ENUM;
}

const MileageFilters: React.FC<MileageFiltersProps> = ({
  onFiltersChange,
  columnFilters,
  activeTab,
}) => {
  const { debouncedSearch, updateSearch: handleSearch } = useDebouncedSearch();
  const [projectPage, setProjectPage] = useState(1);
  const perPage = 5;

  const statusOptions = MILEAGE_STATUS_FILTER_OPTIONS.map((option) => {
    if (
      activeTab === EXPENSE_TRAVEL_ENUM.MY_TRAVEL &&
      option.value === TRAVEL_EXPENSE_STATUS.SUBMITTED
    ) {
      return { ...option, label: "Submitted" };
    }
    return option;
  });

  const { projects, isProjectsFetching, pagination } =
    useCurrentUserProjectsList({
      search: debouncedSearch,
      page: projectPage,
      perPage,
    });

  const MenuList = (props: MenuListProps<CurrentUserProject, true>) => {
    const hasNext = pagination.has_next_page;
    const hasPrev = projectPage > 1;

    return (
      <components.MenuList {...props}>
        {props.children}
        <div className="border-gainsboro sticky bottom-0 z-10 flex items-center justify-center gap-2 border-t bg-white px-3 py-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "hover:bg-frosted-lavender flex h-8 items-center gap-1 px-2 text-xs font-medium transition-colors",
              hasPrev ? "text-cool-gray" : "text-silver-gray opacity-50",
            )}
            disabled={!hasPrev}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setProjectPage((prev) => prev - 1);
            }}
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </Button>

          <span className="text-gainsboro select-none">|</span>

          {hasNext ? (
            <Button
              variant="ghost"
              size="sm"
              className="text-cool-gray hover:bg-frosted-lavender flex h-8 items-center gap-1 px-2 text-xs font-medium transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setProjectPage((prev) => prev + 1);
              }}
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <div className="w-[60px]" />
          )}
        </div>
      </components.MenuList>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <DatePicker
        showIcon={false}
        placeholder="Date"
        value={
          columnFilters.fromDate ? new Date(columnFilters.fromDate) : undefined
        }
        onChange={(date) =>
          onFiltersChange({
            ...columnFilters,
            fromDate: date ? date.toISOString() : undefined,
          })
        }
        placeholderClassName="text-slate-whisper"
        disabledDates={(date) => date > new Date()}
      />

      <SelectField
        isMulti
        placeholder="Select status"
        options={statusOptions}
        className="border-silver-gray rounded-md"
        getOptionLabel={(option) => option.label}
        getOptionValue={(option) => `${option.value}`}
        placeholderClassName="text-slate-whisper"
        isClearable={false}
        styles={{
          multiValue: (base) => ({
            ...base,
            margin: "4px",
            padding: "2px 8px",
            fontSize: "12px",
            borderRadius: "999px",
          }),
        }}
        onChange={(status) =>
          onFiltersChange({
            ...columnFilters,
            status: [
              ...(status as MultiValue<SelectOption<TRAVEL_EXPENSE_STATUS>>),
            ],
          })
        }
        value={columnFilters.status}
      />

      <SelectField
        isMulti
        placeholder="Select projects"
        options={projects}
        className="border-silver-gray rounded-md"
        isLoading={isProjectsFetching}
        getOptionLabel={(option) => option.name}
        getOptionValue={(option) => option.id.toString()}
        placeholderClassName="text-slate-whisper"
        isClearable={false}
        isSearchable={true}
        onInputChange={(value) => {
          handleSearch(value);
          setProjectPage(1);
        }}
        styles={{
          multiValue: (base) => ({
            ...base,
            margin: "4px",
            padding: "2px 8px",
            fontSize: "12px",
            borderRadius: "999px",
          }),
        }}
        onChange={(project) =>
          onFiltersChange({
            ...columnFilters,
            projects: Array.from(project),
          })
        }
        value={columnFilters.projects}
        components={{ MenuList }}
      />
    </div>
  );
};

export default MileageFilters;

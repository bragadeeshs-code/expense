import { useEffect, useState } from "react";
import { REIMBURSEMENTS_LIST_TAB_FILTERS } from "@/pages/private/UserDashboard/helpers/constants/reimbursements";
import { CATEGORIES_FILTER } from "@/helpers/constants/common";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import type { ReimbursementColumnFilters } from "@/types/expense.types";
import type { SelectOption } from "@/types/common.types";
import useCurrentUserProjectsList from "@/helpers/hooks/useCurrentUserProjectsList";
import { getSubCategories } from "@/lib/utils";
import DatePicker from "../DatePicker";
import { APPROVALS_LIST_TAB_FILTERS } from "@/pages/private/Approvals/helpers/hooks/constants/approvals";
import type { SUB_CATEGORY } from "@/pages/private/ExpenseView/helpers/constants/expenseView";
import MultiSelectDropdown from "../MultiSelectDropdown";

interface ExpenseFiltersProps {
  onFiltersChange: (filters: ReimbursementColumnFilters) => void;
  columnFilters: ReimbursementColumnFilters;
  shouldShowBillDateFilter?: boolean;
  shouldShowApprovalStatusFilter?: boolean;
  shouldShowSubCategoryFilter?: boolean;
}
const ExpenseFilters: React.FC<ExpenseFiltersProps> = ({
  onFiltersChange,
  columnFilters,
  shouldShowBillDateFilter = true,
  shouldShowApprovalStatusFilter = true,
  shouldShowSubCategoryFilter = true,
}) => {
  const { debouncedSearch, updateSearch: handleSearch } = useDebouncedSearch();

  const { projects, isProjectsFetching } = useCurrentUserProjectsList({
    search: debouncedSearch,
  });
  const [subCategoriesOptions, setSubCategoriesOptions] = useState<
    SelectOption<SUB_CATEGORY>[]
  >([]);

  useEffect(() => {
    const subCategories = columnFilters.categories.flatMap((category) =>
      getSubCategories(category.value),
    );
    setSubCategoriesOptions(subCategories);

    const subCategoriesValues = subCategories.map(
      (subCategory) => subCategory.value,
    );

    const filteredSubCategories = columnFilters.subCategories.filter(
      (subcategory) => subCategoriesValues.includes(subcategory.value),
    );

    if (filteredSubCategories.length !== columnFilters.subCategories.length) {
      onFiltersChange({
        ...columnFilters,
        subCategories: filteredSubCategories,
      });
    }
  }, [columnFilters.categories]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {shouldShowBillDateFilter && (
        <DatePicker
          showIcon={false}
          placeholder="Bill date"
          value={
            columnFilters.billDate
              ? new Date(columnFilters.billDate)
              : undefined
          }
          onChange={(value) => {
            if (value) {
              return onFiltersChange({
                ...columnFilters,
                billDate: value.toISOString(),
              });
            }
          }}
          buttonClassName="min-h-full"
          placeholderClassName="text-slate-whisper text-[13px]"
        />
      )}

      <MultiSelectDropdown
        options={REIMBURSEMENTS_LIST_TAB_FILTERS}
        value={columnFilters.status}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            status: value,
          });
        }}
        getLabel={(u) => u.label}
        getValue={(u) => u.value}
        isRequired
        placeholderText="Select status"
      />

      {shouldShowApprovalStatusFilter && (
        <MultiSelectDropdown
          options={APPROVALS_LIST_TAB_FILTERS}
          value={columnFilters.approvalStatus}
          onChange={(value) => {
            onFiltersChange({
              ...columnFilters,
              approvalStatus: value,
            });
          }}
          getLabel={(u) => u.label}
          getValue={(u) => u.value}
          isRequired
          placeholderText="Select approval status"
        />
      )}

      <MultiSelectDropdown
        options={CATEGORIES_FILTER}
        value={columnFilters.categories}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            categories: value,
          });
        }}
        getLabel={(u) => u.label}
        getValue={(u) => u.value}
        isRequired
        placeholderText="Select categories"
      />

      {shouldShowSubCategoryFilter && (
        <MultiSelectDropdown
          options={subCategoriesOptions}
          value={columnFilters.subCategories}
          onChange={(value) => {
            onFiltersChange({
              ...columnFilters,
              subCategories: value,
            });
          }}
          getLabel={(u) => u.label}
          getValue={(u) => u.value}
          isRequired
          placeholderText="Select sub categories"
        />
      )}

      <MultiSelectDropdown
        options={projects}
        value={columnFilters.projects}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            projects: value,
          });
          handleSearch("");
        }}
        getLabel={(u) => u.name}
        getValue={(u) => u.id.toString()}
        isRequired
        placeholderText="Select projects"
        onSearchChange={(value) => handleSearch(value)}
        isLoading={isProjectsFetching}
      />
    </div>
  );
};

export default ExpenseFilters;

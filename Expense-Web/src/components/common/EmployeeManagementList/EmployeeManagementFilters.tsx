import { useQuery } from "@tanstack/react-query";
import useDebouncedSearch from "@/hooks/useDebouncedSearch";
import type { EmployeeColumnFilters } from "@/types/employees.types";
import { STATUS_FILTER } from "@/helpers/constants/employees";
import useGradesList from "@/helpers/hooks/useGradesList";
import useCostCentersList from "@/helpers/hooks/useCostCentersList";
import { PER_PAGE } from "@/helpers/constants/common";
import useDepartmentsList from "@/helpers/hooks/useDepartmentsList";
import { getRoles } from "@/services/roles.service";
import MultiSelectDropdown from "../MultiSelectDropdown";

interface EmployeeManagementFiltersProps {
  onFiltersChange: (filters: EmployeeColumnFilters) => void;
  columnFilters: EmployeeColumnFilters;
}
const EmployeeManagementFilters: React.FC<EmployeeManagementFiltersProps> = ({
  onFiltersChange,
  columnFilters,
}) => {
  const {
    debouncedSearch: gradesDebouncedSearch,
    updateSearch: gradesHandleSearch,
  } = useDebouncedSearch();

  const { grades, isGradesListLoading } = useGradesList({
    search: gradesDebouncedSearch,
    page: 1,
    perPage: PER_PAGE,
  });

  const { data: roles, isFetching: isRolesListLoading } =
    useQuery<RolesResponse>({
      queryFn: () => getRoles(),
      queryKey: ["roles"],
      refetchOnWindowFocus: false,
    });

  const {
    debouncedSearch: costCenterDebouncedSearch,
    updateSearch: costCentersHandleSearch,
  } = useDebouncedSearch();

  const { costCenters, isCostCentersLoading } = useCostCentersList({
    filters: { search: costCenterDebouncedSearch, page: 1, perPage: PER_PAGE },
  });

  const {
    debouncedSearch: departmentsDebouncedSearch,
    updateSearch: departmentsHandleSearch,
  } = useDebouncedSearch();

  const { departments, isDepartmentsLoading } = useDepartmentsList({
    filters: { search: departmentsDebouncedSearch, page: 1, perPage: PER_PAGE },
  });

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      <MultiSelectDropdown
        options={STATUS_FILTER}
        value={columnFilters.status}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            status: value,
          });
        }}
        getLabel={(u) => u.label}
        getValue={(u) => u.value}
        placeholderText="Select status"
      />

      <MultiSelectDropdown
        options={roles ?? []}
        value={columnFilters.roles}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            roles: value,
          });
        }}
        getLabel={(u) => u.name}
        getValue={(u) => u.id.toString()}
        placeholderText="Select roles"
        isLoading={isRolesListLoading}
      />

      <MultiSelectDropdown
        options={costCenters}
        value={columnFilters.costCenters}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            costCenters: value,
          });
          costCentersHandleSearch("");
        }}
        getLabel={(u) => u.code}
        getValue={(u) => u.id.toString()}
        placeholderText="Select cost centers"
        onSearchChange={(value) => costCentersHandleSearch(value)}
        isLoading={isCostCentersLoading}
      />

      <MultiSelectDropdown
        options={grades}
        value={columnFilters.grades}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            grades: value,
          });
          gradesHandleSearch("");
        }}
        getLabel={(u) => u.name}
        getValue={(u) => u.id.toString()}
        placeholderText="Select grades"
        onSearchChange={(value) => gradesHandleSearch(value)}
        isLoading={isGradesListLoading}
      />

      <MultiSelectDropdown
        options={departments}
        value={columnFilters.departments}
        onChange={(value) => {
          onFiltersChange({
            ...columnFilters,
            departments: value,
          });
          departmentsHandleSearch("");
        }}
        getLabel={(u) => u.name}
        getValue={(u) => u.id.toString()}
        placeholderText="Select departments"
        onSearchChange={(value) => departmentsHandleSearch(value)}
        isLoading={isDepartmentsLoading}
      />
    </div>
  );
};

export default EmployeeManagementFilters;

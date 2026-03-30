import { useState } from "react";

import { OnboardingContentHeader } from "../OnboardingContentHeader";
import EmployeeManagementList from "../../../../../components/common/EmployeeManagementList/EmployeeManagementList";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";
import {
  setColumnFilters,
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../../state-management/features/employeeListSlice";
import useEmployeeList from "@/helpers/hooks/useEmployeeList";
import useDeleteEmployee from "@/helpers/hooks/useDeleteEmployee";
import { EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/employees";

const EmployeeManagement = () => {
  const dispatch = useAppDispatch();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState<number | null>(
    null,
  );
  const filters = useAppSelector((state: RootState) => state.employeeList);

  const {
    isFetching: isFetchingEmployee,
    data: employees,
    pagination,
  } = useEmployeeList(filters);
  const { isEmployeeDeleteLoading, mutateEmployeeDelete } = useDeleteEmployee({
    setEmployeeIdToDelete,
    setIsDeleteDialogOpen,
  });

  return (
    <div className="flex h-full flex-col">
      <OnboardingContentHeader
        title="Employee Management"
        description="Add and organize employees with roles, grades, and access."
      />
      <div className="scrollbar-thin overflow-y-auto px-5 py-1 xl:px-20">
        <EmployeeManagementList
          title="Employee Details"
          columnFilters={
            filters.columnFilters ?? EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE
          }
          onFiltersChange={(filters) => dispatch(setColumnFilters(filters))}
          onResetFilters={() => {
            dispatch(setColumnFilters(EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE));
          }}
          search={filters.search}
          isDeleteDialogOpen={isDeleteDialogOpen}
          onDelete={(employeeId: number) => {
            setEmployeeIdToDelete(employeeId);
            setIsDeleteDialogOpen(true);
          }}
          isFetching={isFetchingEmployee}
          employees={employees?.data || []}
          pagination={pagination}
          onPrevious={() => dispatch(setPage(pagination.page - 1))}
          onNext={() => dispatch(setPage(pagination.page + 1))}
          onPerPageChange={(value) => dispatch(setPerPage(value))}
          isDeleteLoading={isEmployeeDeleteLoading}
          onConfirm={() => {
            if (employeeIdToDelete)
              mutateEmployeeDelete({ id: employeeIdToDelete });
          }}
          onCancel={() => setEmployeeIdToDelete(null)}
          onDialogChange={(value: boolean) => setIsDeleteDialogOpen(value)}
          onSearch={(search) => dispatch(setSearchTextFilter(search))}
        />
      </div>
    </div>
  );
};

export default EmployeeManagement;

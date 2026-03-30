import { useState } from "react";

import { cn } from "@/lib/utils";
import type { RootState } from "@/state-management/store";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setColumnFilters,
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "@/state-management/features/employeeListControllerSlice";

import AppHeader from "@/components/common/AppHeader";
import useEmployeeList from "../../../helpers/hooks/useEmployeeList";
import useDeleteEmployee from "../../../helpers/hooks/useDeleteEmployee";
import useEmployeeDashboard from "./helpers/hooks/useEmployeeDashboard";
import EmployeeManagementList from "../../../components/common/EmployeeManagementList/EmployeeManagementList";
import UserManagementStatusCard from "./UserManagementStatusCard";
import { EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/employees";

const UserManagement = () => {
  const { employeeDashboardDetails } = useEmployeeDashboard();

  const dispatch = useAppDispatch();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState<number | null>(
    null,
  );

  const filters = useAppSelector(
    (state: RootState) => state.employeeListController,
  );
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
    <section className="@container flex h-full flex-col">
      <AppHeader
        title="User Management"
        description="Manage all employees, their roles, grades, project assignments, and access permissions."
      />
      <div
        className={cn(
          "scrollbar-thin @4xl:scrollbar-none flex min-h-0 flex-1 flex-col overflow-y-auto @4xl:overflow-visible",
        )}
      >
        <div className="flex flex-1 flex-col gap-2.5 @4xl:h-full">
          <div className="grid grid-cols-1 gap-2.5 px-5 @3xl:grid-cols-3">
            <UserManagementStatusCard
              title="Total Employees"
              value={employeeDashboardDetails?.total_employees}
              className="border-soft-purple bg-light-amethyst shadow-ambient"
            />
            <UserManagementStatusCard
              title="Fully Configured"
              value={employeeDashboardDetails?.active_employees}
              className="border-soft-mint bg-emerald-green shadow-ambient"
            />
            <UserManagementStatusCard
              title="Pending Setup"
              value={employeeDashboardDetails?.pending_setup_employees}
              className="border-soft-coral bg-crimson-red shadow-ambient"
            />
          </div>
          <div className="scrollbar-thin overflow-y-auto px-5 pb-4">
            <EmployeeManagementList
              columnFilters={
                filters.columnFilters ?? EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE
              }
              onFiltersChange={(filters) => dispatch(setColumnFilters(filters))}
              isDeleteDialogOpen={isDeleteDialogOpen}
              search={filters.search}
              onDelete={(employeeId: number) => {
                setEmployeeIdToDelete(employeeId);
                setIsDeleteDialogOpen(true);
              }}
              onResetFilters={() => {
                dispatch(
                  setColumnFilters(EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE),
                );
              }}
              title="Employee Details"
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
      </div>
    </section>
  );
};

export default UserManagement;

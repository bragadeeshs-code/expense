import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import EmployeeManagementList from "../../../../components/common/EmployeeManagementList/EmployeeManagementList";
import useDeleteEmployee from "../../../../helpers/hooks/useDeleteEmployee";
import type { RootState } from "@/state-management/store";
import useTeamMemberList from "../helpers/hooks/useTeamMemberList";
import {
  setColumnFilters,
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../state-management/features/teamMemberListSlice";
import { EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE } from "@/helpers/constants/employees";

const TeamMembers = () => {
  const dispatch = useAppDispatch();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [employeeIdToDelete, setEmployeeIdToDelete] = useState<number | null>(
    null,
  );

  const filters = useAppSelector((state: RootState) => state.teamMemberList);
  const {
    isFetching: isFetchingTeamMembers,
    data: teamMembers,
    pagination,
  } = useTeamMemberList(filters);
  const { isEmployeeDeleteLoading, mutateEmployeeDelete } = useDeleteEmployee({
    setEmployeeIdToDelete,
    setIsDeleteDialogOpen,
  });

  const onDelete = (employeeId: number) => {
    setEmployeeIdToDelete(employeeId);
    setIsDeleteDialogOpen(true);
  };

  const onDialogChange = (value: boolean) => {
    setIsDeleteDialogOpen(value);
  };

  return (
    <EmployeeManagementList
      className="mx-5 mb-5"
      title="Employee Details"
      columnFilters={
        filters.columnFilters ?? EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE
      }
      onFiltersChange={(filters) => dispatch(setColumnFilters(filters))}
      onResetFilters={() => {
        dispatch(setColumnFilters(EMPLOYEES_COLUMN_FILTERS_DEFAULT_VALUE));
      }}
      isDeleteDialogOpen={isDeleteDialogOpen}
      isExpandableSearchField={false}
      onDelete={onDelete}
      search={filters.search}
      isFetching={isFetchingTeamMembers}
      employees={teamMembers?.data || []}
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
      onDialogChange={onDialogChange}
      onSearch={(search) => dispatch(setSearchTextFilter(search))}
    />
  );
};

export default TeamMembers;

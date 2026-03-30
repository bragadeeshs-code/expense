import type { RootState } from "@/state-management/store";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../../state-management/features/onboardingDepartmentsListSlice";

import DepartmentsList from "@/components/common/Departments/DepartmentsList";

const Departments = () => {
  const onboardingDepartmentsFilters = useAppSelector(
    (state: RootState) => state.onboardingDepartmentsListController,
  );

  const dispatch = useAppDispatch();

  return (
    <DepartmentsList
      className="max-h-full"
      filters={onboardingDepartmentsFilters}
      onSearch={(value) => dispatch(setSearchTextFilter(value))}
      onPageChange={(page) => dispatch(setPage(page))}
      onPerPageChange={(perPage) => dispatch(setPerPage(perPage))}
    />
  );
};

export default Departments;

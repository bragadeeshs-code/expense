import DepartmentsList from "@/components/common/Departments/DepartmentsList";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "@/state-management/features/companyDepartmentsListSlice";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";

const CompanyDepartments = () => {
  const companyDepartmentsFilters = useAppSelector(
    (state) => state.companyDepartmentsListController,
  );

  const dispatch = useAppDispatch();

  return (
    <DepartmentsList
      className="mx-5 @md:h-full"
      filters={companyDepartmentsFilters}
      onSearch={(value) => dispatch(setSearchTextFilter(value))}
      onPerPageChange={(perPage) => dispatch(setPerPage(perPage))}
      onPageChange={(page) => dispatch(setPage(page))}
    />
  );
};

export default CompanyDepartments;

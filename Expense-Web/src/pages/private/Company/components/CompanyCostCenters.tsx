import CostCentersList from "@/components/common/CostCenter/CostCentersList";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "@/state-management/features/companyCostCentersListSlice";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";

const CompanyCostCenters: React.FC = () => {
  const companyCostCentersFilters = useAppSelector(
    (state) => state.companyCostCentersListController,
  );

  const dispatch = useAppDispatch();

  return (
    <CostCentersList
      className="mx-5 @md:h-full"
      filters={companyCostCentersFilters}
      onNext={() => dispatch(setPage(companyCostCentersFilters.page + 1))}
      onSearch={(value) => dispatch(setSearchTextFilter(value))}
      onPrevious={() => dispatch(setPage(companyCostCentersFilters.page - 1))}
      onPerPageChange={(perPage) => dispatch(setPerPage(perPage))}
    />
  );
};

export default CompanyCostCenters;

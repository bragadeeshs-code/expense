import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "@/pages/private/Onboarding/state-management/features/onboardingCostCentersListSlice";

import CostCentersList from "@/components/common/CostCenter/CostCentersList";

const CostCenters: React.FC = () => {
  const onboardingCostCentersFilters = useAppSelector(
    (state) => state.onboardingCostCentersListController,
  );

  const dispatch = useAppDispatch();

  return (
    <CostCentersList
      className="max-h-full"
      filters={onboardingCostCentersFilters}
      onSearch={(value) => dispatch(setSearchTextFilter(value))}
      onNext={() => dispatch(setPage(onboardingCostCentersFilters.page + 1))}
      onPrevious={() =>
        dispatch(setPage(onboardingCostCentersFilters.page - 1))
      }
      onPerPageChange={(perPage) => dispatch(setPerPage(perPage))}
    />
  );
};

export default CostCenters;

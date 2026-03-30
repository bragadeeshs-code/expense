import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";

import DataTableLayout from "@/components/common/Table/DataTableLayout";

import { getAdvancesTableColumn } from "../helpers/table-columns/AdvancesTableColumn";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
  setSorting,
} from "../helpers/state-management/features/advancesControllerSlice";
import useAdvancesList from "../helpers/hooks/useAdvancesList";

const PendingIssuance = () => {
  const filters = useAppSelector(
    (state: RootState) => state.advancesController,
  );
  const { advancesList, isAdvancesListLoading, pagination } =
    useAdvancesList(filters);

  const dispatch = useAppDispatch();

  const columns = getAdvancesTableColumn();

  return (
    <DataTableLayout
      title="Advances"
      isLoading={isAdvancesListLoading}
      search={filters.search}
      onSearch={(search) => dispatch(setSearchTextFilter(search))}
      tableProps={{
        data: advancesList,
        columns,
        pagination: pagination,
        isLoading: isAdvancesListLoading,
        loadingMessage: "Advances loading...",
        onPrevious: () => dispatch(setPage(pagination.page - 1)),
        onNext: () => dispatch(setPage(pagination.page + 1)),
        paginationLabel: "Advances",
        emptyState: "no-advance",
        handlePerPage: (perPage) => dispatch(setPerPage(perPage)),
        sorting: filters.sorting,
        onSortingChange: (sorting) => dispatch(setSorting(sorting)),
      }}
    />
  );
};

export default PendingIssuance;

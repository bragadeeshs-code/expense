import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";

import DataTableLayout from "@/components/common/Table/DataTableLayout";

import {
  setPage,
  setPerPage,
  setSearchTextFilter,
  setSorting,
} from "../helpers/state-management/features/issuedAdvancesControllerSlice";
import useIssuedAdvancesList from "../helpers/hooks/useIssuedAdvancesList";
import { getIssuedAdvancesTableColumn } from "../helpers/table-columns/IssuedAdvancesTableColumn";

const IssuedAdvances = () => {
  const filters = useAppSelector(
    (state: RootState) => state.issuedAdvancesController,
  );
  const { issuedAdvancesList, isIssuedAdvancesListLoading, pagination } =
    useIssuedAdvancesList(filters);

  const dispatch = useAppDispatch();

  const columns = getIssuedAdvancesTableColumn();

  return (
    <DataTableLayout
      title="Advances"
      isLoading={isIssuedAdvancesListLoading}
      search={filters.search}
      onSearch={(search) => dispatch(setSearchTextFilter(search))}
      tableProps={{
        data: issuedAdvancesList,
        columns,
        pagination: pagination,
        isLoading: isIssuedAdvancesListLoading,
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

export default IssuedAdvances;

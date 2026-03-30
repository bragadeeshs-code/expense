import { useNavigate } from "react-router";

import DataTableLayout from "@/components/common/Table/DataTableLayout";
import {
  EXPENSE_TRAVEL_ENUM,
  MILEAGE_COLUMN_FILTERS_DEFAULT_VALUE,
  MileageExpenseTabs,
} from "@/pages/private/MileageCalculator/helpers/constants/mileage";
import { useMileageExpenseTableColumns } from "@/pages/private/MileageCalculator/helpers/hooks/useMileageExpenseTableColumns";
import type {
  TravelExpenseListItem,
  TravelExpenseStatusFilter,
} from "@/pages/private/MileageCalculator/helpers/types/mileage.types";

import { useAppDispatch, useAppSelector } from "@/state-management/hook";

import MileageFilters from "./MileageFilters";
import AppTabs from "@/components/common/AppTabs";
import { TRAVEL_EXPENSE_STATUS } from "@/helpers/constants/common";
import { useMemo } from "react";
import {
  resetFilters,
  setColumnFilters,
  setPage,
  setPerPage,
  setSearchTextFilter,
  setSorting,
  setStatusFilter,
} from "@/state-management/features/mileageTeamTravelListSlice";
import useMileageTeamTravelList from "../helpers/hooks/useMileageTeamTravelList";

const MileageTeamTravelList = ({
  activeTab,
}: {
  activeTab: EXPENSE_TRAVEL_ENUM;
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.mileageTeamTravelList);

  const { search, sorting, columnFilters, status } = filters;

  const { data, isFetching, pagination } = useMileageTeamTravelList({
    filters,
  });

  const columns = useMileageExpenseTableColumns(
    status === TRAVEL_EXPENSE_STATUS.SUBMITTED
      ? "Submitted"
      : status === TRAVEL_EXPENSE_STATUS.DRAFTED
        ? "Draft"
        : status,
    (item: TravelExpenseListItem) => {
      const url = `/mileage/${item.id}?tabs=${EXPENSE_TRAVEL_ENUM.TEAM_TRAVEL}`;
      navigate(url);
    },
  );

  const filteredTabs = useMemo(() => {
    return MileageExpenseTabs.filter(
      (tab) => tab.value !== TRAVEL_EXPENSE_STATUS.DRAFTED,
    );
  }, []);

  const handleRowClick = (row: TravelExpenseListItem) => {
    const url = `/mileage/${row.id}?tabs=${EXPENSE_TRAVEL_ENUM.TEAM_TRAVEL}`;
    navigate(url);
  };

  return (
    <DataTableLayout<TravelExpenseListItem, typeof columnFilters>
      title="Team travel trips"
      isLoading={isFetching}
      search={search}
      onSearch={(value) => dispatch(setSearchTextFilter(value))}
      columnFilters={columnFilters}
      defaultFilters={MILEAGE_COLUMN_FILTERS_DEFAULT_VALUE}
      onResetFilters={() => dispatch(resetFilters())}
      filtersComponent={
        <MileageFilters
          columnFilters={columnFilters}
          onFiltersChange={(newFilters) =>
            dispatch(setColumnFilters(newFilters))
          }
          activeTab={activeTab}
        />
      }
      tableProps={{
        data: data?.data || [],
        columns,
        pagination,
        isLoading: isFetching,
        loadingMessage: "Loading travel expenses...",
        onPrevious: () => dispatch(setPage(pagination.page - 1)),
        onNext: () => dispatch(setPage(pagination.page + 1)),
        handlePerPage: (value) => dispatch(setPerPage(value)),
        headerClassName: "bg-cool-gray-frost border-b border-gainsboro",
        emptyState: "no-data",
        paginationLabel: "expenses",
        sorting,
        onSortingChange: (sortingState) => dispatch(setSorting(sortingState)),
        onRowClick: (row) => handleRowClick(row),
        getTableRowClassName: () => "cursor-pointer",
      }}
      tableTabs={
        <AppTabs<TravelExpenseStatusFilter>
          value={status}
          tabsList={filteredTabs}
          defaultValue="all"
          onTabChange={(value) => dispatch(setStatusFilter(value))}
        />
      }
    />
  );
};

export default MileageTeamTravelList;

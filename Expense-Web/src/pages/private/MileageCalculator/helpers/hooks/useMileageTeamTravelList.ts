import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTeamTravelExpenses } from "@/services/mileage.service";
import {
  MILEAGE_EXPENSES_LIST_QUERY_KEY,
  PER_PAGE,
} from "@/helpers/constants/common";
import type { MileageExpenseListFilters } from "../types/mileage.types";

interface useMileageTeamTravelListProps {
  filters: MileageExpenseListFilters;
}

const useMileageTeamTravelList = ({
  filters,
}: useMileageTeamTravelListProps) => {
  const { page, perPage } = filters;

  const { data, isFetching } = useQuery({
    queryKey: [MILEAGE_EXPENSES_LIST_QUERY_KEY, filters],
    queryFn: () => getTeamTravelExpenses(filters),
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const pagination = {
    has_next_page: data?.has_next_page ?? false,
    page: data?.page ?? page,
    per_page: data?.per_page ?? perPage ?? PER_PAGE,
    total: data?.total ?? 0,
  };

  return { data, isFetching, pagination };
};

export default useMileageTeamTravelList;

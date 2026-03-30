import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getTravelExpenses } from "@/services/mileage.service";
import {
  MILEAGE_EXPENSES_LIST_QUERY_KEY,
  PER_PAGE,
} from "@/helpers/constants/common";
import type { MileageExpenseListFilters } from "../types/mileage.types";

interface useMileageMyTravelListProps {
  filters: MileageExpenseListFilters;
}

const useMileageMyTravelList = ({ filters }: useMileageMyTravelListProps) => {
  const { page, perPage } = filters;

  const { data, isFetching } = useQuery({
    queryKey: [MILEAGE_EXPENSES_LIST_QUERY_KEY, filters],
    queryFn: () => getTravelExpenses(filters),
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

export default useMileageMyTravelList;

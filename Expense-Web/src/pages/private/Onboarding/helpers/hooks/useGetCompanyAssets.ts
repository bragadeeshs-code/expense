import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { formatApiError, notifyError } from "@/lib/utils";
import { useAppSelector } from "@/state-management/hook";
import { getCompanyAssets } from "@/services/organization-setup.service";
import { COMPANY_ASSETS_MUTATION_QUERY } from "../constants/onboarding";
import { PER_PAGE } from "@/helpers/constants/common";
import type { AxiosError } from "axios";
import type { CompanyAssetsListResponse } from "../../types/onboarding.types";

const useCompanyAssets = () => {
  const [total, setTotal] = useState<number>(0);
  const filters = useAppSelector((state) => state.companyAssetsListController);
  const { page, perPage, search } = filters;

  const { isFetching, data, error } = useQuery<
    CompanyAssetsListResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [COMPANY_ASSETS_MUTATION_QUERY, page, perPage, search],
    queryFn: () => getCompanyAssets(filters),
    refetchOnWindowFocus: false,
  });

  const pagination = {
    page: data?.page ?? page,
    total: data?.total ?? total,
    per_page: data?.per_page ?? perPage ?? PER_PAGE,
    has_next_page: data?.has_next_page ?? false,
  };

  useEffect(() => {
    if (!data?.total) return;
    setTotal(data?.total);
  }, [data]);

  useEffect(() => {
    if (error) notifyError("Company Assets List Failed", formatApiError(error));
  }, [error]);

  return {
    companyAssets: data?.data ?? [],
    pagination,
    isCompanyAssetsListLoading: isFetching,
  };
};

export default useCompanyAssets;

import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";

import { formatApiError, notifyError } from "@/lib/utils";
import { getDocuments } from "@/services/uploaded-document.service";
import { UPLOADED_DOCUMENTS_LIST_QUERY_KEY } from "../constants/extraction";
import type {
  UploadedDocumentFilters,
  UploadedDocumentListResponse,
} from "../../types/extraction.types";

const useUploadedDocumentList = (filters: UploadedDocumentFilters) => {
  const [total, setTotal] = useState<number>(0);

  const { page, perPage, search, sorting } = filters;

  const { data, isFetching, isError, refetch, error } = useQuery<
    UploadedDocumentListResponse,
    AxiosError<APIErrorResponse>
  >({
    queryKey: [
      UPLOADED_DOCUMENTS_LIST_QUERY_KEY,
      page,
      search,
      perPage,
      sorting,
    ],
    queryFn: () => getDocuments(filters),
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });

  const pagination = {
    has_next_page: data?.has_next_page ?? false,
    page: data?.page ?? page,
    per_page: data?.per_page ?? perPage,
    total: data?.total ?? total,
  };

  useEffect(() => {
    if (!data?.total) return;
    setTotal(data?.total);
  }, [data]);

  useEffect(() => {
    if (isError) {
      notifyError("Failed to fetch uploaded documents", formatApiError(error));
    }
  }, [isError, error]);

  return {
    uploadedDocuments: data?.data ?? [],
    pagination,
    isUploadedDocumentsLoading: isFetching,
    refetch,
  };
};

export default useUploadedDocumentList;

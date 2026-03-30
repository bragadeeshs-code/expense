import { useState } from "react";
import { AxiosError } from "axios";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getConnections } from "@/services/connection.service";
import { CONNECTIONS_LIST_API_QUERY_KEY } from "../constants/onboarding";
import type { Connection } from "../../types/onboarding.types";

export const useAvailableSources = () => {
  const [inputPage, setInputPage] = useState(1);
  const [outputPage, setOutputPage] = useState(1);

  const [inputPageSize, setInputPageSize] = useState(5);
  const [outputPageSize, setOutputPageSize] = useState(5);

  const {
    data: inputConnections,
    error: inputError,
    refetch: refetchInput,
    isPending: isInputPending,
    isFetching: isInputFetching,
  } = useQuery<ConnectionListResponse, AxiosError<APIErrorResponse>>({
    queryKey: [
      CONNECTIONS_LIST_API_QUERY_KEY,
      "input",
      inputPage,
      inputPageSize,
    ],
    queryFn: () =>
      getConnections({
        source_type: "input",
        page: inputPage,
        per_page: inputPageSize,
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const {
    data: outputConnections,
    error: outputError,
    refetch: refetchOutput,
    isPending: isOutputPending,
    isFetching: isOutputFetching,
  } = useQuery<ConnectionListResponse, AxiosError<APIErrorResponse>>({
    queryKey: [
      CONNECTIONS_LIST_API_QUERY_KEY,
      "output",
      outputPage,
      outputPageSize,
    ],
    queryFn: () =>
      getConnections({
        source_type: "output",
        page: outputPage,
        per_page: outputPageSize,
      }),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  return {
    input: {
      connections:
        inputPage === 1
          ? [
              {
                id: 0,
                status: "connected",
                source_type: "input",
                provider_type: "manual_upload",
              } as Connection,
              ...(inputConnections?.items ?? []),
            ]
          : (inputConnections?.items ?? []),
      error: inputError,
      pending: isInputPending,
      fetching: isInputFetching,
      refetch: refetchInput,
      pagination: {
        page: inputPage,
        setPage: setInputPage,
        perPage: inputPageSize,
        setPerPage: setInputPageSize,
        total: inputConnections?.total ?? 0,
        hasNextPage: inputConnections?.has_next_page ?? false,
      },
    },
    output: {
      connections: outputConnections?.items ?? [],
      error: outputError,
      pending: isOutputPending,
      fetching: isOutputFetching,
      refetch: refetchOutput,
      pagination: {
        page: outputPage,
        setPage: setOutputPage,
        perPage: outputPageSize,
        setPerPage: setOutputPageSize,
        total: outputConnections?.total ?? 0,
        hasNextPage: outputConnections?.has_next_page ?? false,
      },
    },
  };
};

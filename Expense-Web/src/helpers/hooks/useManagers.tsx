import { getManagers } from "@/services/employee.service";
import type { EmployeeOptions } from "@/types/employees.types";
import { useQuery } from "@tanstack/react-query";

interface UseManagersProps {
  search: string;
  isEnabled?: boolean;
}

export const useManagers = ({ search, isEnabled = true }: UseManagersProps) => {
  const { data, isFetching } = useQuery<EmployeeOptions>({
    queryKey: ["managers", search],
    queryFn: () => getManagers({ search }),
    enabled: isEnabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return { managers: data, isManagersFetching: isFetching };
};

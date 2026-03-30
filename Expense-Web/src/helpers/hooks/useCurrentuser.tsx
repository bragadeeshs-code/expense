import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth-service";
import { CURRENT_USER_QUERY } from "../constants/common";
import { getViewRole } from "@/lib/utils";

export const useCurrentuser = () => {
  return useQuery({
    queryKey: [CURRENT_USER_QUERY],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    select: (user) => {
      const normalizedUser = {
        ...user,
        permissions: user.permissions ?? [],
      };

      return {
        ...normalizedUser,
        viewRole: getViewRole(normalizedUser),
      };
    },
  });
};

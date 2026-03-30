import { Navigate } from "react-router";

import { RoleEnum } from "@/helpers/constants/common";
import { hasAccess } from "@/lib/utils";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";

interface RoleGuardProps {
  children: React.ReactNode;
  access?: RoleEnum[];
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  access,
  fallback = null,
}) => {
  const { data: user, isLoading, isError } = useCurrentuser();
  const fallbackNavigate = fallback ?? <Navigate to="/" replace />;

  if (isLoading) return null;

  if (isError || !user || !hasAccess(user, access)) {
    return fallbackNavigate;
  }

  return <>{children}</>;
};

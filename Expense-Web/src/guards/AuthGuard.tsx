import React from "react";
import { Outlet } from "react-router";

import {
  getAuthRedirectUrl,
  getUserData,
  isLocalAuthDisabled,
  syncLocalDevUserData,
} from "@/lib/utils";
import { NotificationProvider } from "@/components/common/Notification/context/NotificationContext";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";

const AuthGuard: React.FC = () => {
  const isAuthDisabled = isLocalAuthDisabled();
  const userData = getUserData();
  const { data: user, isLoading, isError } = useCurrentuser();

  if (isLoading) {
    return null;
  }

  if (isAuthDisabled) {
    if (isError || !user) {
      return null;
    }

    syncLocalDevUserData(user);

    return (
      <NotificationProvider>
        <Outlet />
      </NotificationProvider>
    );
  }

  if (!userData) {
    const authRedirectUrl = getAuthRedirectUrl();
    window.location.replace(authRedirectUrl);
    return null;
  }

  return (
    <NotificationProvider>
      <Outlet />
    </NotificationProvider>
  );
};

export default AuthGuard;

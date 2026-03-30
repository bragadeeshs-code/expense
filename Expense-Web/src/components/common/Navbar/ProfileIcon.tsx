import { useNavigate } from "react-router";
import { LayoutGrid, LogOut, Settings } from "lucide-react";
import type { AxiosError } from "axios";
import { startCase } from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AppDropdown from "../AppDropdown";
import {
  notifyError,
  getUserData,
  isTransactProjectKeyAvailable,
  hasAccess,
  formatApiError,
  isLocalAuthDisabled,
} from "@/lib/utils";
import {
  CURRENT_USER_QUERY,
  RoleEnum,
  VIEW_AS_USER_KEY,
} from "@/helpers/constants/common";
import { AuthService } from "@/services/auth-service";
import { STORAGE_KEYS } from "@/helpers/constants/storage-keys";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";

const ProfileIcon = () => {
  const navigate = useNavigate();
  const userData = getUserData();
  const { data: user } = useCurrentuser();
  const queryClient = useQueryClient();
  const isAuthDisabled = isLocalAuthDisabled();

  const { mutate: mutateLogout } = useMutation({
    mutationFn: AuthService.logout,
    onSuccess: () => {
      localStorage.removeItem(STORAGE_KEYS.USER_DATA);
      queryClient.removeQueries({ queryKey: [CURRENT_USER_QUERY] });
      window.location.replace(isAuthDisabled ? "/" : "/auth");
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      notifyError("Logout Failed", formatApiError(error));
    },
  });

  const toggleAdminView = () => {
    const current = localStorage.getItem(VIEW_AS_USER_KEY) === "true";
    localStorage.setItem(VIEW_AS_USER_KEY, `${!current}`);
    window.location.reload();
  };

  return (
    <AppDropdown
      dropDownMenuLabel={
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="text-ember-black text-sm font-medium">
              {startCase(
                user
                  ? `${user.first_name} ${user.last_name}`
                  : userData?.email.split("@")[0],
              )}
            </p>
            <p className="text-muted-foreground text-sm">
              {user?.email ?? userData?.email}
            </p>
          </div>
        </div>
      }
      dropdownMenuItems={[
        {
          icon: <Settings className="mr-2 h-4 w-4" />,
          menuItemTitle: "Onboarding",
          handleClick: () => navigate("/onboarding"),
          shouldShowMenuItem: user && hasAccess(user, [RoleEnum.ADMIN]),
        },
        {
          icon: <LayoutGrid className="mr-2 h-4 w-4" />,
          menuItemTitle: "Switch to transact",
          handleClick: () =>
            (window.location.href = `${import.meta.env.VITE_TRANSACT_BASE_URL}/dashboard`),
          shouldShowMenuItem: isTransactProjectKeyAvailable(),
        },
        {
          icon: <LayoutGrid className="mr-2 h-4 w-4" />,
          menuItemTitle: `Switch to ${user?.viewRole === RoleEnum.ADMIN ? "user" : "admin"} view`,
          handleClick: toggleAdminView,
          shouldShowMenuItem: user?.role == RoleEnum.ADMIN,
        },
        {
          icon: <LogOut className="mr-2 h-4 w-4" />,
          menuItemTitle: "Log out",
          handleClick: () => mutateLogout(),
          menuTitleClass: "text-destructive",
          className: "focus:bg-destructive/10",
          shouldShowMenuItem: !isAuthDisabled,
        },
      ]}
      dropdownMenuContentClass="w-56 rounded-[8px]"
      dropdownMenuAlign="end"
    >
      <Avatar className="bg-muted flex h-8 w-8 cursor-pointer items-center justify-center rounded-full">
        <AvatarFallback>
          {userData?.email.charAt(0).toUpperCase() ?? "Z"}
        </AvatarFallback>
      </Avatar>
    </AppDropdown>
  );
};

export default ProfileIcon;

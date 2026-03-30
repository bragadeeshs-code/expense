import { useEffect } from "react";

import useMediaQuery from "@/helpers/hooks/useMediaQuery";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";
import { setIsNavOpen } from "@/state-management/features/navbar/navbarSlice";
import Navbar from "@/components/common/Navbar/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/common/Sidebar/Sidebar";
import { Outlet } from "react-router";

const AppLayout = () => {
  const { isNavOpen } = useAppSelector((state: RootState) => state.navbar);
  const dispatch = useAppDispatch();
  const isTablet = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (isTablet && isNavOpen) {
      dispatch(setIsNavOpen(false));
    }
  }, [isTablet, isNavOpen, dispatch]);

  return (
    <SidebarProvider
      className="h-full flex-col"
      style={
        {
          "--sidebar-width": "21rem",
          "--sidebar-width-mobile": "21rem",
        } as React.CSSProperties
      }
    >
      <Navbar />
      <div className="flex h-full min-h-0 flex-1">
        <AppSidebar />

        <SidebarInset className="m-0! h-full! rounded-none! shadow-none!">
          <Outlet />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;

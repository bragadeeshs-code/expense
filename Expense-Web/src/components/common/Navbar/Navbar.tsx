import { Menu } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  APP_LOGO,
  ASSET_PATH,
  CLIENT_LOGO,
  navbarItems,
} from "@/helpers/constants/common";
import ProfileIcon from "./ProfileIcon";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import type { RootState } from "@/state-management/store";
import { setIsNavOpen } from "@/state-management/features/navbar/navbarSlice";
import NavbarItem from "./NavbarItem";
import { useSidebar } from "@/components/ui/sidebar";
import Notification from "../Notification/Notification";
import { useCurrentuser } from "@/helpers/hooks/useCurrentuser";
import { hasAccess } from "@/lib/utils";

const Navbar: React.FC = () => {
  const { isNavOpen } = useAppSelector((state: RootState) => state.navbar);
  const dispatch = useAppDispatch();
  const { toggleSidebar } = useSidebar();

  const toggleNavbar = (open: boolean) => {
    dispatch(setIsNavOpen(open));
  };

  const { data: user } = useCurrentuser();

  const renderNavItems = (onOpen?: (open: boolean) => void) => {
    if (!user) return null;

    return navbarItems
      .filter((item) => hasAccess(user, item.access))
      .map((item) => (
        <NavbarItem
          key={item.href}
          icon={item.icon}
          label={item.label}
          href={item.href}
          onOpen={onOpen}
          activeIcon={item.activeIcon}
        />
      ));
  };

  return (
    <header className="shadow-header z-50 bg-white px-4">
      <div className="flex h-full w-full justify-between">
        <div className="flex min-w-0 flex-1 gap-9">
          <div className="border-cloud-silver flex items-center gap-9 border-r-2 pr-4">
            <img
              src={APP_LOGO}
              alt="z logo"
              className="w-[34px] object-contain"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-ash-gray hover:bg-sidebar-primary-foreground mr-4 cursor-pointer rounded-none p-0"
            >
              <img src={`${ASSET_PATH}/icons/panel-left.svg`} alt="icon" />
            </Button>
          </div>

          <nav className="scrollbar-thin mr-9 hidden gap-4 overflow-x-auto md:flex">
            {renderNavItems()}
          </nav>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <Notification />
            <ProfileIcon />
            <Sheet open={isNavOpen} onOpenChange={toggleNavbar}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-slate-charcoal h-[34px] w-[34px] rounded-none md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-65 border-r-0">
                <SheetTitle className="sr-only">menu</SheetTitle>
                <SheetDescription className="sr-only">
                  mobile navigation links
                </SheetDescription>

                <img
                  src={CLIENT_LOGO}
                  alt="logo"
                  className="m-4 w-25 object-contain"
                />

                <div className="flex flex-col space-y-1 overflow-y-auto px-4">
                  {renderNavItems(toggleNavbar)}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <img
            src={CLIENT_LOGO}
            alt="logo"
            className="border-cloud-silver hidden w-[98px] border-l-2 object-contain pl-5 md:flex"
          />
        </div>
      </div>
    </header>
  );
};

export default Navbar;

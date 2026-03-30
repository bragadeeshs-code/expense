import React from "react";
import { NavLink } from "react-router";

import { cn } from "@/lib/utils";

interface NavbarItemProps {
  label: string;
  icon: string;
  href: string;
  activeIcon: string;
  onOpen?: (open: boolean) => void;
}

const NavbarItem: React.FC<NavbarItemProps> = ({
  href,
  icon,
  label,
  activeIcon,
  onOpen = () => {},
}) => {
  return (
    <NavLink
      to={href}
      onClick={() => onOpen(false)}
      className={({ isActive }) =>
        cn(
          "group flex shrink-0 items-center gap-2 rounded-none border-b-2 border-b-transparent px-2 py-3 text-base leading-[100%] font-medium whitespace-nowrap text-black transition-colors md:py-4",
          isActive
            ? "text-primary border-b-primary border-b-2"
            : "hover:text-primary text-black",
        )
      }
    >
      {({ isActive }) => (
        <>
          <img
            src={icon}
            alt={label}
            className={cn(
              "h-5 w-5",
              isActive ? "hidden" : "group-hover:hidden",
            )}
          />
          <img
            src={activeIcon}
            alt={label}
            className={cn("h-5 w-5", !isActive && "hidden group-hover:block")}
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );
};

export default NavbarItem;

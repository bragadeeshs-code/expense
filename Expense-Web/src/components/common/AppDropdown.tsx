import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";

interface AppDropdownProps {
  children: React.ReactNode;
  menuTitleClass?: string;
  dropdownMenuItems: AppDropdownMenuItem[];
  dropDownMenuLabel?: React.ReactNode;
  dropdownMenuAlign?: "start" | "center" | "end";
  dropdownMenuContentClass?: string;
}

const AppDropdown: React.FC<AppDropdownProps> = ({
  children,
  dropdownMenuItems,
  dropDownMenuLabel,
  dropdownMenuAlign,
  dropdownMenuContentClass,
}: AppDropdownProps) => {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent
        align={dropdownMenuAlign}
        className={cn(dropdownMenuContentClass)}
      >
        {dropDownMenuLabel && (
          <>
            <DropdownMenuLabel asChild>{dropDownMenuLabel}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}

        {dropdownMenuItems.map(
          (
            {
              icon,
              className,
              handleClick,
              menuItemTitle,
              menuTitleClass,
              shouldShowMenuItem = true,
            },
            index,
          ) => {
            if (!shouldShowMenuItem) return;
            return (
              <DropdownMenuItem
                className={cn(
                  "cursor-pointer gap-1.5 font-medium text-black",
                  className,
                )}
                key={index}
                onClick={handleClick}
              >
                {icon && icon}
                <span className={menuTitleClass}>{menuItemTitle}</span>
              </DropdownMenuItem>
            );
          },
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppDropdown;

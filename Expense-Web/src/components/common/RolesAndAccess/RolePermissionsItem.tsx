import {
  ROLE_PERMISSIONS,
  ROLE_PERMISSIONS_COLORS,
  RoleEnum,
} from "@/helpers/constants/common";
import { cn } from "@/lib/utils";

type RolePermissionsItemProps = {
  role: RoleEnum;
  roleDescription: string;
};

const RolePermissionsItem: React.FC<RolePermissionsItemProps> = ({
  role,
  roleDescription,
}) => {
  const permissions = ROLE_PERMISSIONS[role] ?? [];
  return (
    <div className="grid grid-cols-1 gap-4 rounded-sm border-b bg-white py-5 md:grid-cols-2 xl:grid-cols-3">
      <div className="space-y-2">
        <h3 className="text-sm leading-[100%] font-semibold tracking-[-1%] text-black">
          {role}
        </h3>

        <p className="text-cool-gray text-xs leading-[100%] font-normal tracking-[-1%]">
          {roleDescription}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm leading-[100%] font-semibold tracking-[-1%] text-black">
          Permissions:
        </h3>

        <div className="flex flex-wrap gap-2 [&_div:last-child]:border-[1px]">
          {permissions.map((permission) => {
            const permissionColor = ROLE_PERMISSIONS_COLORS[permission];
            return (
              <div
                key={permission}
                className={cn(
                  "bg-cloud-veil border-pale-platinum rounded-md border px-3 py-1.5 text-[10px] leading-[100%] font-medium tracking-[0%] text-black",
                  permissionColor,
                  permissionColor && "border-none",
                )}
              >
                {permission}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RolePermissionsItem;

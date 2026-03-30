import { isEmpty } from "lodash";
import { useQuery } from "@tanstack/react-query";
import EmptyStateCard from "@/components/common/EmptyStateCard";
import { Spinner } from "@/components/ui/spinner";
import { getRoles } from "@/services/roles.service";
import { Button } from "@/components/ui/button";
import RolePermissionsItem from "./RolePermissionsItem";
import { cn } from "@/lib/utils";

interface RolesAndAccessProps {
  className?: string;
}

const RolesAndAccess: React.FC<RolesAndAccessProps> = ({ className }) => {
  const { data: roles, isFetching: isPermissionsFetching } =
    useQuery<RolesResponse>({
      queryFn: () => getRoles(),
      queryKey: ["roles"],
      refetchOnWindowFocus: false,
      retry: false,
    });

  if (isPermissionsFetching) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex items-center gap-4">
          <Spinner /> Loading roles...
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "scrollbar-thin h-full overflow-y-auto [&_div:last-child]:border-0",
        className,
      )}
    >
      {isEmpty(roles) ? (
        <EmptyStateCard
          message="No roles & access have been created yet. Start by adding your first role
           to configure access and policies."
        >
          <Button
            className="mt-4 w-36 rounded-[8px] [background-image:var(--gradient-primary)] p-2 text-sm leading-6 font-medium tracking-[0%]"
            onClick={() => {}}
          >
            Create new role
          </Button>
        </EmptyStateCard>
      ) : (
        roles?.map((role, index) => (
          <RolePermissionsItem
            key={index}
            role={role.name}
            roleDescription={role.description}
          />
        ))
      )}
    </div>
  );
};

export default RolesAndAccess;

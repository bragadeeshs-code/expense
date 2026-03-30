import CountUp from "react-countup";

import { cn } from "@/lib/utils";
import { EMPTY_PLACEHOLDER } from "@/helpers/constants/common";

interface UserManagementStatusCardProps {
  title: string;
  value?: number;
  className?: string;
}
const UserManagementStatusCard: React.FC<UserManagementStatusCardProps> = ({
  title,
  value,
  className,
}) => {
  return (
    <div
      className={cn("flex flex-col gap-5 rounded-2xl border p-6", className)}
    >
      <h3 className="text-base font-medium text-black">{title}</h3>
      {value ? (
        <CountUp
          start={0}
          end={value}
          duration={1}
          className="text-rich-black text-3xl font-medium"
        />
      ) : (
        EMPTY_PLACEHOLDER
      )}
    </div>
  );
};

export default UserManagementStatusCard;

import Avatar from "react-avatar";

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EMPTY_PLACEHOLDER } from "@/helpers/constants/common";

interface AvatarGroupProps {
  avatars: string[];
  size: string;
  maxAvatars?: number;
}

const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size,
  maxAvatars = 3,
}: AvatarGroupProps) => {
  if (!avatars.length) return EMPTY_PLACEHOLDER;

  return (
    <div className="*:ring-background flex -space-x-2 *:ring-2">
      {avatars.slice(0, maxAvatars).map((name, index) => {
        return (
          <Avatar
            name={name}
            key={index}
            size={size}
            round
            className="cursor-pointer"
          />
        );
      })}
      {avatars.length > maxAvatars && (
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-accent z-40 flex cursor-pointer items-center rounded-lg px-2 text-xs">
            <p>+{avatars.length} More</p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="scrollbar-thin max-h-48 w-[250px] space-y-1 overflow-y-auto">
            {avatars.map((name) => {
              return (
                <DropdownMenuItem className="flex max-w-full items-center gap-3">
                  <Avatar name={name} key={name} size="30" round={true} />
                  <p className="max-w-[90%] truncate" title={name}>
                    {name}
                  </p>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export default AvatarGroup;

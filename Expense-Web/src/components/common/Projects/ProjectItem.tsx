import { Button } from "@/components/ui/button";
import { ASSET_PATH } from "@/helpers/constants/common";
import { ProjectDeleteButton } from "./ProjectDeleteButton";
import { getHumanReadableDate } from "@/lib/utils";
import type { ProjectResponseData } from "@/types/common.types";

import AvatarGroup from "@/components/common/AvatarGroup";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";
import BudgetProgress from "@/pages/private/Onboarding/components/Projects/BudgetProgress";

interface ProjectItemProps {
  data: ProjectResponseData;
  onEdit: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({ data, onEdit }) => {
  return (
    <div className="shadow-ambient rounded-2xl p-6">
      <div className="flex items-center justify-between gap-2">
        <TruncatedTextWithTooltip
          text={data.code}
          className="bg-iced-lavender border-pale-purple max-w-30 rounded-lg border px-3 py-1.5 text-sm font-medium text-black"
        />
        <div className="flex items-center gap-2">
          <TooltipWrapper content="Edit project">
            <Button variant={"link"} className="p-0!" onClick={onEdit}>
              <img src={`${ASSET_PATH}/icons/pencil-edit-1.svg`} alt="edit" />
            </Button>
          </TooltipWrapper>
          <ProjectDeleteButton projectIdToDelete={data.id} />
        </div>
      </div>
      <div className="my-6">
        <h1 className="text-dark-charcoal line-clamp-1 text-sm leading-[150%] font-medium tracking-[-1%]">
          {data.name}
        </h1>
        {data.description && (
          <p className="text-dusky-gray mt-2 line-clamp-2 text-sm leading-[140%] font-medium tracking-[-1%]">
            {data.description}
          </p>
        )}
      </div>
      <div className="bg-cloud-gray border-porcelain flex w-fit gap-1.5 rounded-lg border px-3 py-1.5">
        <img src={`${ASSET_PATH}/icons/calendar.svg`} alt="edit" />
        <span className="text-xs font-medium">
          {getHumanReadableDate(data.created_at)}
        </span>
      </div>

      <div className="mt-6 w-full space-y-4">
        <BudgetProgress
          title="Monthly Budget"
          current={Number(data.current_month_spent)}
          total={Number(data.monthly_budget)}
        />
        <BudgetProgress
          title="Total Budget"
          current={Number(data.total_spent)}
          total={Number(data.total_budget)}
        />
      </div>

      <hr className="mt-6 mb-4" />
      <AvatarGroup
        avatars={data.members.map((member) => member.first_name)}
        size="24"
      />
    </div>
  );
};

export default ProjectItem;

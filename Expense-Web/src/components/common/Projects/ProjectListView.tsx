import { isEmpty } from "lodash";
import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import EmptyState from "@/pages/private/Extraction/components/EmptyState";
import ProjectItem from "./ProjectItem";

import type { ProjectResponseData } from "@/types/common.types";

interface ProjectListViewProps {
  projects: ProjectResponseData[];
  isProjectsListLoading: boolean;
  onEdit: (projectID: number) => void;
  className?: string;
}

const ProjectListView: React.FC<ProjectListViewProps> = ({
  projects,
  isProjectsListLoading,
  onEdit,
  className,
}) => {
  if (isProjectsListLoading) {
    return (
      <div className="flex h-full items-center gap-2 self-center">
        <Loader className="animate-spin" />
        Fetching projects...
      </div>
    );
  }

  if (isEmpty(projects)) {
    return (
      <div className="flex h-full items-center self-center">
        <EmptyState type="no-projects" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "scrollbar-thin ] grid min-h-0 flex-1 auto-rows-max gap-3 overflow-y-auto py-1 md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {projects.map((project, index) => {
        return (
          <ProjectItem
            data={project}
            key={index}
            onEdit={() => onEdit(project.id)}
          />
        );
      })}
    </div>
  );
};

export default ProjectListView;

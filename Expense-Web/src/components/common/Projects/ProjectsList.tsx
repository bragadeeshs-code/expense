import { cn } from "@/lib/utils";
import type { Pagination, ProjectResponseData } from "@/types/common.types";

import DataPagination from "../Table/DataPagination";
import ProjectListView from "./ProjectListView";
import { PROJECTS_LIST_PER_PAGE_OPTIONS } from "@/helpers/constants/common";

interface ProjectsListProps {
  onPrevious: () => void;
  onNext: () => void;
  onEdit: (id: number) => void;
  onPerPageChange: (value: number) => void;
  projects: ProjectResponseData[];
  pagination: Pagination;
  isProjectsListLoading: boolean;
  paginationContainerClassName?: string;
  projectsListViewContainerClassName?: string;
}

const ProjectsList: React.FC<ProjectsListProps> = ({
  onNext,
  onPerPageChange,
  onEdit,
  onPrevious,
  projects,
  pagination,
  isProjectsListLoading,
  paginationContainerClassName,
  projectsListViewContainerClassName,
}) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ProjectListView
        projects={projects}
        isProjectsListLoading={isProjectsListLoading}
        onEdit={onEdit}
        className={cn("px-5 pb-5", projectsListViewContainerClassName)}
      />
      <div className={cn("px-5 pb-5", paginationContainerClassName)}>
        <DataPagination
          isLoading={isProjectsListLoading}
          paginationLabel="projects"
          pagination={pagination}
          onPrevious={onPrevious}
          onNext={onNext}
          onPerPageChange={onPerPageChange}
          perPageOptions={PROJECTS_LIST_PER_PAGE_OPTIONS}
        />
      </div>
    </div>
  );
};

export default ProjectsList;

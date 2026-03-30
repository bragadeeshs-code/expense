import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "./state-management/projectsListControllerSlice";

import AppHeader from "@/components/common/AppHeader";
import ProjectsList from "@/components/common/Projects/ProjectsList";
import ProjectHeader from "@/components/common/Projects/ProjectHeader";
import useProjectList from "@/helpers/hooks/useProjectList";

const Projects = () => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedProjectID, setSelectedProjectID] = useState<number | null>(
    null,
  );

  const filters = useAppSelector((state) => state.projectsListController);
  const { search, page } = filters;

  const dispatch = useAppDispatch();

  const { pagination, projects, isProjectsListLoading } = useProjectList({
    filters,
  });

  const handleEdit = (id: number) => {
    setSelectedProjectID(id);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (value: boolean) => {
    setIsSheetOpen(value);
    setSelectedProjectID(null);
  };

  return (
    <div className="flex h-full flex-col">
      <AppHeader
        title="Projects & Approvals"
        description="Manage all projects, assign owners, and define approval workflows for expenses and reimbursements."
        className="flex-col items-start lg:flex-row lg:items-center lg:gap-4"
      >
        <ProjectHeader
          search={search}
          onSearch={(value) => dispatch(setSearchTextFilter(value))}
          isProjectsListLoading={isProjectsListLoading}
          isSheetOpen={isSheetOpen}
          setIsSheetOpen={handleSheetOpenChange}
          onSuccess={() => setIsSheetOpen(false)}
          selectedProjectID={selectedProjectID}
        />
      </AppHeader>
      <ProjectsList
        projects={projects}
        onEdit={handleEdit}
        pagination={pagination}
        isProjectsListLoading={isProjectsListLoading}
        onPrevious={() => dispatch(setPage(page - 1))}
        onNext={() => dispatch(setPage(page + 1))}
        onPerPageChange={(value) => dispatch(setPerPage(value))}
      />
    </div>
  );
};

export default Projects;

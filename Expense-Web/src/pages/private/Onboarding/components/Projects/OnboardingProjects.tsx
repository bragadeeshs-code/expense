import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/state-management/hook";
import { OnboardingContentHeader } from "../OnboardingContentHeader";
import {
  setPage,
  setPerPage,
  setSearchTextFilter,
} from "../../state-management/features/onboardingProjectsListControllerSlice";

import ProjectsList from "@/components/common/Projects/ProjectsList";
import ProjectHeader from "@/components/common/Projects/ProjectHeader";
import useProjectList from "@/helpers/hooks/useProjectList";

const OnboardingProjects = () => {
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [selectedProjectID, setSelectedProjectID] = useState<number | null>(
    null,
  );
  const filters = useAppSelector(
    (state) => state.onboardingProjectListController,
  );
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
      <OnboardingContentHeader
        title="Projects & Approvals"
        description="Manage projects, assign owners, set budgets, and define approval flows."
        className="flex flex-col items-start lg:flex-row lg:items-center"
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
      </OnboardingContentHeader>
      <ProjectsList
        projects={projects}
        onEdit={handleEdit}
        pagination={pagination}
        isProjectsListLoading={isProjectsListLoading}
        onPrevious={() => dispatch(setPage(page - 1))}
        onNext={() => dispatch(setPage(page + 1))}
        onPerPageChange={(value) => dispatch(setPerPage(value))}
        paginationContainerClassName="xl:px-20"
        projectsListViewContainerClassName="xl:px-20"
      />
    </div>
  );
};

export default OnboardingProjects;

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/helpers/constants/api-endpoints";
import { downloadFile } from "@/lib/utils";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import {
  ASSET_PATH,
  PROJECTS_LIST_API_QUERY_KEY,
} from "@/helpers/constants/common";

import ProjectForm from "./ProjectForm";
import useUploadProjectsFile from "@/helpers/hooks/useUploadProjectsFile";
import ExpandableDebouncedSearch from "../ExpandableDebouncedSearch";
import FileUploadDialog from "../FileUploadDialog";

interface ProjectHeader {
  search: string;
  onSearch: (value: string) => void;
  isProjectsListLoading: boolean;
  isSheetOpen: boolean;
  setIsSheetOpen: (value: boolean) => void;
  onSuccess: () => void;
  selectedProjectID: number | null;
}

const ProjectHeader = ({
  search,
  onSearch,
  isProjectsListLoading,
  isSheetOpen,
  setIsSheetOpen,
  onSuccess,
  selectedProjectID,
}: ProjectHeader) => {
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const { mutateProjectsFileUpload, isProjectsFileUploading } =
    useUploadProjectsFile({
      onUploadSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [PROJECTS_LIST_API_QUERY_KEY],
        });
        setIsUploadOpen(false);
      },
    });

  return (
    <div className="flex w-full flex-col items-end justify-end gap-2 lg:flex-1 lg:flex-row lg:items-end">
      <ExpandableDebouncedSearch
        search={search}
        onSearch={onSearch}
        isLoading={isProjectsListLoading}
        placeholder="Search ..."
      />
      <FileUploadDialog
        headerText="Add Project"
        isDialogOpen={isUploadOpen}
        isFileUploading={isProjectsFileUploading}
        onFileSelected={(file) => mutateProjectsFileUpload({ file })}
        onSampleTemplateClick={() => {
          downloadFile(
            `${import.meta.env.VITE_API_URL}/${ENDPOINTS.PROJECT.TEMPLATE}`,
          );
        }}
        setIsDialogOpen={setIsUploadOpen}
        title="Import projects from .xlsx /.csv files"
      />
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            disabled={isProjectsListLoading}
            className="border-vivid-violet hover:bg-frosted-lavender [background-image:var(--gradient-primary)] bg-clip-text px-2 text-xs leading-[100%] font-medium tracking-[0%] text-transparent hover:bg-none hover:bg-clip-content hover:text-purple-500"
          >
            <img src={`${ASSET_PATH}/icons/add.svg`} alt="edit" />
            <p>Create new project</p>
          </Button>
        </SheetTrigger>
        <ProjectForm
          isOpen={isSheetOpen}
          onSuccess={onSuccess}
          projectID={selectedProjectID}
        />
      </Sheet>
    </div>
  );
};

export default ProjectHeader;

import { Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import TooltipWrapper from "@/components/common/TooltipWrapper";
import useProjectDelete from "@/helpers/hooks/useProjectDelete";
import ConfirmAlertDialog from "@/components/common/ConfirmAlertDialog";

interface ProjectDeleteButton {
  projectIdToDelete: number;
}

export const ProjectDeleteButton: React.FC<ProjectDeleteButton> = ({
  projectIdToDelete,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const { isProjectDeleteLoading, mutateProjectDelete } = useProjectDelete({
    setIsDeleteDialogOpen,
  });

  return (
    <ConfirmAlertDialog
      open={isDeleteDialogOpen}
      onOpenChange={setIsDeleteDialogOpen}
      title="Delete Selected Project?"
      content="You're about to delete selected Project. This action cannot be undone."
      onConfirm={() => {
        if (projectIdToDelete) mutateProjectDelete({ id: projectIdToDelete });
      }}
      cancelText="Cancel"
      confirmText={isProjectDeleteLoading ? "Deleting..." : "Delete"}
      confirmVariant="destructive"
      disabled={isProjectDeleteLoading}
      isApiResponseLoading={isProjectDeleteLoading}
    >
      <TooltipWrapper content="Delete project">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-400">
          <Trash2 className="h-3.5 w-3.5 cursor-pointer" />
        </Button>
      </TooltipWrapper>
    </ConfirmAlertDialog>
  );
};

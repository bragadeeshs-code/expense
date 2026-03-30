import AppDialog from "./AppDialog";
import { ASSET_PATH } from "@/helpers/constants/common";
import ImportZone from "./ImportZone";
import type { FileUploadDialogProps } from "@/types/common.types";
import GradientOutlineButton from "./GradientOutlineButton";

export default function FileUploadDialog({
  headerText,
  isDialogOpen,
  setIsDialogOpen,
  title,
  isFileUploading,
  onFileSelected,
  onSampleTemplateClick,
}: FileUploadDialogProps) {
  return (
    <>
      <GradientOutlineButton
        onClick={() => setIsDialogOpen((prev) => !prev)}
        disabled={isFileUploading}
      >
        <div className="flex items-center gap-0.5 px-2">
          <img src={`${ASSET_PATH}/icons/plus_icon.svg`} alt="plus icon" />
          <p className="hidden sm:block">Upload via CSV</p>
          <p className="sm:hidden">Import CSV</p>
        </div>
      </GradientOutlineButton>
      <AppDialog
        isOpen={isDialogOpen}
        className="sm:max-w-120.5"
        dialogHeader={headerText}
        setIsOpen={setIsDialogOpen}
        isWrapperDivAvailable
      >
        <ImportZone
          title={title}
          disabled={isFileUploading}
          isLoading={isFileUploading}
          onFileSelected={(file) => onFileSelected(file)}
          onSampleTemplateClick={onSampleTemplateClick}
        />
      </AppDialog>
    </>
  );
}

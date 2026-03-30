import TooltipWrapper from "@/components/common/TooltipWrapper";
import { ASSET_PATH } from "@/helpers/constants/common";
import { Spinner } from "@/components/ui/spinner";
import useExpenseDownload from "@/helpers/hooks/useExpenseDownload";

interface DownloadExpenseButtonProps {
  fileName: string;
  expenseId: number;
}

const DownloadExpenseButton: React.FC<DownloadExpenseButtonProps> = ({
  fileName,
  expenseId,
}) => {
  const { mutateGetExpenseLink, isExpenseLinkLoading } = useExpenseDownload({
    fileName,
  });

  return (
    <TooltipWrapper content="Download">
      <button
        className="h-3.5 w-3.5 cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          mutateGetExpenseLink({ expenseId });
        }}
      >
        {isExpenseLinkLoading ? (
          <Spinner className="h-3.5 w-3.5" />
        ) : (
          <img
            src={`${ASSET_PATH}/icons/download_circle_icon.svg`}
            alt="Download Icon"
          />
        )}
      </button>
    </TooltipWrapper>
  );
};

export default DownloadExpenseButton;

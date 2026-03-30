import DocumentViewer from "@/components/common/DocumentViewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useAppSelector } from "@/state-management/hook";
import DocumentDetails from "./DocumentDetails";
interface ExpenseViewListProps {
  templateControllerRef: React.RefObject<
    (() => Record<string, unknown>) | null
  >;
}

const ExpenseViewList: React.FC<ExpenseViewListProps> = ({
  templateControllerRef,
}) => {
  const { extractedDocument: expense } = useAppSelector(
    (state) => state.extractedDocument,
  );

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full w-full rounded-lg"
    >
      <div className="flex w-full flex-col gap-3 overflow-y-auto px-5 @xl:h-full @xl:flex-row">
        <ResizablePanel
          defaultSize={40}
          minSize={20}
          style={{ overflow: "initial" }}
          className="shadow-card-soft border-porcelain flex flex-col rounded-2xl border px-5 py-6"
        >
          <h4 className="pb-2 text-lg font-semibold sm:pb-6 sm:text-xl">
            Original File
          </h4>
          <DocumentViewer
            url={expense?.url ?? ""}
            format={expense?.format ?? ""}
            name={expense?.name ?? ""}
            isLoading={false}
          />
        </ResizablePanel>
        <ResizableHandle className="hover:bg-accent data-[resize-handle-state=drag]:bg-accent hidden w-px bg-gray-300 transition-all duration-150 hover:shadow-[0_0_2px_2px_rgba(59,130,246,0.1)] data-[resize-handle-state=drag]:w-0.5 data-[resize-handle-state=drag]:shadow-[0_0_3px_3px_rgba(59,130,246,0.1)] @xl:block" />
        <ResizablePanel
          defaultSize={60}
          minSize={30}
          style={{ overflow: "initial" }}
        >
          <DocumentDetails templateControllerRef={templateControllerRef} />
        </ResizablePanel>
      </div>
    </ResizablePanelGroup>
  );
};

export default ExpenseViewList;

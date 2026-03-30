import { useState } from "react";
import { Outlet, useParams } from "react-router";

import AppTabs from "@/components/common/AppTabs";
import AddExpenseButton from "../../../components/common/AddExpenseButton";
import ExtractionHeader from "./components/ExtractionHeader";
import UploadedDocumentList from "./components/UploadedDocumentList";
import SubmittedReimbursementList from "./components/SubmittedReimbursementList";

import { cn } from "@/lib/utils";
import { MY_EXPENSES, MyExpensesTabs } from "./helpers/constants/extraction";

const Extraction = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<MY_EXPENSES>(MY_EXPENSES.UPLOADED);

  return (
    <div className="@container flex h-full flex-col space-y-4">
      {!id && (
        <div className="px-5 pt-5">
          <ExtractionHeader />
        </div>
      )}

      <div
        className={cn(
          "h-full",
          !id && "scrollbar-thin min-h-0 flex-1 overflow-y-auto p-5 pt-0",
        )}
      >
        {id ? (
          <Outlet />
        ) : (
          <>
            <div className="my-3.5 flex flex-col items-end justify-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-0">
              <AppTabs<MY_EXPENSES>
                value={activeTab}
                tabsList={MyExpensesTabs}
                defaultValue={MY_EXPENSES.UPLOADED}
                onTabChange={(value) => setActiveTab(value)}
                className="shadow-subtle max-w-2xl"
              />
              <AddExpenseButton />
            </div>

            {activeTab === MY_EXPENSES.UPLOADED ? (
              <UploadedDocumentList />
            ) : (
              <SubmittedReimbursementList />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Extraction;

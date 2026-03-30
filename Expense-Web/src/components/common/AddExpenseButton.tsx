import { Plus } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ASSET_PATH } from "@/helpers/constants/common";

import AppDropdown from "@/components/common/AppDropdown";
import AddExpenseDialog from "./AddExpenseDialog";

const AddExpenseButton = () => {
  const [addExpenseDialogOpen, setAddExpenseDialogOpen] =
    useState<boolean>(false);
  const [isImage, setIsImage] = useState<boolean>(false);
  return (
    <>
      <AppDropdown
        dropdownMenuContentClass="mx-5 w-[191px]"
        dropdownMenuItems={[
          {
            icon: (
              <img
                src={`${ASSET_PATH}/icons/camera-ai.svg`}
                alt="icon"
                className="h-[18px] w-[18px]"
              />
            ),
            menuItemTitle: "Use Camera",
            handleClick: () => {
              setAddExpenseDialogOpen(true);
              setIsImage(true);
            },
          },
          {
            icon: (
              <img
                src={`${ASSET_PATH}/icons/file-add.svg`}
                alt="icon"
                className="h-[18px] w-[18px]"
              />
            ),
            menuItemTitle: " Add photos and files",
            handleClick: () => {
              setAddExpenseDialogOpen(true);
              setIsImage(false);
            },
          },
          {
            icon: (
              <img
                src={`${ASSET_PATH}/icons/pencil-edit.svg`}
                alt="icon"
                className="h-[18px] w-[18px]"
              />
            ),
            menuItemTitle: "Enter manually",
            handleClick: () => {},
          },
        ]}
      >
        <Button
          variant="default"
          className="[background-image:var(--gradient-primary)] px-4 py-2.5 text-sm leading-[100%] font-medium tracking-[0%] text-white"
        >
          Add Expense <Plus className="size-5" />
        </Button>
      </AppDropdown>

      <AddExpenseDialog
        addExpenseDialogOpen={addExpenseDialogOpen}
        setAddExpenseDialogOpen={setAddExpenseDialogOpen}
        isImage={isImage}
      />
    </>
  );
};

export default AddExpenseButton;

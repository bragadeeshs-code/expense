import React, { useState } from "react";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import MemberForm from "./MemberForm";
import type { EmployeeItem } from "@/types/employees.types";

interface MemberFormSheetProps {
  children: React.ReactNode;
  employee?: EmployeeItem;
}

const MemberFormSheet: React.FC<MemberFormSheetProps> = ({
  children,
  employee,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleSuccess = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <MemberForm
        isOpen={isOpen}
        onSuccess={handleSuccess}
        employee={employee}
      />
    </Sheet>
  );
};

export default MemberFormSheet;

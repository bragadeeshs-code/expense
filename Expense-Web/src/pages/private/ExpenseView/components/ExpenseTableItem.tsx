import React from "react";

import { cn } from "@/lib/utils";
import type { ConfidenceRatedValue } from "@/types/document-response.types";
import { ASSET_PATH, EMPTY_PLACEHOLDER } from "@/helpers/constants/common";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ExpenseTableItemProps {
  index: number;
  icon?: string;
  headers: Array<{ label: string; className?: string }>;
  row: { name?: ConfidenceRatedValue; amount?: ConfidenceRatedValue };
}

const ExpenseTableItem: React.FC<ExpenseTableItemProps> = ({
  index,
  icon = `${ASSET_PATH}/icons/bracket-circle.svg`,
  row,
  headers,
}) => {
  return (
    <div className="bg-ice-white rounded-2xl px-1 pt-2 pb-1">
      <div className="mb-1.5 flex items-center gap-1 pl-2.5">
        <img src={icon} alt="icon" className="h-3" />
        <span className="text-xs leading-[100%] font-semibold tracking-[-1%] text-black">
          item {index + 1}
        </span>
      </div>

      <div className="shadow-item-card border-periwinkle-mist rounded-2xl border bg-white px-2">
        <Table className="w-full table-fixed">
          <TableHeader className="text-ash-gray [&_tr]:border-periwinkle-mist text-xs leading-[100%] font-semibold tracking-[0%]">
            <TableRow>
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className={cn("p-2.5", header.className)}
                >
                  {header.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="[&_tr]:border-periwinkle-mist text-sm leading-[100%] font-medium tracking-[0%] text-black">
            <TableRow key={index}>
              <TableCell className="truncate p-2.5">
                <p>{row.name?.value ?? EMPTY_PLACEHOLDER}</p>
              </TableCell>
              <TableCell className="truncate p-2.5 text-left">
                <p>{row.amount?.value ?? EMPTY_PLACEHOLDER}</p>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ExpenseTableItem;

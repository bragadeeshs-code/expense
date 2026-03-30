import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { startCase } from "lodash";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn, formatToINR } from "@/lib/utils";
import type { Reimbursement } from "@/types/common.types";
import {
  ASSET_PATH,
  EMPTY_PLACEHOLDER,
  ReimbursementStatusEnum,
} from "@/helpers/constants/common";

import AvatarGroup from "../AvatarGroup";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import DownloadExpenseButton from "@/components/common/ReimbursementsList/DownloadExpenseButton";
import TruncatedTextWithTooltip from "../TruncatedTextWithTooltip";
import AppBadge from "../AppBadge";

interface useReimbursementsTableColumnsProps {
  handlePreview: (reimbursement: Reimbursement) => void;
  onDeleteDocument: (userExpenseIdToDelete: number) => void;
}

export const useReimbursementsTableColumns = ({
  handlePreview,
  onDeleteDocument,
}: useReimbursementsTableColumnsProps): ColumnDef<Reimbursement>[] => [
  {
    id: "select",
    size: 30,
    enableResizing: false,
    header: ({ table }) => (
      <TooltipWrapper
        content="Select rows with Pending status only."
        buttonClassName={cn(
          "rounded-[4px]",
          (table.getIsAllRowsSelected() || table.getIsSomePageRowsSelected()) &&
            "text-white bg-primary border-none",
        )}
        applyAsChildAttribute
      >
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            table.getIsSomePageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="data-table-check-box"
          title="Select all"
        />
      </TooltipWrapper>
    ),
    cell: ({ row }) => (
      <TooltipWrapper
        content="Select rows with Pending status only."
        buttonClassName={cn(
          "rounded-[4px]",
          row.getIsSelected() && "text-white bg-primary border-none",
        )}
        applyAsChildAttribute
      >
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className={cn(
            "data-table-check-box",
            !row.getCanSelect() && "cursor-not-allowed!",
          )}
          title="Select"
          onClick={(event) => {
            event.stopPropagation();
          }}
          disabled={!row.getCanSelect()}
        />
      </TooltipWrapper>
    ),
  },
  {
    header: "Bill date",
    accessorKey: "bill_date",
    enableSorting: true,
    size: 120,
    minSize: 100,
    maxSize: 140,
    cell: ({ row }) => (
      <p>
        {row.original.bill_date
          ? format(row.original.bill_date, "d MMM")
          : EMPTY_PLACEHOLDER}
      </p>
    ),
  },
  {
    accessorKey: "submitted_at",
    header: "Submission date",
    enableSorting: true,
    size: 160,
    minSize: 140,
    maxSize: 180,
    cell: ({ row }) => (
      <TruncatedTextWithTooltip
        text={
          row.original.submitted_at
            ? format(row.original.submitted_at, "d MMM")
            : EMPTY_PLACEHOLDER
        }
      />
    ),
  },
  {
    header: "Vendor Name",
    accessorKey: "vendor_name",
    enableSorting: true,
    size: 180,
    minSize: 140,
    maxSize: 200,
    cell: ({ row }) => (
      <TruncatedTextWithTooltip
        text={row.original.vendor_name ?? EMPTY_PLACEHOLDER}
      />
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
    enableSorting: true,
    size: 140,
    minSize: 120,
    maxSize: 160,
    cell: ({ row }) => (
      <TruncatedTextWithTooltip
        text={
          row.original.category
            ? startCase(row.original.category)
            : EMPTY_PLACEHOLDER
        }
      />
    ),
  },
  {
    header: "Project ID",
    accessorKey: "project_code",
    enableSorting: true,
    size: 140,
    minSize: 120,
    maxSize: 160,
    cell: ({ row }) => {
      if (row.original.project_code) {
        return (
          <TruncatedTextWithTooltip
            className="border-pale-purple bg-iced-lavender rounded-md border px-2.5 py-1 text-center text-xs leading-[100%] tracking-[0%]"
            text={
              row.original.project_code
                ? row.original.project_code
                : EMPTY_PLACEHOLDER
            }
          />
        );
      }
      return EMPTY_PLACEHOLDER;
    },
  },
  {
    header: "Amount",
    accessorKey: "total_amount",
    enableSorting: true,
    enableResizing: true,
    size: 120,
    minSize: 100,
    maxSize: 140,
    cell: ({ row }) => (
      <TruncatedTextWithTooltip
        text={
          row.original.total_amount
            ? `₹ ${formatToINR(row.original.total_amount)}`
            : EMPTY_PLACEHOLDER
        }
      />
    ),
  },
  {
    header: "Split",
    accessorKey: "split_with",
    size: 100,
    enableResizing: false,
    cell: ({ row }) => (
      <AvatarGroup
        size="20"
        avatars={row.original.split_with.map((member) => member.email)}
      />
    ),
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 120,
    enableResizing: false,
    cell: ({ row }) => {
      return (
        <AppBadge type={row.original.status}>{row.original.status}</AppBadge>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    size: 120,
    enableResizing: false,
    cell: ({ row }) => {
      return (
        <div className="flex gap-4">
          <TooltipWrapper content="View">
            <button
              className="h-3.5 w-3.5 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(row.original);
              }}
            >
              <img src={`${ASSET_PATH}/icons/view_icon.svg`} alt="View Icon" />
            </button>
          </TooltipWrapper>

          <DownloadExpenseButton
            expenseId={row.original.id}
            fileName={row.original.name}
          />

          {row.original.status === ReimbursementStatusEnum.PENDING && (
            <TooltipWrapper content="Delete File">
              <Button
                variant="ghost"
                size="sm"
                className="h-3.5 w-3.5 px-0! text-red-400"
                onClick={(event) => {
                  event.stopPropagation();
                  onDeleteDocument(row.original.user_expense_id);
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </TooltipWrapper>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "tat_date",
    header: "TAT",
    size: 80,
    enableResizing: false,
    cell: ({ row }) => (
      <p>{row.original.tat_date ? row.original.tat_date : EMPTY_PLACEHOLDER}</p>
    ),
  },
];

import { format } from "date-fns";
import Avatar from "react-avatar";
import { capitalize, startCase } from "lodash";
import type { ColumnDef } from "@tanstack/react-table";

import { formatToINR } from "@/lib/utils";
import { ASSET_PATH, EMPTY_PLACEHOLDER } from "@/helpers/constants/common";

import AppBadge from "@/components/common/AppBadge";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import type { TeamsExpenseItem } from "@/types/expense.types";

export const useTeamsExpensesTableColumns =
  (): ColumnDef<TeamsExpenseItem>[] => [
    {
      accessorKey: "name",
      header: "Employee Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2.5">
          <Avatar
            name={row.original.employee_name}
            key={row.original.id}
            maxInitials={2}
            size="20"
            round
          />
          <span>{row.original.employee_name}</span>
        </div>
      ),
    },
    {
      accessorKey: "bill_date",
      header: "Date",
      cell: ({ row }) => (
        <p>
          {row.original.bill_date
            ? format(row.original.bill_date, "d MMM")
            : EMPTY_PLACEHOLDER}
        </p>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => `₹${formatToINR(Number(row.original.amount))}`,
    },
    {
      accessorKey: "project_code",
      header: "Project ID",
      cell: ({ row }) => {
        return (
          <AppBadge type="PROJECT_CODE">{row.original.project_code}</AppBadge>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => startCase(row.original.category),
    },
    {
      accessorKey: "sub_category",
      header: "Sub Category",
      cell: ({ row }) => (
        <p>
          {row.original.sub_category
            ? startCase(row.original.sub_category)
            : EMPTY_PLACEHOLDER}
        </p>
      ),
    },
    {
      accessorKey: "status",
      header: "Receipt Status",
      cell: ({ row }) => {
        return (
          <AppBadge className="py-1" type={row.original.status}>
            {row.original.status}
          </AppBadge>
        );
      },
    },
    {
      accessorKey: "approval_status",
      header: "Approval Status",
      cell: ({ row }) => {
        return (
          <AppBadge className="py-1" type={row.original.approval_status}>
            {capitalize(row.original.approval_status)}
          </AppBadge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: () => {
        return (
          <div className="flex gap-4">
            <TooltipWrapper content="View">
              <button className="h-3.5 w-3.5 cursor-pointer">
                <img
                  src={`${ASSET_PATH}/icons/view_icon.svg`}
                  alt="View Icon"
                />
              </button>
            </TooltipWrapper>

            <TooltipWrapper content="Download">
              <button className="h-3.5 w-3.5 cursor-pointer">
                <img
                  src={`${ASSET_PATH}/icons/download_circle_icon.svg`}
                  alt="Download Icon"
                />
              </button>
            </TooltipWrapper>
          </div>
        );
      },
    },
  ];

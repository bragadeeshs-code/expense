import Avatar from "react-avatar";
import { Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { formatWithPlus } from "@/lib/utils";
import { ASSET_PATH, EMPTY_PLACEHOLDER } from "@/helpers/constants/common";

import AppBadge from "@/components/common/AppBadge";
import BadgeCell from "@/components/common/Table/BadgeCell";
import MemberFormSheet from "../../components/common/EmployeeManagementList/MemberFormSheet";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";
import MaskedTableCell from "@/components/common/EmployeeManagementList/MaskedTableCell";
import type { EmployeeItem } from "@/types/employees.types";

interface useEmployeesTableColumnsProps {
  onDelete: (employeeId: number) => void;
}

export const useEmployeesTableColumns = ({
  onDelete,
}: useEmployeesTableColumnsProps): ColumnDef<EmployeeItem>[] => [
  {
    accessorKey: "code",
    header: "EMP ID",
  },
  {
    accessorKey: "name",
    header: "Employee Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          name={row.original.first_name + " " + row.original.last_name}
          key={row.original.id}
          maxInitials={2}
          size="20"
          round
        />
        <TruncatedTextWithTooltip
          className="max-w-50"
          text={row.original.first_name + " " + row.original.last_name}
        />
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) =>
      row.original.email ? (
        <MaskedTableCell value={row.original.email} />
      ) : (
        EMPTY_PLACEHOLDER
      ),
  },
  {
    accessorKey: "mobile_no",
    header: "Mobile number",
    cell: ({ row }) =>
      row.original.mobile_number ? (
        <MaskedTableCell value={formatWithPlus(row.original.mobile_number)} />
      ) : (
        EMPTY_PLACEHOLDER
      ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <AppBadge type={row.original.status}>{row.original.status}</AppBadge>
    ),
  },
  {
    accessorKey: "grade",
    header: "Grade",
    cell: ({ row }) => (
      <TruncatedTextWithTooltip
        text={row.original.grade?.name}
        className="border-cloud-silver bg-athens-gray max-w-25 rounded-md border px-3 py-1.5 text-xs leading-[100%] font-medium tracking-[0%] text-black"
      />
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <BadgeCell text={row.original.role?.name} />,
  },
  {
    accessorKey: "cost_center",
    header: "Cost Center",
    cell: ({ row }) => (
      <TruncatedTextWithTooltip
        className="max-w-30"
        text={row.original.cost_center?.code ?? EMPTY_PLACEHOLDER}
      />
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <TruncatedTextWithTooltip
        text={row.original.department?.name ?? EMPTY_PLACEHOLDER}
        className="max-w-30"
      />
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {/* <TooltipWrapper content="View">
            <button
              className="h-3.5 w-3.5 cursor-pointer"
              onClick={(event) => {
                event.stopPropagation();
              }}
            >
              <img src={`${ASSET_PATH}/icons/view_icon.svg`} alt="View Icon" />
            </button>
          </TooltipWrapper> */}
          <MemberFormSheet employee={row.original}>
            <Button
              title="Edit employee"
              variant="ghost"
              size="sm"
              onClick={(event) => event.stopPropagation()}
              className="p-0"
            >
              <img
                src={`${ASSET_PATH}/icons/pencil-edit.svg`}
                alt="Edit Icon"
              />
            </Button>
          </MemberFormSheet>
          {/* <TooltipWrapper content="Delete employee"> */}
          <Button
            title="Delete employee"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-400"
            onClick={() => onDelete(row.original.id)}
          >
            <Trash2 className="h-3.5 w-3.5 cursor-pointer" />
          </Button>
          {/* </TooltipWrapper> */}
        </div>
      );
    },
  },
];

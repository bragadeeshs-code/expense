import { format } from "date-fns";
import { startCase } from "lodash";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { UploadedDocument } from "../types/extraction.types";
import { getHumanReadableDate } from "@/lib/utils";
import {
  EMPTY_PLACEHOLDER,
  ReimbursementStatusEnum,
} from "@/helpers/constants/common";

import AppBadge from "../../../../components/common/AppBadge";
import { Checkbox } from "@/components/ui/checkbox";
import TruncatedTextWithTooltip from "@/components/common/TruncatedTextWithTooltip";
import TableActions from "@/components/common/Table/TableActions";

interface useUploadedDocumentsTableColumnsProps {
  handlePreview: (document: UploadedDocument) => void;
  onDeleteDocument: (userExpenseIdToDelete: number) => void;
  onExtractDocument: (userExpenseId: number) => void;
}

const renderStatusDependentCell = (
  document: UploadedDocument,
  renderValue: () => React.ReactNode,
) => {
  if (document.status === ReimbursementStatusEnum.EXTRACTING) {
    return <Spinner className="text-honey bg-transparent" />;
  } else if (document.status === ReimbursementStatusEnum.UPLOADED) {
    return EMPTY_PLACEHOLDER;
  } else return renderValue();
};

export const useUploadedDocumentsTableColumns = ({
  handlePreview,
  onDeleteDocument,
  onExtractDocument,
}: useUploadedDocumentsTableColumnsProps): ColumnDef<UploadedDocument>[] => [
  {
    id: "select",
    size: 30,
    enableResizing: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="data-table-check-box"
        title="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="data-table-check-box"
        title="Select"
        onClick={(event) => {
          event.stopPropagation();
        }}
      />
    ),
  },
  {
    accessorKey: "bill_date",
    header: "Bill Date",
    size: 100,
    minSize: 80,
    maxSize: 120,
    cell: ({ row }) =>
      renderStatusDependentCell(row.original, () => (
        <p>
          {row.original.bill_date
            ? format(row.original.bill_date, "d MMM")
            : EMPTY_PLACEHOLDER}
        </p>
      )),
  },
  {
    accessorKey: "vendor_name",
    header: "Vendor Name",
    size: 180,
    minSize: 140,
    maxSize: 200,
    cell: ({ row }) =>
      renderStatusDependentCell(row.original, () => (
        <TruncatedTextWithTooltip
          text={row.original.vendor_name ?? EMPTY_PLACEHOLDER}
        />
      )),
  },

  {
    accessorKey: "category",
    header: "Category",
    size: 120,
    minSize: 100,
    maxSize: 140,
    cell: ({ row }) =>
      renderStatusDependentCell(row.original, () => (
        <TruncatedTextWithTooltip
          text={
            row.original.category
              ? startCase(row.original.category)
              : EMPTY_PLACEHOLDER
          }
        />
      )),
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120,
    enableResizing: false,
    cell: ({ row }) => {
      const status = row.original.status;
      if (status === ReimbursementStatusEnum.UPLOADED) {
        return (
          <Button
            onClick={(event) => {
              event.stopPropagation();
              onExtractDocument(row.original.user_expense_id);
            }}
            variant="outline"
            className="border-vivid-violet hover:bg-frosted-lavender h-6 [background-image:var(--gradient-primary)] bg-clip-text text-xs leading-[100%] font-medium tracking-[0%] text-transparent hover:bg-none hover:bg-clip-content hover:text-purple-500"
          >
            Extract
          </Button>
        );
      }
      return (
        <AppBadge type={status}>
          {status === ReimbursementStatusEnum.EXTRACTING && <Spinner />}
          {status}
        </AppBadge>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Uploaded At",
    size: 170,
    enableResizing: false,
    cell: ({ row }) => (
      <AppBadge type="BASIC">
        {getHumanReadableDate(row.original.created_at, "short", true)}
      </AppBadge>
    ),
  },
  {
    id: "actions",
    header: "Action",
    size: 100,
    enableResizing: false,
    cell: ({ row }) => {
      return (
        <TableActions
          onView={() => handlePreview(row.original)}
          onDelete={() => onDeleteDocument(row.original.user_expense_id)}
        />
      );
    },
  },
];

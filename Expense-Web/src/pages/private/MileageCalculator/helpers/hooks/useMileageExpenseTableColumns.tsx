import { format } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";

import { cn, formatToINR } from "@/lib/utils";
import type { TravelExpenseListItem } from "@/pages/private/MileageCalculator/helpers/types/mileage.types";
import {
  ASSET_PATH,
  EMPTY_PLACEHOLDER,
  TRAVEL_EXPENSE_STATUS,
} from "@/helpers/constants/common";
import { MILEAGE_STATUS_STYLES } from "@/pages/private/MileageCalculator/helpers/constants/mileage";

import Avatar from "react-avatar";
import AppBadge from "@/components/common/AppBadge";
import TooltipWrapper from "@/components/common/TooltipWrapper";
import TableActions from "@/components/common/Table/TableActions";

export const useMileageExpenseTableColumns = (
  statusBadge: string,
  onView: (item: TravelExpenseListItem) => void,
): ColumnDef<TravelExpenseListItem>[] => {
  const columns: ColumnDef<TravelExpenseListItem>[] = [
    {
      accessorKey: "id",
      header: "Mileage ID",
      cell: ({ row }) => `Mileage-${row.original.id}`,
    },
  ];

  columns.push({
    accessorKey: "customer_name",
    header: "Customer Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <Avatar
          name={row.original.customer_name || "N/A"}
          size="24"
          round={true}
          className="text-[10px]"
        />
        <span className="max-w-[120px] truncate font-medium text-black">
          {row.original.customer_name || "N/A"}
        </span>
      </div>
    ),
  });

  columns.push(
    {
      accessorKey: "from_date",
      header: "Date",
      cell: ({ row }) => {
        const { from_date, to_date } = row.original;
        const formatDateStr = (dateStr: string) => {
          try {
            return format(new Date(dateStr), "MMM d, yyyy");
          } catch {
            return dateStr || EMPTY_PLACEHOLDER;
          }
        };

        return (
          <div className="flex items-center gap-1.5 font-medium text-black">
            <span className="whitespace-nowrap">
              {formatDateStr(from_date)}
            </span>
            <span className="text-cool-gray shrink-0">→</span>
            <span className="whitespace-nowrap">{formatDateStr(to_date)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "locations",
      header: "Start Point → End Point",
      cell: ({ row }) => {
        const { from_location, to_location } = row.original;
        return (
          <div className="flex max-w-[280px] items-center gap-1.5 font-medium text-black">
            <TooltipWrapper content={from_location?.name || "N/A"}>
              <span className="max-w-[130px] truncate">
                {from_location?.name || EMPTY_PLACEHOLDER}
              </span>
            </TooltipWrapper>
            <span className="text-cool-gray shrink-0">→</span>
            <TooltipWrapper content={to_location?.name || "N/A"}>
              <span className="max-w-[130px] truncate">
                {to_location?.name || EMPTY_PLACEHOLDER}
              </span>
            </TooltipWrapper>
          </div>
        );
      },
    },
    {
      accessorKey: "vehicle_type",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex justify-start">
          <AppBadge
            type="PROJECT_CODE"
            className="bg-iced-lavender text-vivid-violet border-pale-purple font-medium capitalize"
          >
            {row.original.vehicle_type}
          </AppBadge>
        </div>
      ),
    },
    {
      accessorKey: "vehicle",
      header: "Vehicle",
      cell: ({ row }) => {
        const vehicle = row.original.vehicle?.toLowerCase();
        const iconName = vehicle === "car" ? "car_frontage.svg" : "bike.svg";

        return (
          <div className="flex items-center gap-2 capitalize">
            <img
              src={`${ASSET_PATH}/icons/${iconName}`}
              alt={vehicle}
              className="h-5 w-5"
            />
            <span className="font-medium text-black">
              {row.original.vehicle}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold text-black">
          ₹{formatToINR(Number(row.original.amount || 0))}
        </span>
      ),
    },
    {
      accessorKey: "distance",
      header: "Distance",
      cell: ({ row }) => (
        <span className="text-cool-gray font-medium">
          {parseFloat(row.original.distance || "0").toFixed(2)} km
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: () => {
        return (
          <AppBadge
            className={cn(
              "rounded-md border-none capitalize",
              MILEAGE_STATUS_STYLES[
                statusBadge.toLowerCase() as TRAVEL_EXPENSE_STATUS
              ],
            )}
          >
            {statusBadge}
          </AppBadge>
        );
      },
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => <TableActions onView={() => onView(row.original)} />,
    },
  );

  return columns;
};

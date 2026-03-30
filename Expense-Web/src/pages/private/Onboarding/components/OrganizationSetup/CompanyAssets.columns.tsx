import { Trash2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { startCase } from "lodash";

import { Button } from "@/components/ui/button";
import { ASSET_PATH } from "@/helpers/constants/common";

import TooltipWrapper from "@/components/common/TooltipWrapper";
import AddNewCompanyAssetSheet from "./AddNewCompanyAssetSheet";
import type { CompanyAssetItem } from "../../types/onboarding.types";

interface useCompanyAssetsTableColumnsProps {
  onDelete: (assetId: number) => void;
}

export const useCompanyAssetsTableColumns = ({
  onDelete,
}: useCompanyAssetsTableColumnsProps): ColumnDef<CompanyAssetItem>[] => [
  {
    accessorKey: "asset_code",
    header: "Name / ID",
  },
  {
    accessorKey: "vehicle_type",
    header: "Type",
    cell: ({ row }) =>
      row.original.category === "vehicle"
        ? startCase(row.original.vehicle_type)
        : startCase(row.original.generator_type),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => startCase(row.original.category),
  },
  {
    accessorKey: "make_model",
    header: "Make Model",
  },
  {
    accessorKey: "fuel_type",
    header: "Fuel Type",
    cell: ({ row }) => startCase(row.original.fuel_type),
  },
  {
    accessorKey: "operator",
    header: "Assigned To",
    cell: ({ row }) =>
      `${row.original.operator.first_name} ${row.original.operator.last_name}`,
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <TooltipWrapper content="Edit company asset">
            <AddNewCompanyAssetSheet companyAssetItem={row.original}>
              <button className="h-3.5 w-3.5 cursor-pointer">
                <img
                  src={`${ASSET_PATH}/icons/pencil-edit.svg`}
                  alt="View Icon"
                />
              </button>
            </AddNewCompanyAssetSheet>
          </TooltipWrapper>
          <TooltipWrapper content="Delete company asset">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-red-400"
              onClick={() => onDelete(row.original.id)}
            >
              <Trash2 className="h-3.5 w-3.5 cursor-pointer" />
            </Button>
          </TooltipWrapper>
        </div>
      );
    },
  },
];

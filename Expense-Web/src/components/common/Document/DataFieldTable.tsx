import { cn } from "@/lib/utils";
import { DataFieldTableItem } from "./DataFieldTableItem";
import { ASSET_PATH } from "@/helpers/constants/common";
import { EXTRACTED_DATA_TABLE_ITEM_COLORS } from "@/pages/private/Extraction/helpers/constants/extraction";

type DataFieldTableProps = {
  data: DataFieldTableData;
  fieldLabels: Record<string, string>;
  fieldWidths: Record<string, string>;
  handleUpdate: (key: string, index: number, newValue: string) => void;
  canEdit: boolean;
};

export const DataFieldTable: React.FC<DataFieldTableProps> = ({
  data,
  canEdit,
  fieldLabels,
  fieldWidths,
  handleUpdate,
}) => {
  return (
    <>
      {data.map((row, index) => {
        const bgColor =
          EXTRACTED_DATA_TABLE_ITEM_COLORS[
            index % EXTRACTED_DATA_TABLE_ITEM_COLORS.length
          ];
        return (
          <div key={index} className={cn("mb-4 rounded-xl", bgColor)}>
            <div className="flex items-center space-x-1 px-3 py-2">
              <img
                src={`${ASSET_PATH}/icons/bracket-circle.svg`}
                alt="open bracket"
                className="size-4"
              />
              <p className="text-sm font-semibold">Item {index + 1}</p>
            </div>
            <div className="scrollbar-thin shadow-item-card m-2 overflow-x-auto rounded-xl bg-white p-2">
              <table className="w-full">
                <thead>
                  <tr className="text-ash-gray border-b text-left text-xs font-semibold">
                    {Object.entries(fieldLabels).map(([k, v]) => (
                      <th key={k} className={cn("px-4 py-2", fieldWidths[k])}>
                        {v}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-xs">
                    {Object.keys(fieldLabels).map((key) => (
                      <DataFieldTableItem
                        key={key}
                        value={row[key]?.value}
                        confidence={row[key]?.confidence_score}
                        canEdit={canEdit}
                        handleUpdate={(newValue: string) =>
                          handleUpdate(key, index, newValue)
                        }
                      />
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </>
  );
};

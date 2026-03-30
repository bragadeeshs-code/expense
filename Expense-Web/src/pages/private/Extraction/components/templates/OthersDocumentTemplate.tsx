import React, { useEffect, useState } from "react";
import { isPlainObject, startCase } from "lodash";

import { DataField } from "@/components/common/Document/DataField";
import { getValue, setValue } from "../../lib/utils/extractionUtils";
import { DataFieldTable } from "@/components/common/Document/DataFieldTable";

type OthersDocumentTemplateProps = {
  data: GeneralResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => GeneralResponseData) => void;
};

const OthersDocumentTemplate: React.FC<OthersDocumentTemplateProps> = ({
  data,
  editingAllowed,
  setGetTransformedData,
}) => {
  const [formData, setFormData] = useState<GeneralResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleTableChange = (
    fullKey: string,
    key: string,
    index: number,
    newValue: string,
  ) => {
    const path = `${fullKey}.${index}.${key}`;
    setFormData((prev) => {
      const clone = structuredClone(prev);
      setValue(clone, path, newValue);
      return clone;
    });
  };

  const isRowTable = (arr: Array<object>) =>
    arr.length &&
    isPlainObject(arr[0]) &&
    !Object.prototype.hasOwnProperty.call(arr[0], "value");

  const renderFields = (data: GeneralResponseData | string, parentKey = "") => {
    return Object.entries(data).map(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key;

      if (Array.isArray(value)) {
        if (!value.length) return null;

        if (isRowTable(value)) {
          const columns = Object.keys(value[0]);

          return (
            <div key={fullKey} className="col-span-full">
              <p className="text-ash-gray mb-2 text-xs font-semibold">
                {startCase(key)}
              </p>

              <DataFieldTable
                fieldLabels={Object.fromEntries(
                  columns.map((col) => [col, startCase(col)]),
                )}
                fieldWidths={Object.fromEntries(
                  columns.map((col) => [col, "w-20"]),
                )}
                data={value.map((row) =>
                  Object.fromEntries(Object.entries(row)),
                )}
                canEdit={editingAllowed}
                handleUpdate={(key, index, newValue) =>
                  handleTableChange(fullKey, key, index, newValue)
                }
              />
            </div>
          );
        }

        return (
          <div key={fullKey} className="col-span-full space-y-2">
            <p className="text-ash-gray text-xs font-semibold">
              {startCase(key)}
            </p>

            {value.map((item, index) => {
              const itemKey = `${fullKey}.${index}`;

              if (
                isPlainObject(item) &&
                Object.prototype.hasOwnProperty.call(item, "value")
              ) {
                return (
                  <DataField
                    key={itemKey}
                    title={`Item ${index + 1}`}
                    data={getValue(formData, itemKey)}
                    canEdit={editingAllowed}
                    handleUpdate={(newValue) => {
                      setFormData((prev) => {
                        const clone = structuredClone(prev);
                        setValue(clone, itemKey, newValue);
                        return clone;
                      });
                    }}
                  />
                );
              }

              return null;
            })}
          </div>
        );
      }

      if (
        isPlainObject(value) &&
        Object.prototype.hasOwnProperty.call(value, "value")
      ) {
        return (
          <DataField
            key={fullKey}
            title={startCase(key)}
            data={getValue(formData, fullKey)}
            canEdit={editingAllowed}
            handleUpdate={(newValue) => {
              setFormData((prev) => {
                const clone = structuredClone(prev);
                setValue(clone, fullKey, newValue);
                return clone;
              });
            }}
          />
        );
      }

      if (isPlainObject(value)) {
        return (
          <React.Fragment key={fullKey}>
            {renderFields(value, fullKey)}
          </React.Fragment>
        );
      }

      return null;
    });
  };

  return (
    <div className="@container space-y-2">
      <div className="grid gap-4 @sm:grid-cols-2">{renderFields(formData)}</div>
    </div>
  );
};

export default OthersDocumentTemplate;

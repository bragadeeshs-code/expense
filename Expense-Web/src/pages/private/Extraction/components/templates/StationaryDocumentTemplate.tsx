import { produce } from "immer";
import React, { useEffect, useState } from "react";

import { setValue } from "../../lib/utils/extractionUtils";
import { DataField } from "@/components/common/Document/DataField";
import { DataFieldTable } from "@/components/common/Document/DataFieldTable";

type StationaryDocumentTemplateProps = {
  data: StationeryResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const StationaryDocumentTemplate: React.FC<StationaryDocumentTemplateProps> = ({
  data,
  editingAllowed,
  setGetTransformedData,
}) => {
  const [formData, setFormData] = useState<StationeryResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleTableChange = (key: string, index: number, newValue: string) => {
    setFormData((prev) => {
      const clone = structuredClone(prev);
      const path = `table_contents.${index}.${key}`;
      setValue(clone, path, newValue);
      return clone;
    });
  };

  return (
    <div className="@container space-y-2">
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Vendor Name"
          shouldTruncate
          data={formData.vendor_name}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.vendor_name.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Currency"
          data={formData.currency}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.currency.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>

      <DataFieldTable
        fieldLabels={{
          description: "Description",
          quantity: "Quantity",
          unit_price: "Amount",
        }}
        canEdit={editingAllowed}
        fieldWidths={{
          description: "min-w-50 w-50",
          quantity: "min-w-25 w-25",
          unit_price: "min-w-25 w-25",
        }}
        data={formData.table_contents}
        handleUpdate={handleTableChange}
      />
      <DataField
        title="Amount"
        className="flex-1"
        data={formData.grand_total_After_GST}
        handleUpdate={(newValue: string) => {
          setFormData((prev) => {
            return produce(prev, (draft) => {
              draft.grand_total_After_GST.value = newValue;
            });
          });
        }}
        canEdit={editingAllowed}
        formatAsINR
      />
    </div>
  );
};

export default StationaryDocumentTemplate;

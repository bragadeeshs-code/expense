import { produce } from "immer";
import { useEffect, useState } from "react";

import { DataField } from "@/components/common/Document/DataField";
import type { FuelGasResponseData } from "@/types/document-response.types";

type FuelGasDocumentTemplateProps = {
  data: FuelGasResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const FuelGasDocumentTemplate: React.FC<FuelGasDocumentTemplateProps> = ({
  data,
  editingAllowed,
  setGetTransformedData,
}) => {
  const [formData, setFormData] = useState<FuelGasResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <div className="@container space-y-2">
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Vendor Name"
          data={formData.vendor_name}
          className="flex-1"
          shouldTruncate
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
          title="GSTIN"
          data={formData.vendor_details.gstin}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.vendor_details.gstin.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Date"
          data={formData.date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Fuel type"
          data={formData.transaction_details.fuel_type}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.fuel_type.value = newValue;
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
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="GST"
          data={formData.total_gst}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.total_gst.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
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
    </div>
  );
};

export default FuelGasDocumentTemplate;

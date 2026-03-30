import { produce } from "immer";
import React, { useEffect, useState } from "react";

import { setValue } from "../../lib/utils/extractionUtils";
import { DataField } from "@/components/common/Document/DataField";

type AutoBikeTaxiDocumentTemplateProps = {
  data: AutoBikeTaxiResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const AutoBikeTaxiDocumentTemplate: React.FC<
  AutoBikeTaxiDocumentTemplateProps
> = ({ data, editingAllowed, setGetTransformedData }) => {
  const [formData, setFormData] = useState<AutoBikeTaxiResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <div className="@container space-y-2">
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Vehicle type"
          data={formData.mode_of_vehicle}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              const clone = structuredClone(prev);
              setValue(clone, "mode_of_vehicle", newValue);
              return clone;
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Kilometers traveled"
          data={formData.kilometer_traveled}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.kilometer_traveled.value = newValue;
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
          title="Start location"
          data={formData.start_point}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.start_point.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="End location"
          data={formData.end_point}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.end_point.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Start date"
          data={formData.start_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.start_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="End date"
          data={formData.end_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.end_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>

      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="GST"
          data={formData.tax_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
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

export default AutoBikeTaxiDocumentTemplate;

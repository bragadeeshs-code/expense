import { produce } from "immer";
import React, { useEffect, useState } from "react";

import { setValue } from "../../lib/utils/extractionUtils";
import { DataField } from "@/components/common/Document/DataField";
import { DataFieldTable } from "@/components/common/Document/DataFieldTable";

type TrainDocumentTemplateProps = {
  data: TrainResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const TrainDocumentTemplate: React.FC<TrainDocumentTemplateProps> = ({
  data,
  editingAllowed,
  setGetTransformedData,
}) => {
  const [formData, setFormData] = useState<TrainResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleTableChange = (key: string, index: number, newValue: string) => {
    setFormData((prev) => {
      const clone = structuredClone(prev);
      const path = `passenger_details.${index}.${key}`;
      setValue(clone, path, newValue);
      return clone;
    });
  };

  return (
    <div className="@container space-y-2">
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Vendor name"
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
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Train Name"
          data={formData.transaction_details.train_name}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.train_name.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Train number"
          data={formData.transaction_details.train_number}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.train_number.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="PNR number"
          data={formData.transaction_details.pnr_number}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.pnr_number.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Class"
          data={formData.transaction_details.class}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.class.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>

      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Departure"
          data={formData.transaction_details.departure_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.departure_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Boarding"
          data={formData.transaction_details.from_station}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.from_station.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Destination"
          data={formData.transaction_details.to_station}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.to_station.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <DataFieldTable
        fieldLabels={{
          passenger_name: "Passenger name",
          project_id: "Purpose / Project ID",
        }}
        canEdit={editingAllowed}
        fieldWidths={{
          passenger_name: "min-w-70 w-70",
          project_id: "min-w-30 w-30",
        }}
        data={formData.passenger_details}
        handleUpdate={handleTableChange}
      />

      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST percent"
          data={formData.taxes.sgst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.taxes.sgst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="CGST percent"
          data={formData.taxes.cgst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.taxes.cgst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="IGST percent"
          data={formData.taxes.igst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.taxes.igst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST amount"
          data={formData.taxes.sgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.taxes.sgst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="CGST amount"
          data={formData.taxes.cgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.taxes.cgst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="IGST amount"
          data={formData.taxes.igst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.taxes.igst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
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
        />
        <DataField
          title="Amount"
          data={formData.grand_total_After_GST}
          className="flex-1"
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

export default TrainDocumentTemplate;

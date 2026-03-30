import { produce } from "immer";
import React, { useEffect, useState } from "react";

import { setValue } from "../../lib/utils/extractionUtils";
import { DataField } from "@/components/common/Document/DataField";
import { DataFieldTable } from "@/components/common/Document/DataFieldTable";

type FlightInvoiceDocumentTemplateProps = {
  data: FlightInvoiceResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const FlightInvoiceDocumentTemplate: React.FC<
  FlightInvoiceDocumentTemplateProps
> = ({ data, editingAllowed, setGetTransformedData }) => {
  const [formData, setFormData] = useState<FlightInvoiceResponseData>(data);

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
          title="Booking platform"
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
          title="Booking reference"
          data={formData.reference_number}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.reference_number.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Passenger name"
          data={formData.passenger_name}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.passenger_name.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Purpose"
          data={formData.purpose_of_trip}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.purpose_of_trip.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <DataField
        title="Currency"
        data={formData.currency}
        handleUpdate={(newValue: string) => {
          setFormData((prev) => {
            return produce(prev, (draft) => {
              draft.currency.value = newValue;
            });
          });
        }}
        canEdit={editingAllowed}
      />
      <DataFieldTable
        fieldLabels={{
          pnr_number: "Passenger PNR number",
          flight_number: "Flight number",
          departure_date: "Departure date",
          arrival_date: "Arrival date",
          sector: "Sector",
          class: "Class",
        }}
        canEdit={editingAllowed}
        fieldWidths={{
          pnr_number: "min-w-70 w-70",
          flight_number: "min-w-40 w-40",
          departure_date: "min-w-30 w-30",
          arrival_date: "min-w-30 w-30",
          sector: "min-w-30 w-30",
          class: "min-w-30 w-30",
        }}
        data={formData.table_contents}
        handleUpdate={handleTableChange}
      />

      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST percent"
          data={formData.sgst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.sgst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="CGST percent"
          data={formData.cgst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.cgst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="IGST percent"
          data={formData.igst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.igst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST amount"
          data={formData.sgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.sgst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="CGST amount"
          data={formData.cgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.cgst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="IGST amount"
          data={formData.igst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.igst_amount.value = newValue;
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

export default FlightInvoiceDocumentTemplate;

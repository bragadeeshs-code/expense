import React, { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { DataField } from "@/components/common/Document/DataField";
import { DataFieldTable } from "@/components/common/Document/DataFieldTable";
import { setValue } from "../../lib/utils/extractionUtils";
import { produce } from "immer";

type FlightReceiptDocumentTemplateProps = {
  data: FlightReceiptResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const FlightReceiptDocumentTemplate: React.FC<
  FlightReceiptDocumentTemplateProps
> = ({ data, editingAllowed, setGetTransformedData }) => {
  const [formData, setFormData] = useState<FlightReceiptResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleTableChange = (
    key: string,
    index: number,
    newValue: string,
    table: string,
  ) => {
    setFormData((prev) => {
      const clone = structuredClone(prev);
      const path = `${table}.${index}.${key}`;
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
          data={formData.booking_details.booking_ref_no}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.booking_details.booking_ref_no.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Purpose"
          className="flex-1"
          data={formData.booking_details.purpose_of_travel}
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.booking_details.purpose_of_travel.value = newValue;
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
      <Label className="text-ash-gray py-2">Passenger details</Label>
      <DataFieldTable
        fieldLabels={{
          passenger_name: "Name",
        }}
        canEdit={editingAllowed}
        fieldWidths={{
          passenger_name: "min-w-50 w-50",
        }}
        data={formData.passenger_details}
        handleUpdate={(key, index, newValue) => {
          handleTableChange(key, index, newValue, "passenger_details");
        }}
      />
      <Label className="text-ash-gray py-2">Flight details</Label>
      <DataFieldTable
        fieldLabels={{
          airline_name: "Airline name",
          airline_pnr: "PNR number",
          flight_number: "Flight number",
          departure_date: "Departure date",
          from_airport: "Departure city",
          to_airport: "Arrival city",
          class: "Class",
        }}
        canEdit={editingAllowed}
        fieldWidths={{
          airline_name: "min-w-50 w-50",
          airline_pnr: "min-w-50 w-50",
          flight_number: "min-w-40 w-40",
          departure_date: "min-w-40 w-40",
          from_airport: "min-w-50 w-50",
          to_airport: "min-w-50 w-50",
          class: "min-w-30 w-30",
        }}
        data={formData.flight_segments}
        handleUpdate={(key, index, newValue) => {
          handleTableChange(key, index, newValue, "flight_segments");
        }}
      />
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

export default FlightReceiptDocumentTemplate;

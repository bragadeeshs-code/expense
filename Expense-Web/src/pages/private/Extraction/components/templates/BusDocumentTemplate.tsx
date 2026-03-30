import { produce } from "immer";
import React, { useEffect, useState } from "react";

import { setValue } from "../../lib/utils/extractionUtils";
import { DataField } from "@/components/common/Document/DataField";
import { DataFieldTable } from "@/components/common/Document/DataFieldTable";

type BusDocumentTemplateProps = {
  data: BusResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const BusDocumentTemplate: React.FC<BusDocumentTemplateProps> = ({
  data,
  editingAllowed,
  setGetTransformedData,
}) => {
  const [formData, setFormData] = useState<BusResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const handleTableChange = (key: string, index: number, newValue: string) => {
    setFormData((prev) => {
      return produce(prev, (draft) => {
        const path = `passenger_Details.${index}.${key}`;
        setValue(draft, path, newValue);
      });
    });
  };

  return (
    <div className="@container space-y-2">
      <DataField
        title="Travels Name"
        data={formData.Ticket_Details.travels_name}
        handleUpdate={(newValue: string) => {
          setFormData((prev) => {
            return produce(prev, (draft) => {
              draft.Ticket_Details.travels_name.value = newValue;
            });
          });
        }}
        canEdit={editingAllowed}
      />
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Booking platform"
          data={formData.booking_platform}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.booking_platform.value = newValue;
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
          title="Boarding date"
          data={formData.Boarding_Point_Details.boarding_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.Boarding_Point_Details.boarding_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Boarding time"
          data={formData.Boarding_Point_Details.boarding_time}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.Boarding_Point_Details.boarding_time.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <DataField
        title="Boarding Address"
        data={formData.Boarding_Point_Details.boarding_address}
        handleUpdate={(newValue: string) => {
          setFormData((prev) => {
            return produce(prev, (draft) => {
              draft.Boarding_Point_Details.boarding_address.value = newValue;
            });
          });
        }}
        canEdit={editingAllowed}
      />
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Dropping date"
          data={formData.Dropping_Point_Details.dropping_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.Dropping_Point_Details.dropping_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Dropping time"
          data={formData.Dropping_Point_Details.dropping_time}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.Dropping_Point_Details.dropping_time.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <DataField
        title="Dropping Address"
        data={formData.Dropping_Point_Details.dropping_address}
        handleUpdate={(newValue: string) => {
          setFormData((prev) => {
            return produce(prev, (draft) => {
              draft.Dropping_Point_Details.dropping_address.value = newValue;
            });
          });
        }}
        canEdit={editingAllowed}
      />
      <DataFieldTable
        fieldLabels={{
          name: "Passenger name",
          seat_number: "Seat number",
        }}
        canEdit={editingAllowed}
        fieldWidths={{
          name: "min-w-70 w-70",
          seat_number: "min-w-30 w-30",
        }}
        data={formData.Passenger_Details}
        handleUpdate={handleTableChange}
      />
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="GST"
          className="flex-1"
          data={formData.total_gst}
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
          formatAsINR
          canEdit={editingAllowed}
        />
      </div>
    </div>
  );
};

export default BusDocumentTemplate;

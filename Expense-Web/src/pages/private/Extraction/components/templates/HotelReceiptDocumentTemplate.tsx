import { produce } from "immer";
import React, { useEffect, useState } from "react";

import { DataField } from "@/components/common/Document/DataField";

type HotelReceiptDocumentTemplateProps = {
  data: HotelReceiptResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const HotelReceiptDocumentTemplate: React.FC<
  HotelReceiptDocumentTemplateProps
> = ({ data, editingAllowed, setGetTransformedData }) => {
  const [formData, setFormData] = useState<HotelReceiptResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <div className="@container space-y-2">
      <DataField
        title="Hotel Name"
        data={formData.vendor_name}
        handleUpdate={(newValue: string) => {
          setFormData((prev) => {
            return produce(prev, (draft) => {
              draft.vendor_name.value = newValue;
            });
          });
        }}
        canEdit={editingAllowed}
      />
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="GSTIN of Hotel"
          data={formData.hotel_details.gst_number}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.hotel_details.gst_number.value = newValue;
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
          title="Check In"
          data={formData.booking_details.arrival_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.booking_details.arrival_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Check Out"
          data={formData.booking_details.departure_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.booking_details.departure_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="No of nights"
          data={formData.booking_details.number_of_nights}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.booking_details.number_of_nights.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Room type"
          data={formData.booking_details.room_type}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.booking_details.room_type.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Service charges"
          data={formData.transaction_details.service_charges}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.service_charges.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
      </div>

      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST amount"
          data={formData.transaction_details.tax_details.sgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.tax_details.sgst_amount.value =
                  newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="CGST amount"
          data={formData.transaction_details.tax_details.cgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.tax_details.cgst_amount.value =
                  newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="IGST amount"
          data={formData.transaction_details.tax_details.igst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.transaction_details.tax_details.igst_amount.value =
                  newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
      </div>

      <DataField
        title="Amount"
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

export default HotelReceiptDocumentTemplate;

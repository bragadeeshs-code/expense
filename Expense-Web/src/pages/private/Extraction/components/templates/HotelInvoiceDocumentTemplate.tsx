import { produce } from "immer";
import React, { useEffect, useState } from "react";

import { DataField } from "@/components/common/Document/DataField";

type HotelInvoiceDocumentTemplateProps = {
  data: HotelInvoiceResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const HotelInvoiceDocumentTemplate: React.FC<
  HotelInvoiceDocumentTemplateProps
> = ({ data, editingAllowed, setGetTransformedData }) => {
  const [formData, setFormData] = useState<HotelInvoiceResponseData>(data);

  useEffect(() => {
    setGetTransformedData(() => ({ ...formData }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <div className="@container space-y-2">
      <DataField
        title="Hotel Name"
        data={formData.hotel_details.hotel_name}
        handleUpdate={(newValue: string) => {
          setFormData((prev) => {
            return produce(prev, (draft) => {
              draft.hotel_details.hotel_name.value = newValue;
            });
          });
        }}
        canEdit={editingAllowed}
      />
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="GSTIN of Hotel"
          data={formData.hotel_details.hotel_gstin}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.hotel_details.hotel_gstin.value = newValue;
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
          data={formData.invoice_details.check_in_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.invoice_details.check_in_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="Check Out"
          data={formData.invoice_details.check_out_date}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.invoice_details.check_out_date.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="No of nights"
          data={formData.invoice_details.number_of_nights}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.invoice_details.number_of_nights.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>

      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST amount"
          data={formData.tax_summary.sgst_total}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_summary.sgst_total.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="CGST amount"
          data={formData.tax_summary.cgst_total}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_summary.cgst_total.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="IGST amount"
          data={formData.tax_summary.igst_total}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_summary.igst_total.value = newValue;
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

export default HotelInvoiceDocumentTemplate;

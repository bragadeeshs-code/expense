import { produce } from "immer";
import { useEffect, useState } from "react";

import { setValue } from "../../lib/utils/extractionUtils";
import { DataField } from "@/components/common/Document/DataField";
import { DataFieldTable } from "@/components/common/Document/DataFieldTable";

type MealsFoodDocumentTemplateProps = {
  data: MealFoodResponseData;
  editingAllowed: boolean;
  setGetTransformedData: (fn: () => Record<string, unknown>) => void;
};

const MealsFoodDocumentTemplate: React.FC<MealsFoodDocumentTemplateProps> = ({
  data,
  editingAllowed,
  setGetTransformedData,
}) => {
  const [formData, setFormData] = useState<MealFoodResponseData>(data);

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
          title="GSTIN"
          data={formData.supplier_details.gstin}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.supplier_details.gstin.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Date"
          data={formData.billing_details.date_of_issue}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.billing_details.date_of_issue.value = newValue;
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
        data={formData.table_contents}
        fieldLabels={{
          description: "Item",
          quantity: "Quantity",
          unit_price: "Price",
          amount: "Total",
        }}
        canEdit={editingAllowed}
        fieldWidths={{
          description: "min-w-70 w-70",
          quantity: "min-w-30 w-30",
          unit_price: "min-w-30 w-30",
          amount: "min-w-30 w-30",
        }}
        handleUpdate={handleTableChange}
      />
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST percent"
          data={formData.tax_details.sgst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_details.sgst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="CGST percent"
          data={formData.tax_details.cgst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_details.cgst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
        <DataField
          title="IGST percent"
          data={formData.tax_details.igst_percent}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_details.igst_percent.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="SGST amount"
          data={formData.tax_details.sgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_details.sgst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="CGST amount"
          data={formData.tax_details.cgst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_details.cgst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
        <DataField
          title="IGST amount"
          data={formData.tax_details.igst_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_details.igst_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
        />
      </div>
      <div className="flex flex-col @sm:flex-row">
        <DataField
          title="Tax amount"
          data={formData.tax_details.tax_amount}
          className="flex-1"
          handleUpdate={(newValue: string) => {
            setFormData((prev) => {
              return produce(prev, (draft) => {
                draft.tax_details.tax_amount.value = newValue;
              });
            });
          }}
          canEdit={editingAllowed}
          formatAsINR
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

export default MealsFoodDocumentTemplate;

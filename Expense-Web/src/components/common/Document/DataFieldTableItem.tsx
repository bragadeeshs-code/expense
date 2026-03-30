import React, { useState } from "react";
import { FaCircle } from "react-icons/fa6";

import { Input } from "@/components/ui/input";

import { cn, getConfidenceTextColor } from "@/lib/utils";
import { EMPTY_PLACEHOLDER } from "@/helpers/constants/common";
import { isNil } from "lodash";

type DataFieldTableItemProps = {
  value: string | number | boolean | null;
  canEdit: boolean;
  confidence: number | null;
  handleUpdate: (newValue: string) => void;
};

export const DataFieldTableItem: React.FC<DataFieldTableItemProps> = ({
  value,
  canEdit,
  confidence,
  handleUpdate,
}) => {
  const rawValue = value?.toString() ?? "";
  const [inputValue, setInputValue] = useState<string>(rawValue);

  const isEditable = canEdit && confidence !== null && confidence <= 75;

  return (
    <td className="px-4 py-2">
      <div className="flex items-center pb-2">
        {isEditable ? (
          <Input
            value={inputValue}
            onBlur={() => {
              if (inputValue) {
                handleUpdate(inputValue);
              } else {
                setInputValue(rawValue);
              }
            }}
            inputWrapperClassName="flex-1"
            onChange={(e) => setInputValue(e.target.value)}
            className="rounded-none border-0 p-0! text-sm font-medium text-black shadow-none focus-visible:ring-0"
          />
        ) : (
          <p className={cn("flex-1 text-sm font-medium text-black")}>
            {value ?? EMPTY_PLACEHOLDER}
          </p>
        )}
        {!isNil(confidence) && rawValue && (
          <FaCircle
            className={cn("size-2", getConfidenceTextColor(confidence))}
          />
        )}
      </div>
    </td>
  );
};

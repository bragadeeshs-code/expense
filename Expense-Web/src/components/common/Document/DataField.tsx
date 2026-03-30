import { isNil } from "lodash";
import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { cn, formatToINR } from "@/lib/utils";
import { EMPTY_PLACEHOLDER } from "@/helpers/constants/common";
import type { ConfidenceRatedValue } from "@/types/document-response.types";

import Confidence from "./Confidence";
import TruncatedTextWithTooltip from "../TruncatedTextWithTooltip";

type DataFieldProps = {
  title: string;
  data: ConfidenceRatedValue;
  canEdit: boolean;
  className?: string;
  shouldTruncate?: boolean;
  formatAsINR?: boolean;
  handleUpdate: (newValue: string) => void;
  dataClassName?: string;
};

export const DataField: React.FC<DataFieldProps> = ({
  title,
  data,
  canEdit,
  className,
  shouldTruncate = false,
  formatAsINR = false,
  handleUpdate,
  dataClassName,
}) => {
  const rawValue = data?.value?.toString() ?? "";
  const formattedValue =
    formatAsINR && rawValue ? formatToINR(Number(rawValue)) : rawValue;

  const [inputValue, setInputValue] = useState<string>(rawValue);

  const isEditable =
    canEdit && data?.confidence_score !== null && data?.confidence_score <= 75;

  return (
    <div className={cn("p-2", shouldTruncate && "min-w-0", className)}>
      <div
        className={cn(
          "text-ash-gray flex justify-between text-xs font-semibold",
          !isEditable && "mb-2",
        )}
      >
        {title}
      </div>
      <div
        className={cn(
          "flex items-center justify-between gap-1 border-b",
          !isEditable && "pb-2",
          isEditable && "hover:border-primary",
        )}
      >
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
            onChange={(event) => setInputValue(event.target.value)}
            className="rounded-none border-0 p-0! text-sm font-medium text-black"
          />
        ) : shouldTruncate ? (
          <TruncatedTextWithTooltip
            text={formattedValue || EMPTY_PLACEHOLDER}
            className={cn("text-sm", dataClassName)}
          />
        ) : (
          <p
            className={cn(
              "text-sm font-medium break-all text-black",
              dataClassName,
            )}
          >
            {formattedValue || EMPTY_PLACEHOLDER}
          </p>
        )}
        {!isNil(data?.confidence_score) && rawValue && (
          <Confidence value={data?.confidence_score} />
        )}
      </div>
    </div>
  );
};

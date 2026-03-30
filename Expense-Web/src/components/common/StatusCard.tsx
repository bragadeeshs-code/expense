import React from "react";
import CountUp from "react-countup";

import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  imgUrl?: string;
  description?: string;
  className?: string;
  primaryValue: number | string;
  descriptionValue?: number | string;
  isPrimaryValueAmount?: boolean;
  primaryValueClassName?: string;
  valuePrefix?: string;
  valueSuffix?: string;
  valueDecimals?: number;
  descriptionValuePrefix?: string;
  descriptionValueSuffix?: string;
  descriptionValueDecimals?: number;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  imgUrl,
  className,
  description,
  primaryValue,
  descriptionValue,
  isPrimaryValueAmount = true,
  primaryValueClassName,
  valuePrefix,
  valueSuffix,
  valueDecimals,
  descriptionValuePrefix,
  descriptionValueSuffix,
  descriptionValueDecimals,
}) => {
  const numericPrimaryValue = Number(primaryValue ?? 0);
  const numericDescriptionValue =
    descriptionValue === undefined || descriptionValue === null
      ? undefined
      : Number(descriptionValue);
  const resolvedValuePrefix = valuePrefix ?? (isPrimaryValueAmount ? "₹" : "");
  const resolvedValueDecimals = valueDecimals ?? (isPrimaryValueAmount ? 2 : 0);

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-4 rounded-2xl border p-6",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium text-black">{title}</h3>
        {imgUrl && <img src={imgUrl} alt="icon" />}
      </div>
      <div className="flex flex-col">
        <span className={cn("text-[32px] font-medium", primaryValueClassName)}>
          <CountUp
            start={0}
            end={numericPrimaryValue}
            duration={1}
            decimals={resolvedValueDecimals}
            prefix={resolvedValuePrefix}
            suffix={valueSuffix}
          />
        </span>
        {numericDescriptionValue !== undefined && (
          <div className="text-steel-gray pt-4 text-xs font-normal">
            <CountUp
              start={0}
              end={numericDescriptionValue}
              duration={1}
              decimals={descriptionValueDecimals ?? 0}
              prefix={descriptionValuePrefix}
              suffix={descriptionValueSuffix}
            />{" "}
            {description}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusCard;

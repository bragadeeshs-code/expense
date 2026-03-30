import { Controller, type Control } from "react-hook-form";

import type { MileageExpenseFormValues } from "@/pages/private/MileageCalculator/zod-schema/mileageSchema";

import DatePicker from "@/components/common/DatePicker";

interface DateRangeSectionProps {
  control: Control<MileageExpenseFormValues>;
}

const DateRangeSection: React.FC<DateRangeSectionProps> = ({ control }) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
      <Controller
        name="from_date"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <label className="text-deep-charcoal text-sm font-semibold">
              From Date
            </label>
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date"
              buttonClassName="h-11 w-full"
              disabledDates={(date) => date > new Date()}
              isInvalid={fieldState.invalid}
            />
            {fieldState.error && (
              <p className="text-destructive text-xs">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />

      <Controller
        name="to_date"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col gap-2">
            <label className="text-deep-charcoal text-sm font-semibold">
              To Date
            </label>
            <DatePicker
              value={field.value}
              onChange={field.onChange}
              placeholder="Pick a date"
              buttonClassName="h-11 w-full"
              disabledDates={(date) => date > new Date()}
              isInvalid={fieldState.invalid}
            />
            {fieldState.error && (
              <p className="text-destructive text-xs">
                {fieldState.error.message}
              </p>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default DateRangeSection;

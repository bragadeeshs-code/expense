import { format } from "date-fns";
import { useState } from "react";
import { CalendarDays } from "lucide-react";

import { cn } from "@/lib/utils";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import type { DatePickerProps } from "@/types/common.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  showIcon = true,
  className,
  isInvalid,
  placeholder = "Select date",
  buttonClassName,
  onChange,
  disabledDates,
  placeholderClassName,
  disabled,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleSelect = (date?: Date) => {
    onChange?.(date);
    setOpen(false);
  };

  return (
    <Field className={className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "border-silver-gray justify-start rounded-md bg-white font-normal",
              !value && "text-muted-foreground",
              isInvalid && "border-destructive",
              buttonClassName,
            )}
          >
            {showIcon && <CalendarDays className="mr-2 h-4 w-4" />}
            {value instanceof Date ? (
              format(value, "PPP")
            ) : (
              <span className={placeholderClassName}>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={value || undefined}
            defaultMonth={value || undefined}
            onSelect={handleSelect}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
};

export default DatePicker;

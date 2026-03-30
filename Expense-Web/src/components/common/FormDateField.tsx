import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { cn } from "@/lib/utils";

import DatePicker from "./DatePicker";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface FormDateFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  placeholder?: string;
  fieldClassName?: string;
  labelClassName?: string;
  isRequired?: boolean;
  placeholderClassName?: string;
}

const FormDateField = <T extends FieldValues>({
  name,
  label,
  control,
  isRequired = false,
  placeholder = "Pick a date",
  fieldClassName,
  labelClassName,
  placeholderClassName,
}: FormDateFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState?.invalid}
          className={cn("gap-1", fieldClassName)}
        >
          {label && (
            <FieldLabel
              htmlFor={name}
              className={cn(
                "text-deep-charcoal text-sm font-semibold",
                labelClassName,
              )}
            >
              {label}
              {isRequired && <span className="text-destructive">*</span>}
            </FieldLabel>
          )}

          <DatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder={placeholder}
            buttonClassName={cn(
              "h-9 w-full border-silver-gray",
              fieldClassName,
            )}
            isInvalid={fieldState.invalid}
            placeholderClassName={placeholderClassName}
          />
          {fieldState?.invalid && <FieldError errors={[fieldState?.error]} />}
        </Field>
      )}
    />
  );
};
export default FormDateField;

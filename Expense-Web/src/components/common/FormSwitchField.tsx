import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface FormSwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  labelClassName?: string;
  fieldClassName?: string;
}

export function FormSwitchField<T extends FieldValues>({
  control,
  name,
  label,
  fieldClassName,
  labelClassName,
}: FormSwitchFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState?.invalid}
          className={cn("gap-1", fieldClassName)}
        >
          <div className="flex items-center justify-between">
            {label && (
              <FieldLabel
                htmlFor={name}
                className={cn(
                  "text-deep-charcoal text-sm font-semibold",
                  labelClassName,
                )}
              >
                {label}
              </FieldLabel>
            )}

            <Switch
              checked={field.value}
              onCheckedChange={field.onChange}
              className="h-6 w-10 cursor-pointer"
              thumbClassName="h-5 w-5 cursor-pointer"
            />
          </div>
          {fieldState?.invalid && <FieldError errors={[fieldState?.error]} />}
        </Field>
      )}
    />
  );
}

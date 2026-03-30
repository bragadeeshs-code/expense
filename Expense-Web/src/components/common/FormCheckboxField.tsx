import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";

interface FormCheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  className?: string;
  disabled?: boolean;
}

const FormCheckboxField = <T extends FieldValues>({
  control,
  name,
  label,
  className,
  disabled,
}: FormCheckboxFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, name }, fieldState }) => (
        <div className={cn("flex items-center gap-2", className)}>
          <Checkbox
            id={name}
            checked={Boolean(value)}
            disabled={disabled}
            onCheckedChange={(checked) => onChange(Boolean(checked))}
            className="h-4 w-4 rounded-[4px]"
          />

          <label
            htmlFor={name}
            className="cursor-pointer text-sm font-medium text-black"
          >
            {label}
          </label>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </div>
      )}
    />
  );
};

export default FormCheckboxField;

import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface FormTextAreaFieldProps<
  T extends FieldValues,
> extends React.ComponentProps<"textarea"> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  labelClassName?: string;
  fieldClassName?: string;
}

const FormTextAreaField = <T extends FieldValues>({
  control,
  label,
  className,
  labelClassName,
  fieldClassName,
  name,
  ...props
}: FormTextAreaFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field
          data-invalid={fieldState.invalid}
          className={cn("gap-1", fieldClassName)}
        >
          {label && (
            <FieldLabel
              htmlFor={field.name}
              className={cn(
                "text-ash-gray text-xs leading-[100%] font-medium tracking-[0%]",
                labelClassName,
              )}
            >
              {label}
            </FieldLabel>
          )}
          <Textarea
            {...field}
            {...props}
            id={field.name}
            aria-invalid={fieldState.invalid}
            className={cn(
              "border-silver-gray placeholder:text-slate-whisper rounded-[0.375rem] px-2.5 py-1.5 text-black",
              className,
            )}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default FormTextAreaField;

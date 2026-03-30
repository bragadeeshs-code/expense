import {
  type Path,
  Controller,
  type Control,
  type FieldValues,
  type ControllerRenderProps,
} from "react-hook-form";

import { Input } from "../ui/input";
import { cn, formatToINR } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";

const inputVariants = cva("text-black", {
  variants: {
    variant: {
      default:
        "border-silver-gray px-2.5 py-1.5 placeholder:text-slate-whisper rounded-[0.375rem]",
      inline:
        "rounded-none border-0 border-b border-slate-whisper px-0 py-[0.563rem] text-sm leading-[100%] font-medium tracking-[0%] shadow-none focus-visible:ring-0",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const labelVariants = cva(
  "text-xs leading-[100%] tracking-[0%] text-ash-gray",
  {
    variants: {
      variant: {
        default: "font-medium",
        inline: "font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface FormInputFieldProps<T extends FieldValues>
  extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  startAddon?: React.ReactNode;
  endAddon?: React.ReactNode;
  formatAsINR?: boolean;
  labelClassName?: string;
  fieldClassName?: string;
  isAddon?: boolean;
  isRequired?: boolean;
  labelVariant?: VariantProps<typeof labelVariants>["variant"];
  renderInput?: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
}

const FormInputField = <T extends FieldValues>({
  control,
  label,
  className,
  endAddon,
  startAddon,
  formatAsINR = false,
  labelClassName,
  fieldClassName,
  isAddon,
  variant,
  labelVariant,
  name,
  renderInput,
  isRequired = false,
  ...props
}: FormInputFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { value, name, onChange, ...rest } = field;
        const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
          if (formatAsINR) {
            const raw = Number(event.target.value.replace(/,/g, ""));
            onChange(raw);
          } else {
            onChange(event);
          }
        };

        const displayValue =
          formatAsINR && typeof value === "number"
            ? formatToINR(value)
            : (value ?? "");

        return (
          <Field
            data-invalid={fieldState.invalid}
            className={cn("gap-1", fieldClassName)}
          >
            {label && (
              <FieldLabel
                htmlFor={name}
                className={cn(
                  labelVariants({
                    variant: labelVariant,
                    className: labelClassName,
                  }),
                )}
              >
                {label}
                {isRequired && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}
            {renderInput ? (
              renderInput(field)
            ) : (
              <Input
                {...rest}
                {...props}
                id={name}
                aria-invalid={fieldState.invalid}
                className={cn(
                  inputVariants({ variant, className }),
                  isAddon &&
                    "rounded-none border-0 shadow-none focus-visible:ring-0",
                )}
                value={displayValue}
                onChange={handleChange}
                contentBefore={startAddon && startAddon}
                contentAfter={endAddon && endAddon}
                inputWrapperClassName={cn(
                  "flex items-stretch overflow-hidden",
                  isAddon &&
                    "focus-within:border-primary/50 focus-within:ring-ring/20 dark:bg-input/30 w-full rounded-md border bg-transparent",
                )}
                contentAfterContainerClassName={cn(isAddon && "border-s px-2")}
              />
            )}
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default FormInputField;

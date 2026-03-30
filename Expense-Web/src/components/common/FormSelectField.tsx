import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import type { Props as ReactSelectProps, GroupBase } from "react-select";
import SelectField from "./SelectField";

interface FormSelectFieldProps<
  T extends FieldValues,
  Option,
  IsMulti extends boolean = false,
> extends ReactSelectProps<Option, IsMulti, GroupBase<Option>> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  fieldClassName?: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  hideDropdownIcon?: boolean;
  placeholderClassName?: string;
  isRequired?: boolean;
}

const FormSelectField = <
  T extends FieldValues,
  Option,
  IsMulti extends boolean = true,
>({
  control,
  name,
  label,
  placeholder = "Select an option",
  labelClassName,
  fieldClassName,
  className,
  disabled,
  options,
  hideDropdownIcon = false,
  placeholderClassName,
  isRequired = false,
  ...selectProps
}: FormSelectFieldProps<T, Option, IsMulti>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <SelectField
          fieldClassName={fieldClassName}
          label={label}
          labelClassName={labelClassName}
          isRequired={isRequired}
          disabled={disabled}
          placeholder={placeholder}
          options={options}
          value={field.value}
          onChange={field.onChange}
          unstyled
          fieldState={fieldState}
          placeholderClassName={placeholderClassName}
          className={className}
          hideDropdownIcon={hideDropdownIcon}
          {...selectProps}
        />
      )}
    />
  );
};

export default FormSelectField;

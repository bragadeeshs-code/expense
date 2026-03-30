import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import MultiSelectDropdown from "./MultiSelectDropdown";

interface FormMultiSelectFieldProps<T extends FieldValues, TOption> {
  control: Control<T>;
  name: Path<T>;
  search?: string;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
  hideDropdownIcon?: boolean;
  options: TOption[];
  getLabel: (option: TOption) => string;
  getValue: (option: TOption) => string;
  placeholderText?: string;
  disabled?: boolean;
  isRequired?: boolean;
  label?: string;
  labelClassName?: string;
  placeHolderClassName?: string;
}

const FormMultiSelectField = <T extends FieldValues, TOption>({
  control,
  name,
  search,
  onSearchChange,
  isLoading,
  options,
  getLabel,
  getValue,
  label,
  labelClassName,
  placeHolderClassName,
  placeholderText = "Select...",
  disabled = false,
  isRequired = false,
  hideDropdownIcon = false,
}: FormMultiSelectFieldProps<T, TOption>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <MultiSelectDropdown<TOption>
          options={options}
          search={search}
          onSearchChange={onSearchChange}
          isLoading={isLoading}
          label={label}
          labelClassName={labelClassName}
          placeHolderClassName={placeHolderClassName}
          placeholderText={placeholderText}
          disabled={disabled}
          isRequired={isRequired}
          hideDropdownIcon={hideDropdownIcon}
          value={field.value ?? []}
          onChange={field.onChange}
          getLabel={getLabel}
          getValue={getValue}
        />
      )}
    />
  );
};

export default FormMultiSelectField;

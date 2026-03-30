import type { Props as ReactSelectProps, GroupBase } from "react-select";
import Select from "react-select";
import type { ControllerFieldState } from "react-hook-form";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { ASSET_PATH } from "@/helpers/constants/common";
interface SelectFieldProps<
  Option,
  IsMulti extends boolean = false,
> extends ReactSelectProps<Option, IsMulti, GroupBase<Option>> {
  label?: string;
  fieldClassName?: string;
  placeholder?: string;
  labelClassName?: string;
  className?: string;
  disabled?: boolean;
  hideDropdownIcon?: boolean;
  placeholderClassName?: string;
  isRequired?: boolean;
  fieldState?: ControllerFieldState;
}

const SelectField = <Option, IsMulti extends boolean = true>({
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
  value,
  onChange,
  isRequired = false,
  fieldState,
  components,
  ...selectProps
}: SelectFieldProps<Option, IsMulti>) => {
  return (
    <Field
      data-invalid={fieldState?.invalid}
      className={cn("gap-1", fieldClassName)}
    >
      {label && (
        <FieldLabel
          htmlFor={name}
          className={cn(
            "text-ash-gray text-xs leading-[100%] font-medium tracking-[0%]",
            labelClassName,
          )}
        >
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <Select
        isDisabled={disabled}
        placeholder={
          <div className={cn("font-normal", placeholderClassName)}>
            {placeholder}
          </div>
        }
        options={options}
        value={value}
        onChange={onChange}
        components={{
          ...components,
          DropdownIndicator: () => {
            if (!hideDropdownIcon)
              return (
                <img src={`${ASSET_PATH}/icons/arrow-down.svg`} alt="Icon" />
              );
          },
        }}
        menuPosition="fixed"
        classNames={{
          control: ({ isFocused }) =>
            cn(
              `flex rounded-xl border shadow-none px-4 text-sm font-medium leading-[100%] tracking-[0%] cursor-pointer! hover:bg-input/20`,
              isFocused ? "border-ring/50" : "border-sky-mist",
              className,
            ),
          multiValue: () =>
            "rounded-[0.5rem] px-[0.75rem] gap-2 m-2 py-[0.375rem] bg-border text-sm",
          multiValueRemove: () => "cursor-pointer",
          noOptionsMessage: () => "text-sm bg-white rounded-b-[0.5rem] p-4",
          menuList: () =>
            "text-sm shadow-lg rounded-[0.5rem] text-black bg-white",
          option: ({ isSelected }) =>
            cn(
              `cursor-pointer! px-4 py-2 hover:bg-frosted-lavender`,
              isSelected ? "bg-iced-lavender" : "bg-white",
            ),
        }}
        unstyled
        {...selectProps}
      />
      {fieldState?.invalid && <FieldError errors={[fieldState?.error]} />}
    </Field>
  );
};

export default SelectField;

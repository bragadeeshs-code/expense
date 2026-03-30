import { X } from "lucide-react";
import { useState } from "react";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Spinner } from "../ui/spinner";
import { ASSET_PATH } from "@/helpers/constants/common";
import TooltipWrapper from "./TooltipWrapper";

interface SelectDropdownProps<T extends FieldValues, TOption> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  value?: string;
  options: TOption[];
  disabled?: boolean;
  isLoading?: boolean;
  isRequired?: boolean;
  className?: string;
  isSearchable?: boolean;
  onInputChange?: (value: string) => void;
  getLabel: (option: TOption) => string;
  getValue: (option: TOption) => string;
  labelClassName?: string;
  fieldClassName?: string;
  placeholderText?: string;
  hideDropdownIcon?: boolean;
  placeholderClassName?: string;
}

const SelectDropdown = <T extends FieldValues, TOption>({
  name,
  label,
  value = "",
  control,
  options,
  disabled = false,
  getLabel,
  getValue,
  isLoading = false,
  className = "",
  isSearchable = true,
  isRequired = false,
  onInputChange,
  fieldClassName,
  labelClassName,
  placeholderText = "",
  hideDropdownIcon = false,
  placeholderClassName = "",
}: SelectDropdownProps<T, TOption>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
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
                {isRequired && <span className="text-destructive">*</span>}
              </FieldLabel>
            )}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger
                asChild
                className="border-silver-gray w-full bg-transparent!"
              >
                <Button
                  disabled={disabled}
                  onClick={() => setIsOpen(true)}
                  variant="outline"
                  className={cn(
                    field.value
                      ? `h-9 text-sm font-medium text-black ${className}`
                      : `text-slate-whisper font-normal ${placeholderClassName}`,
                    "border-silver-gray flex justify-between",
                  )}
                >
                  <span className="truncate">
                    {field.value ? getLabel(field.value) : placeholderText}
                  </span>
                  <div className="flex items-center gap-2">
                    {field.value && !disabled && (
                      <TooltipWrapper content="Clear">
                        <span
                          onClick={(event) => {
                            event.stopPropagation();
                            field.onChange(null);
                          }}
                          className="text-silver-gray cursor-pointer hover:text-black"
                        >
                          <X />
                        </span>
                      </TooltipWrapper>
                    )}

                    {!hideDropdownIcon && (
                      <img
                        src={`${ASSET_PATH}/icons/arrow-down.svg`}
                        alt="Icon"
                      />
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-2">
                <Command className="space-y-2" shouldFilter={false}>
                  {isSearchable && (
                    <CommandInput
                      onValueChange={onInputChange}
                      value={value}
                      placeholder="search"
                    />
                  )}

                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <Spinner />
                    </div>
                  ) : (
                    <CommandList>
                      {!options.length ? (
                        <CommandEmpty>No results found.</CommandEmpty>
                      ) : (
                        options.map((option) => {
                          return (
                            <CommandItem
                              key={getValue(option)}
                              value={getValue(option)}
                              className="hover:bg-frosted-lavender! cursor-pointer data-[selected=true]:bg-transparent"
                              onSelect={() => {
                                field.onChange(option);
                                setIsOpen(false);
                              }}
                            >
                              {getLabel(option)}
                            </CommandItem>
                          );
                        })
                      )}
                    </CommandList>
                  )}
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default SelectDropdown;

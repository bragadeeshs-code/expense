import { X } from "lucide-react";
import { useState } from "react";

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
import { Spinner } from "../ui/spinner";
import { ASSET_PATH } from "@/helpers/constants/common";
import { Field, FieldLabel } from "../ui/field";

interface MultiSelectDropdownProps<TOption> {
  search?: string;
  onSearchChange?: (value: string) => void;
  isLoading?: boolean;
  hideDropdownIcon?: boolean;
  options: TOption[];
  value: TOption[];
  onChange: (val: TOption[]) => void;
  getLabel: (option: TOption) => string;
  getValue: (option: TOption) => string;
  placeholderText?: string;
  disabled?: boolean;
  isRequired?: boolean;
  label?: string;
  labelClassName?: string;
  placeHolderClassName?: string;
}

const MultiSelectDropdown = <TOption,>({
  search,
  onSearchChange,
  isLoading,
  options,
  onChange,
  getLabel,
  getValue,
  label,
  value = [],
  labelClassName,
  placeHolderClassName,
  placeholderText = "Select...",
  disabled = false,
  isRequired = false,
  hideDropdownIcon = false,
}: MultiSelectDropdownProps<TOption>) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (option: TOption) => {
    const exists = value.some((item) => getValue(item) === getValue(option));

    if (exists) {
      onChange(value.filter((item) => getValue(item) !== getValue(option)));
    } else {
      onChange([...value, option]);
    }
  };

  const removeSelected = (option: TOption) => {
    onChange(value.filter((item) => getValue(item) !== getValue(option)));
  };

  return (
    <Field className={cn("gap-2")}>
      {label && (
        <FieldLabel
          className={cn(
            "text-sm leading-[100%] font-semibold tracking-[-1%] text-black",
            labelClassName,
          )}
        >
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild className="border-silver-gray bg-transparent!">
          <div
            onClick={() => setIsOpen(true)}
            className={cn(
              "border-silver-gray flex h-full items-center justify-between rounded-md border p-2",
            )}
          >
            {value.length ? (
              <div className="flex flex-1 flex-wrap gap-2 text-xs font-medium text-black">
                {value.map((e) => (
                  <div
                    key={getValue(e)}
                    className="bg-cloud-silver flex items-center gap-2 rounded-full px-3"
                  >
                    {getLabel(e)}
                    <Button
                      variant={"ghost"}
                      size={"icon-xs"}
                      className="bg-transparent!"
                      onClick={(event) => {
                        event.stopPropagation();
                        removeSelected(e);
                      }}
                    >
                      <X />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "text-slate-whisper text-[13px] font-normal",
                  placeHolderClassName,
                )}
              >
                {placeholderText}
              </div>
            )}

            <div className="flex items-center gap-2">
              {!!value.length && !disabled && (
                <Button
                  variant={"ghost"}
                  size={"icon-sm"}
                  className="bg-transparent! text-gray-600"
                  onClick={(event) => {
                    event.stopPropagation();
                    onChange([]);
                  }}
                >
                  <X />
                </Button>
              )}
              {!hideDropdownIcon && (
                <img src={`${ASSET_PATH}/icons/arrow-down.svg`} alt="Icon" />
              )}
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-(--radix-popover-trigger-width) p-2">
          <Command className="space-y-2" shouldFilter={false}>
            {onSearchChange && (
              <CommandInput
                onValueChange={onSearchChange}
                value={search}
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
                    const isSelected = value.some(
                      (e) => getValue(e) == getValue(option),
                    );

                    return (
                      <CommandItem
                        key={getValue(option)}
                        value={getValue(option)}
                        onSelect={() => {
                          toggleOption(option);
                          setIsOpen(false);
                        }}
                        className={cn(
                          "hover:bg-frosted-lavender! cursor-pointer bg-transparent!",
                          isSelected && "text-cool-gray!",
                        )}
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
    </Field>
  );
};

export default MultiSelectDropdown;

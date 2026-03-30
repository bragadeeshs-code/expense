import { debounce } from "lodash";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { DEBOUNCED_SEARCH_DELAY_TIME } from "@/helpers/constants/common";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

interface DebouncedSearchFieldProps extends React.ComponentProps<"input"> {
  delay?: number;
  search: string;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  className?: string;
}

const DebouncedSearchField: React.FC<DebouncedSearchFieldProps> = ({
  delay = DEBOUNCED_SEARCH_DELAY_TIME,
  search,
  isLoading = false,
  onSearch,
  className,
}) => {
  const [internalSearch, setInternalSearch] = useState<string>(search);

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        onSearch(value);
      }, delay),
    [delay, onSearch],
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setInternalSearch(inputValue);
    debouncedSearch(inputValue);
  };

  const clearSearch = () => {
    setInternalSearch("");
    onSearch("");
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <InputGroup
      className={`border-fog-gray h-8 rounded-[0.625rem] shadow-none ${className}`}
      data-disabled={isLoading}
    >
      <InputGroupAddon className="py-0! pl-3!">
        <Search className="text-ash-gray size-3.5" />
      </InputGroupAddon>

      <InputGroupInput
        value={internalSearch}
        placeholder="Search"
        className="text-ash-gray p-1.5 text-sm leading-5 font-medium tracking-[-0.3px]"
        onChange={handleChange}
        inputWrapperClassName="min-w-0 flex-1"
      />

      <InputGroupAddon
        className="p-0 has-[>button]:-mr-[-0.45rem]"
        align={"inline-end"}
      >
        {isLoading ? (
          <InputGroupButton
            aria-label="Loading"
            title="Loading"
            size={"icon-xs"}
          >
            <Spinner />
          </InputGroupButton>
        ) : (
          internalSearch && (
            <InputGroupButton
              aria-label="Cancel"
              title="Cancel"
              size="icon-xs"
              onClick={clearSearch}
              className="cursor-pointer"
            >
              <X className="text-ash-gray size-3.5" />
            </InputGroupButton>
          )
        )}
      </InputGroupAddon>
    </InputGroup>
  );
};

export default DebouncedSearchField;

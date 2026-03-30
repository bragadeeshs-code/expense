import { Search, X, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { debounce } from "lodash";
import { DEBOUNCED_SEARCH_DELAY_TIME } from "@/helpers/constants/common";

interface ExpandableSearchInputProps {
  delay?: number;
  search: string;
  isLoading?: boolean;
  onSearch: (value: string) => void;
  placeholder?: string;
}

const ExpandableDebouncedSearch: React.FC<ExpandableSearchInputProps> = ({
  delay = DEBOUNCED_SEARCH_DELAY_TIME,
  search,
  isLoading = false,
  onSearch,
  placeholder = "Search...",
}) => {
  const [internalSearch, setInternalSearch] = useState<string>(search);
  const [isOpen, setIsOpen] = useState(!!search);
  const inputRef = useRef<HTMLInputElement>(null);

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

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  useEffect(() => {
    if (isOpen && !isLoading) {
      inputRef.current?.focus();
    }
  }, [isOpen, isLoading]);

  return (
    <div className={cn("flex items-center", isOpen && "gap-2")}>
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "w-50 opacity-100 xl:w-64" : "w-0 opacity-0",
        )}
      >
        <Search className="text-ash-gray absolute top-1/2 left-2 h-3.5 w-3.5 -translate-y-1/2" />
        <Input
          value={internalSearch}
          ref={inputRef}
          type="text"
          disabled={isLoading}
          placeholder={placeholder}
          onChange={handleChange}
          className={cn(
            "rounded-[8px] pr-8 pl-8 text-xs font-medium",
            "placeholder:text-alert-dialog-dismiss leading-[100%] tracking-[0%]",
            "h-8 py-0 focus-visible:ring-0",
            isLoading && "cursor-not-allowed opacity-70",
          )}
        />

        {isLoading ? (
          <Loader2 className="text-ash-gray absolute top-1/2 right-2 h-3.5 w-3.5 -translate-y-1/2 animate-spin" />
        ) : internalSearch ? (
          <button
            type="button"
            onClick={clearSearch}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="text-ash-gray h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {isOpen ? (
        <Button
          className="border-fog-gray hover:bg-frosted-lavender hover:border-primary group rounded-[8px]"
          variant="outline"
          size="sm"
          onClick={handleToggle}
          aria-label="Close Search"
        >
          <X className="text-ash-gray group-hover:text-primary h-3.5 w-3.5" />
        </Button>
      ) : (
        <Button
          className="border-fog-gray hover:bg-frosted-lavender hover:border-primary group rounded-[8px]"
          variant="outline"
          size="sm"
          onClick={handleToggle}
          aria-label="Open Search"
        >
          <Search className="text-ash-gray group-hover:text-primary h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default ExpandableDebouncedSearch;

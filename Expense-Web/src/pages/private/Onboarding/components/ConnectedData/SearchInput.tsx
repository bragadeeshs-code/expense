import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";

interface SearchInputProps {
  search: string;
  onSearch: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ search, onSearch }) => {
  return (
    <div className="border-border focus-within:border-primary mx-5 flex flex-row items-center rounded-[8px] border px-5 sm:mx-7">
      <Search className="text-alert-dialog-dismiss h-4 w-4" />
      <Input
        type="text"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search for apps..."
        className="placeholder:text-alert-dialog-dismiss flex-1 rounded-[8px] border-none text-xs font-medium shadow-none placeholder:font-normal focus-visible:ring-0"
      />
      {search && (
        <button
          type="button"
          onClick={() => onSearch("")}
          className="text-alert-dialog-dismiss cursor-pointer hover:text-black"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;

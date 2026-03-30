import { Search } from "lucide-react";

import { Input } from "../ui/input";

const SearchInput: React.FC = () => {
  return (
    <Input
      contentBefore={<Search size={14} className="text-ash-gray" />}
      type="search"
      placeholder="Search"
      className="placeholder:text-ash-gray border-fog-gray h-8 w-[200px] rounded-[10px] border font-medium shadow-none placeholder:text-sm sm:w-[300px]"
    />
  );
};

export default SearchInput;

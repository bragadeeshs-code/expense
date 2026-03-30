import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { DEBOUNCED_SEARCH_DELAY_TIME } from "@/helpers/constants/common";

const useDebouncedSearch = (delay: number = DEBOUNCED_SEARCH_DELAY_TIME) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncer = useMemo(
    () =>
      debounce((value: string) => {
        setDebouncedSearch(value);
      }, delay),
    [delay],
  );

  const updateSearch = (value: string) => {
    setSearch(value);
    debouncer(value);
  };

  useEffect(() => {
    return () => debouncer.cancel();
  }, [debouncer]);

  return { search, debouncedSearch, updateSearch, setSearch };
};

export default useDebouncedSearch;

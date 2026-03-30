import { Settings } from "lucide-react";
import { lowerCase } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import SearchInput from "./SearchInput";
import {
  ConnectionProviderEnum,
  dataSources,
  inputTypes,
  outputTypes,
  SourceEnum,
} from "../../helpers/constants/onboarding";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ASSET_PATH } from "@/helpers/constants/common";

type DataSourcesSheetProps = {
  isSheetOpen: boolean;
  setIsSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleConnect: (provider: ConnectionProviderEnum) => void;
  type: SourceEnum;
};

const DataSourcesSheet: React.FC<DataSourcesSheetProps> = ({
  isSheetOpen,
  handleConnect,
  setIsSheetOpen,
  type,
}) => {
  const [search, setSearch] = useState<string>("");

  const [items, setItems] = useState<DataSource[]>(dataSources);

  const availableItems = useMemo(() => {
    if (type === SourceEnum.OUTPUT) {
      return items.filter((dataSource) =>
        outputTypes.includes(dataSource.type),
      );
    }
    if (type === SourceEnum.INPUT) {
      return items.filter((dataSource) => inputTypes.includes(dataSource.type));
    }
    return items;
  }, [type, items]);

  useEffect(() => {
    if (search.length) {
      setItems(
        dataSources.filter((item) =>
          lowerCase(item.name).includes(lowerCase(search)),
        ),
      );
    } else {
      setItems(dataSources);
    }
  }, [search]);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="link"
          size="sm"
          className="[background-image:var(--gradient-primary)] bg-clip-text text-sm leading-[100%] font-medium tracking-[0%] text-transparent"
        >
          <img
            src={`${ASSET_PATH}/icons/plus.svg`}
            alt="add Icon"
            className="h-3.5 w-3.5"
          />
          Add more
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full py-5 sm:min-w-md">
        <SheetHeader className="mb-5 flex flex-row space-x-2 p-0 px-5">
          <Settings className="text-primary bg-preview-item-hover size-9 shrink-0 rounded-full p-2" />
          <div className="space-y-1">
            <SheetTitle className="text-xl font-semibold tracking-[-1%] text-black md:text-2xl">
              Connect Data Source
            </SheetTitle>
            <SheetDescription className="text-cool-gray text-sm font-medium tracking-[-1%]">
              Choose an app from the list below to connect and sync data with
              your agent.
            </SheetDescription>
          </div>
        </SheetHeader>
        <SearchInput search={search} onSearch={setSearch} />
        {availableItems.length ? (
          <ul className="scrollbar-thin overflow-y-auto px-5 sm:px-7">
            {availableItems.map((item, index) => (
              <li
                key={index}
                className="border-cloud-silver flex items-center justify-between border-b py-3 last:border-b-0"
              >
                <div className="flex items-center gap-2.5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="size-7 object-contain"
                  />
                  <div className="space-y-1.5">
                    <h3 className="text-sm leading-[100%] font-semibold tracking-[-1%] text-black">
                      {item.name}
                    </h3>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => handleConnect(item.type)}
                  className="border-border-muted hover:bg-frosted-lavender hover:border-primary rounded-[8px] text-xs leading-[100%] font-medium tracking-[0%] text-black"
                >
                  <Settings className="size-3.5" />
                  Connect
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-muted-foreground mt-4 text-center text-sm">
            No sources available
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default DataSourcesSheet;

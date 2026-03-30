import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

interface AppTabsProps<T extends string> {
  value: T;
  tabsList: TabItem<T>[];
  className?: string;
  defaultValue: T;
  tabsListClassName?: string;
  onTabChange: (value: T) => void;
  tabTriggerClassName?: string;
}

const AppTabs = <T extends string>({
  value,
  tabsList,
  className,
  defaultValue,
  tabsListClassName,
  onTabChange,
  tabTriggerClassName,
}: AppTabsProps<T>) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      className={cn("w-full rounded-xl", className)}
      value={value}
      onValueChange={(value) => onTabChange(value as T)}
    >
      <TabsList
        className={cn(
          "bg-cool-white shadow-subtle flex w-full justify-start overflow-x-auto",
          tabsListClassName,
        )}
      >
        {tabsList.map((tab) => (
          <TabsTrigger
            value={tab.value}
            className={cn("app-tab-item", tabTriggerClassName)}
            key={tab.value}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};

export default AppTabs;

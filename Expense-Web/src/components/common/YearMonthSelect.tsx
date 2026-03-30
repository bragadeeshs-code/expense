import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, setMonth, setYear } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ASSET_PATH, MONTHS } from "@/helpers/constants/common";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface YearMonthSelectProps {
  className?: string;
  placeholder?: string;
  onSelectMonth: (selectedYearMonth: string) => void;
}

export function YearMonthSelect({
  className,
  placeholder = "Select month",
  onSelectMonth,
}: YearMonthSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const handlePrevYear = () => {
    const newViewDate = setYear(viewDate, viewDate.getFullYear() - 1);
    setViewDate(newViewDate);
  };

  const handleNextYear = () => {
    const newViewDate = setYear(viewDate, viewDate.getFullYear() + 1);
    setViewDate(newViewDate);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(viewDate, monthIndex);
    setDate(newDate);
    onSelectMonth(format(newDate, "yyyy-MM"));
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          type="button"
          className={cn(
            "border-ash-white hover:bg-frosted-lavender flex w-41.5 cursor-pointer items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap transition-[color,box-shadow] outline-none",
            className,
          )}
          aria-expanded={isOpen}
        >
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={`${ASSET_PATH}/icons/calendar-filled.svg`}
                alt="Calendar Icon"
                className="size-4 shrink-0"
              />
              <span
                className={cn(
                  "truncate text-sm",
                  !date && "text-rich-black font-medium",
                )}
              >
                {date ? format(date, "MMM yyyy") : placeholder}
              </span>
            </div>

            <img
              src={`${ASSET_PATH}/icons/arrow-down.svg`}
              alt="Arrow Down Icon"
              className="size-4 shrink-0"
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="flex items-center justify-between border-b p-2 pt-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevYear}
            className="h-7 w-7"
            type="button"
          >
            <ChevronLeft className="h-4 w-4 opacity-50 hover:opacity-100" />
          </Button>
          <span className="text-sm font-semibold">
            {viewDate.getFullYear()}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextYear}
            className="h-7 w-7"
            disabled={viewDate.getFullYear() === currentYear}
            type="button"
          >
            <ChevronRight className="h-4 w-4 opacity-50 hover:opacity-100" />
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 p-4">
          {MONTHS.map((month, index) => {
            const isSelected =
              date.getMonth() === index &&
              date.getFullYear() === viewDate.getFullYear();
            const isCurrentMonth =
              currentMonth === index && currentYear === viewDate.getFullYear();

            const isFuture =
              viewDate.getFullYear() > currentYear ||
              (viewDate.getFullYear() === currentYear && index > currentMonth);

            return (
              <Button
                key={month}
                onClick={() => handleMonthSelect(index)}
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-9 w-full font-normal",
                  !isSelected && "hover:bg-frosted-lavender",
                  isCurrentMonth &&
                    !isSelected &&
                    "border-primary/20 text-primary border font-medium",
                )}
                disabled={isFuture}
                type="button"
              >
                {month}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

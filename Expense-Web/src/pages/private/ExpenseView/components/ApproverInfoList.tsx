import React from "react";

import { cn } from "@/lib/utils";
import type { ExpenseApprover } from "../types/expense-view.types";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
} from "@/components/ui/carousel";

import ApproverInfo from "./ApproverInfo";

interface ApproverInfoListProps {
  items: ExpenseApprover[];
  className?: string;
}

const ApproverInfoList: React.FC<ApproverInfoListProps> = ({
  items,
  className,
}) => {
  const count = items.length;

  return (
    <div className={cn("flex w-full", className)}>
      <Carousel className="w-full select-none @2xl:max-w-56">
        <CarouselContent>
          {items.map((item, index) => (
            <div key={index} className="relative flex items-center">
              <CarouselItem
                key={index}
                className="flex basis-16 justify-center pl-4"
              >
                <ApproverInfo
                  status={item.status}
                  first_name={item.first_name}
                  approval_level={item.approval_level}
                />
              </CarouselItem>
              {count > 1 && index < count - 1 && (
                <div className="absolute top-1/2 -right-4 block w-3 border-t-[1.5px] border-dashed border-black" />
              )}
            </div>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ApproverInfoList;

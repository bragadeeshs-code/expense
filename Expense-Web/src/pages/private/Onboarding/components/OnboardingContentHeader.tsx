import React from "react";
import { cn } from "@/lib/utils";

interface OnboardingContentHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
}

export const OnboardingContentHeader: React.FC<
  OnboardingContentHeaderProps
> = ({ title, description, children, className }) => {
  return (
    <div
      className={cn(
        "mb-2 flex items-center justify-between gap-2 px-5 sm:mb-5 xl:px-20",
        className,
      )}
    >
      <div>
        <p className="mb-2 text-base leading-[90%] font-semibold tracking-[-1.9%] text-black sm:mb-2 sm:text-[28px]">
          {title}
        </p>
        <p className="text-ash-gray text-xs leading-[140%] font-medium tracking-[-1%] sm:text-base">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
};

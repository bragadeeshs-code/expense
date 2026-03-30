import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  type,
  className,
  contentAfter,
  contentBefore,
  inputWrapperClassName,
  contentAfterContainerClassName,
  ...props
}: React.ComponentProps<"input"> & {
  contentAfter?: React.ReactNode;
  contentBefore?: React.ReactNode;
  inputWrapperClassName?: string;
  contentAfterContainerClassName?: string;
}) {
  return (
    <div className={cn("relative", inputWrapperClassName)}>
      {contentBefore && (
        <div className="absolute inset-y-0 start-3 flex items-center">
          {contentBefore}
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className,
          `${contentBefore && "pl-8"}`,
        )}
        {...props}
      />
      {contentAfter && (
        <div
          className={cn("flex items-center", contentAfterContainerClassName)}
        >
          {contentAfter}
        </div>
      )}
    </div>
  );
}

export { Input };

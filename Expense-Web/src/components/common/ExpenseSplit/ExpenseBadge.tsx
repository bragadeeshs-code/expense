import React, { useRef, useState, useEffect } from "react";
import Avatar from "react-avatar";
import { cn, getUserNameFromEmail } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExpenseBadgeProps {
  email: string;
  amount: number;
  currency: string;
}

const ExpenseBadge: React.FC<ExpenseBadgeProps> = ({
  email,
  amount,
  currency,
}) => {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState<boolean>(false);
  const name = getUserNameFromEmail(email);

  useEffect(() => {
    if (textRef.current) {
      const { scrollWidth, clientWidth } = textRef.current;
      setIsTruncated(scrollWidth > clientWidth);
    }
  }, [email]);

  const NameText = (
    <p
      ref={textRef}
      className="text-ash-gray max-w-30 truncate text-sm leading-[100%] font-semibold tracking-[-0.6%]"
    >
      {name}
    </p>
  );

  return (
    <TooltipProvider>
      <div
        className={cn(
          "bg-ice-white flex items-center gap-1.5 rounded-full px-4 py-1.5 pl-1.5",
        )}
      >
        <Avatar name={name} size="36" round />

        <div className="flex flex-col gap-1.5">
          {isTruncated ? (
            <Tooltip>
              <TooltipTrigger asChild>{NameText}</TooltipTrigger>
              <TooltipContent>
                <p>{name}</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            NameText
          )}

          <p className="text-sm leading-[100%] font-semibold tracking-[-0.6%] text-black">
            {currency}{" "}
            {new Intl.NumberFormat("en-IN", {
              maximumSignificantDigits: 3,
            }).format(amount)}
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ExpenseBadge;

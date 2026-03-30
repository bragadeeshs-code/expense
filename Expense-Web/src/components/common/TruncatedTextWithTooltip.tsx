import React, { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import TooltipWrapper from "./TooltipWrapper";

interface TruncatedTextWithTooltipProps {
  text: string;
  className?: string;
  tooltipClassName?: string;
}

const TruncatedTextWithTooltip: React.FC<TruncatedTextWithTooltipProps> = ({
  text,
  className,
  tooltipClassName,
}) => {
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (!textRef.current) return;

    const el = textRef.current;
    setIsTruncated(el.scrollWidth > el.clientWidth);
  }, [text]);

  const Content = (
    <p ref={textRef} className={cn("truncate", className)}>
      {text}
    </p>
  );

  if (!isTruncated) return Content;

  return (
    <TooltipWrapper className={tooltipClassName} content={text}>
      {Content}
    </TooltipWrapper>
  );
};

export default TruncatedTextWithTooltip;

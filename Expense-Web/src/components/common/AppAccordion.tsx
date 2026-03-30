import { useState } from "react";
import type { ReactElement } from "react";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Switch } from "../ui/switch";

interface AppAccordionProps {
  children: ReactElement;
  className?: string;
  accordionType?: "single" | "multiple";
  accordionTrigger: string;
  triggerClassName?: string;
  useSwitch?: boolean;
}

const AppAccordion: React.FC<AppAccordionProps> = ({
  children,
  className,
  accordionType = "single",
  accordionTrigger,
  triggerClassName,
  useSwitch = false,
}) => {
  const baseClassName = cn(
    "border-frost-bound shadow-cool-mist rounded-2xl border bg-white p-6.5",
    className,
  );

  const [open, setOpen] = useState<boolean>(true);

  if (useSwitch) {
    return (
      <Accordion
        type="single"
        collapsible
        value={open ? accordionTrigger : undefined}
        onValueChange={(v) => setOpen(Boolean(v))}
        className={baseClassName}
      >
        <AccordionItem value={accordionTrigger}>
          <div className="flex items-center justify-between py-2">
            <span className="text-lg font-semibold text-black">
              {accordionTrigger}
            </span>
            <Switch checked={open} onCheckedChange={setOpen} />
          </div>

          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  if (accordionType === "single") {
    return (
      <Accordion
        type="single"
        collapsible
        defaultValue={accordionTrigger}
        className={baseClassName}
      >
        <AccordionItem value={accordionTrigger}>
          <AccordionTrigger
            className={cn(
              "cursor-pointer items-center py-0 text-lg font-semibold text-black hover:no-underline",
              triggerClassName,
            )}
          >
            {accordionTrigger}
          </AccordionTrigger>
          <AccordionContent>{children}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );
  }

  return (
    <Accordion
      type="multiple"
      defaultValue={[accordionTrigger]}
      className={baseClassName}
    >
      <AccordionItem value={accordionTrigger}>
        <AccordionTrigger
          className={cn(
            "cursor-pointer items-center py-0 text-lg font-semibold text-black hover:no-underline",
            triggerClassName,
          )}
        >
          {accordionTrigger}
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default AppAccordion;

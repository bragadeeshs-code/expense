import { cn } from "@/lib/utils";

interface InfoCardItemProps {
  title: string;
  value: string | React.ReactNode;
  className?: string;
  titleClassName?: string;
  valueClassName?: string;
}

const InfoCardItem = ({
  title,
  value,
  className,
  titleClassName,
  valueClassName,
}: InfoCardItemProps) => {
  return (
    <div className={cn("font-medium", className)}>
      <p className={cn("text-ash-gray text-[13px]", titleClassName)}>{title}</p>
      <div className={cn("text-[15px] text-black", valueClassName)}>
        {value}
      </div>
    </div>
  );
};

export default InfoCardItem;

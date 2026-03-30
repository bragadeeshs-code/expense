import { cn } from "@/lib/utils";

interface AppHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  description: string;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  children,
  className,
  description,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 bg-white p-5",
        className,
      )}
    >
      <div className="space-y-1">
        <h2 className="text-rich-black text-xl font-semibold md:text-[28px]">
          {title}
        </h2>
        <p className="text-steel-gray text-base font-medium">{description}</p>
      </div>

      {children && <>{children}</>}
    </div>
  );
};

export default AppHeader;

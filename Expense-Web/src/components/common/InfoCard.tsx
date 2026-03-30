import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface InfoCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleIcon?: React.ReactNode;
}

const InfoCard = ({ title, children, className, titleIcon }: InfoCardProps) => {
  return (
    <Card
      className={cn(
        "border-porcelain shadow-card-soft rounded-2xl border",
        className,
      )}
    >
      <CardHeader className="flex items-center">
        {titleIcon && titleIcon}
        <CardTitle className="text-black">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">{children}</CardContent>
    </Card>
  );
};

export default InfoCard;

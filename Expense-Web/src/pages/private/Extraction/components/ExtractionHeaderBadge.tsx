import { Badge } from "@/components/ui/badge";

interface ExtractionHeaderBadgeProps {
  title: string;
  value: string;
}

const ExtractionHeaderBadge: React.FC<ExtractionHeaderBadgeProps> = ({
  title,
  value,
}) => {
  return (
    <div className="flex items-center gap-3.5">
      <span className="text-ash-gray text-sm font-medium">{title}</span>
      <Badge
        variant="outline"
        className="border-sky-mist bg-cloud-white px-2.5 py-2 text-sm font-semibold"
      >
        {value}
      </Badge>
    </div>
  );
};

export default ExtractionHeaderBadge;

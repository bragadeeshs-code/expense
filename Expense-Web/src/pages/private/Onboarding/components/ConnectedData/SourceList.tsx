import type { Connection } from "../../types/onboarding.types";
import SourceItem from "./SourceItem";

type SourceListProps = {
  items: Connection[];
  onConnectionComplete: () => void;
};

const SourceList: React.FC<SourceListProps> = ({
  items,
  onConnectionComplete,
}) => {
  if (!items.length) {
    return (
      <div className="text-muted-foreground mt-6 px-10 text-center text-sm">
        No sources connected yet. Use{" "}
        <span className="font-medium">Add More</span> above to connect one.
      </div>
    );
  }
  return (
    <ul className="mt-5">
      {items.map((item) => (
        <SourceItem
          key={item.id}
          item={item}
          onConnectionComplete={onConnectionComplete}
        />
      ))}
    </ul>
  );
};

export default SourceList;

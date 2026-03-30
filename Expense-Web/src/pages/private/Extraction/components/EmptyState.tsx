import { cn } from "@/lib/utils";
import { EMPTY_STATE_MAP } from "@/helpers/constants/common";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";

interface EmptyStateProps {
  type: EmptyStateType;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, className }) => {
  const state = EMPTY_STATE_MAP[type];
  const Icon = state.icon;
  return (
    <Empty
      className={cn(
        "shadow-card-soft border-porcelain rounded-2xl border px-6 py-5",
        className,
      )}
    >
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon />
        </EmptyMedia>

        <EmptyTitle>{state.title}</EmptyTitle>

        <EmptyDescription>{state.description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyState;

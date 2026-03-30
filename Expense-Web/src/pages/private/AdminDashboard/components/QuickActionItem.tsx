import { Button } from "@/components/ui/button";
import { ASSET_PATH } from "@/helpers/constants/common";

interface QuickActionItemProps {
  label: string;
  imgSrc: string;
}

const QuickActionItem: React.FC<QuickActionItemProps> = ({ label, imgSrc }) => {
  return (
    <Button
      variant="outline"
      className="border-vivid-violet shadow-ambient justify-center gap-2 rounded-full bg-white [background-image:var(--gradient-primary)] bg-clip-text p-3 text-sm leading-[150%] font-medium tracking-[-1%] text-transparent @3xl:flex-1"
    >
      <img src={imgSrc} alt={`${label} icon`} />
      {label}
      <img
        src={`${ASSET_PATH}/icons/arrow-right.svg`}
        alt="arrow right icon"
        className="size-3.5"
      />
    </Button>
  );
};

export default QuickActionItem;

import { Button } from "@/components/ui/button";

interface ExtractionFooterProps {
  isSubmitting: boolean;
}

const ExtractionFooter: React.FC<ExtractionFooterProps> = ({
  isSubmitting,
}) => {
  return (
    <div className="flex justify-end gap-2 px-5">
      <Button
        type="button"
        variant="outline"
        className="border-indigo-violet text-indigo-violet hover:bg-frosted-lavender hover:border-vivid-violet hover:text-vivid-violet text-sm leading-5 font-medium tracking-[0%] @min-sm:min-w-30"
        disabled={isSubmitting}
        onClick={(event) => event.preventDefault()}
      >
        Split Bill
      </Button>
      <Button
        form="extraction-form"
        type="submit"
        className="rounded-[0.5rem] [background-image:var(--gradient-primary)] px-4 py-2.5 text-sm leading-5 font-medium tracking-[0%] text-white @min-sm:min-w-30"
        disabled={isSubmitting}
      >
        Submit
      </Button>
    </div>
  );
};

export default ExtractionFooter;

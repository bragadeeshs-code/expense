import React from "react";
import { Button } from "../ui/button";

interface GradientOutlineButtonProps {
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const GradientOutlineButton: React.FC<GradientOutlineButtonProps> = ({
  onClick,
  children,
  disabled = false,
}) => {
  return (
    <Button
      variant="outline"
      size="sm"
      className="border-vivid-violet hover:bg-frosted-lavender [background-image:var(--gradient-primary)] bg-clip-text p-0 text-xs font-medium text-transparent hover:bg-none hover:bg-clip-content hover:text-purple-500"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};

export default GradientOutlineButton;

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { notifySuccess } from "@/lib/utils";

type CopyFieldProps = {
  value: string;
  label: string;
};

const CopyField: React.FC<CopyFieldProps> = ({ value, label }) => {
  const [canCopy, setCanCopy] = useState<boolean>(true);

  const copyToClipboard = async (text: string, field: string) => {
    await navigator.clipboard.writeText(text);
    setCanCopy(false);
    notifySuccess("Copied to clipboard", `${field} has been copied.`);
    setTimeout(() => setCanCopy(true), 2000);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input value={value} readOnly className="bg-muted text-sm" />
        </div>
        <Button
          variant="outline"
          disabled={!canCopy}
          onClick={() => copyToClipboard(value, label)}
        >
          {canCopy ? (
            <Copy className="h-4 w-4" />
          ) : (
            <Check className="h-4 w-4 text-green-500" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CopyField;

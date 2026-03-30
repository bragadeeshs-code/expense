import { LoaderIcon } from "lucide-react";
import React, { useRef, useState } from "react";

import { ASSET_PATH } from "@/helpers/constants/common";
import { cn, getBorderSvg } from "@/lib/utils";

interface ImportZonePros {
  title: string;
  disabled: boolean;
  isLoading: boolean;
  onFileSelected: (file: File) => void;
  onSampleTemplateClick: () => void;
}

const ImportZone: React.FC<ImportZonePros> = ({
  title,
  disabled,
  isLoading,
  onFileSelected,
  onSampleTemplateClick,
}) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const file: File = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  };

  const handleClick = () => {
    if (!disabled) fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelected(file);

    event.target.value = "";
  };

  const handleSampleTemplateClick = (
    event: React.MouseEvent<HTMLSpanElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    onSampleTemplateClick();
  };

  return (
    <div className="mt-8.25">
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        className={cn(
          "bg-icy-blue border-electric-indigo h-full cursor-pointer rounded-2xl px-3 py-6 transition-all",
          disabled && "cursor-not-allowed opacity-50",
          isDragging && "border-vivid-violet",
        )}
        style={{
          backgroundImage: getBorderSvg(isDragging ? "#962fd2" : "#7D72FC"),
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex h-full flex-col items-center justify-center">
          {isLoading ? (
            <div className="flex gap-5">
              <LoaderIcon className="animate-spin text-center" />
              <p className="text-dark-charcoal text-base font-medium">
                Importing files from CSV
              </p>
            </div>
          ) : (
            <>
              <img src={`${ASSET_PATH}/icons/upload_arrow_icon.svg`} />

              <h3 className="text-dark-charcoal mb-2 text-base font-medium">
                {title}
              </h3>

              <p className="text-dusky-gray text-xs font-normal">
                <span
                  className="cursor-pointer font-semibold underline underline-offset-2"
                  onClick={handleSampleTemplateClick}
                >
                  Click here
                </span>{" "}
                to download sample template
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.csv"
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
      </div>
    </div>
  );
};

export default ImportZone;

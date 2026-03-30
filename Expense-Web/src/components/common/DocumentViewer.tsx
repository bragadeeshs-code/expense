import { useState } from "react";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "../ui/spinner";
import ImageViewer from "./ImageViewer";
import PDFDocumentViewer from "./PDFDocumentViewer";

interface DocumentViewerProps {
  url: string;
  name: string;
  format: string;
  isLoading: boolean;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({
  url,
  name,
  format,
  isLoading,
}) => {
  const [error, setError] = useState<boolean>(false);
  const fileExtension = format.toLowerCase();

  const handleDownload = () => {
    window.open(url, "_blank");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-96 items-center justify-center">
          <Spinner className="h-8 w-8" />
          <span className="ml-2 text-gray-600">Loading preview...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <p className="text-eerie-black mb-4 text-center text-lg font-semibold md:text-xl">
            Unable to preview the document
          </p>
          <p className="text-slate-charcoal text-center text-xs md:text-sm">
            Please try again later or download the file
          </p>
          <Button
            onClick={handleDownload}
            className="mt-4 rounded-md [background-image:var(--gradient-primary)]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download File
          </Button>
        </div>
      );
    }

    if (["jpg", "jpeg", "png"].includes(fileExtension)) {
      return <ImageViewer url={url} name={name} onError={setError} />;
    }

    if (["xls", "xlsx", "doc", "docx"].includes(fileExtension)) {
      return (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`}
          className="h-full w-full border-0"
          title={name}
          onError={() => setError(true)}
        />
      );
    }

    if (["pdf", "txt"].includes(fileExtension)) {
      return <PDFDocumentViewer url={url} />;
    }

    return (
      <div className="flex h-full flex-col items-center justify-center">
        <p className="text-eerie-black mb-4 text-center text-lg font-semibold md:text-xl">
          Preview not available for this file type
        </p>
        <Button
          onClick={handleDownload}
          className="rounded-md [background-image:var(--gradient-primary)]"
        >
          <Download className="mr-2 h-4 w-4" />
          Download File
        </Button>
      </div>
    );
  };

  return (
    <div className="scrollbar-thin flex h-full overflow-y-auto">
      <div className="flex-1 overflow-hidden">{renderContent()}</div>
    </div>
  );
};

export default DocumentViewer;

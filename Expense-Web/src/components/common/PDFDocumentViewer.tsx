import PDFViewer, {
  ZoomMode,
  ZoomPlugin,
  type PDFViewerRef,
} from "@embedpdf/react-pdf-viewer";
import { useRef } from "react";
import { Button } from "../ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";

const PDFDocumentViewer = ({ url }: { url: string }) => {
  const viewerRef = useRef<PDFViewerRef | null>(null);

  const getZoomPlugin = async () => {
    const registry = await viewerRef.current?.registry;
    return registry?.getPlugin<ZoomPlugin>("zoom")?.provides();
  };
  const handleZoomIn = async () => {
    const zoom = await getZoomPlugin();
    zoom?.forDocument("zoom-doc").zoomIn();
  };
  const handleZoomOut = async () => {
    const zoom = await getZoomPlugin();
    zoom?.forDocument("zoom-doc").zoomOut();
  };

  return (
    <div className="relative h-full">
      <PDFViewer
        ref={viewerRef}
        className="h-full"
        config={{
          documentManager: {
            initialDocuments: [
              {
                url: url,
                documentId: "zoom-doc",
              },
            ],
          },
          disabledCategories: [
            "zoom",
            "annotation",
            "form",
            "shapes",
            "redaction",
            "document",
            "panel",
            "tools",
            "selection",
            "history",
          ],
          zoom: {
            defaultZoomLevel: ZoomMode.Automatic,
          },
          theme: { preference: "light" },
        }}
      />
      <div className="absolute top-1.5 right-3 flex gap-2">
        <Button variant={"outline"} onClick={handleZoomOut} type="button">
          <ZoomOut />
        </Button>
        <Button variant={"outline"} type="button" onClick={handleZoomIn}>
          <ZoomIn />
        </Button>
      </div>
    </div>
  );
};

export default PDFDocumentViewer;

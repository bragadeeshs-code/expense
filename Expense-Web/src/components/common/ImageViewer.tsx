import { useState, useRef, useEffect } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "../ui/button";

interface ImageViewerProps {
  url: string;
  name: string;
  onError: (value: boolean) => void;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ url, name, onError }) => {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_ZOOM = 0.3;
  const MAX_ZOOM = 4;

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, MIN_ZOOM));
    if (zoom <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setDragging(true);
    setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - startDrag.x,
      y: e.clientY - startDrag.y,
    });
  };

  const handleMouseUp = () => setDragging(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      const delta = -e.deltaY;
      const zoomAmount = delta / 100;

      setZoom((prev) => {
        let next = prev + zoomAmount;
        next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));

        if (next <= 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    };

    container.addEventListener("wheel", wheelHandler, { passive: false });

    return () => {
      container.removeEventListener("wheel", wheelHandler);
    };
  }, [MIN_ZOOM, MAX_ZOOM]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden bg-gray-100 select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="flex h-full w-full items-center justify-center p-4"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: "center",
          transition: dragging ? "none" : "transform 0.2s ease-in-out",
          cursor: zoom > 1 ? "grab" : "default",
        }}
        onMouseDown={handleMouseDown}
      >
        <img
          src={url}
          alt={name}
          onError={() => onError(true)}
          draggable={false}
          className="pointer-events-none max-h-full max-w-full object-contain"
        />
      </div>

      <div className="absolute right-4 bottom-4 z-50 flex items-center gap-2 rounded-md bg-white/70 px-3 py-2 shadow-md backdrop-blur">
        <Button
          size="icon"
          type="button"
          variant="outline"
          className="rounded-xs"
          onClick={handleZoomOut}
          disabled={zoom <= MIN_ZOOM}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>

        <span className="w-12 text-center text-sm font-medium">
          {Math.round(zoom * 100)}%
        </span>

        <Button
          size="icon"
          type="button"
          variant="outline"
          className="rounded-xs"
          onClick={handleZoomIn}
          disabled={zoom >= MAX_ZOOM}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ImageViewer;

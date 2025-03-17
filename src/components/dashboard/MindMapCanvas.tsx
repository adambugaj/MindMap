import { useState, useRef, useEffect } from "react";
import { useDomainContext } from "@/context/DomainContext";
import DomainNode from "./DomainNode";
import { Domain } from "@/types/domain";

interface MindMapCanvasProps {
  scale?: number;
  onScaleChange?: (scale: number) => void;
}

const MindMapCanvas = ({
  scale = 1,
  onScaleChange = () => {},
}: MindMapCanvasProps) => {
  const { domains, updateDomainPosition } = useDomainContext();
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLDivElement>(null);

  // Auto-arrange domains in a single row as a numbered list
  useEffect(() => {
    if (domains.length > 0) {
      const DOMAIN_WIDTH = 300; // Width of domain card + margin
      const DOMAIN_HEIGHT = 350; // Height of domain card + margin
      const START_X = 50;
      const START_Y = 100;

      domains.forEach((domain, index) => {
        updateDomainPosition(domain.id, {
          x: START_X,
          y: START_Y + index * DOMAIN_HEIGHT,
        });
      });
    }
  }, [domains, updateDomainPosition]);

  // Handle domain node dragging
  const handleMouseDown = (e: React.MouseEvent, domain: Domain) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setDragging(domain.id);
    setSelectedDomain(domain);
  };

  // Handle canvas dragging
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      setIsDraggingCanvas(true);
      setStartDragPos({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const domain = domains.find((d) => d.id === dragging);
        if (domain) {
          const newX = (e.clientX - dragOffset.x) / scale - canvasOffset.x;
          const newY = (e.clientY - dragOffset.y) / scale - canvasOffset.y;
          updateDomainPosition(domain.id, { x: newX, y: newY });
        }
      } else if (isDraggingCanvas) {
        const dx = e.clientX - startDragPos.x;
        const dy = e.clientY - startDragPos.y;
        setCanvasOffset((prev) => ({
          x: prev.x + dx / scale,
          y: prev.y + dy / scale,
        }));
        setStartDragPos({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
      setIsDraggingCanvas(false);
    };

    if (dragging || isDraggingCanvas) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [
    dragging,
    isDraggingCanvas,
    domains,
    dragOffset,
    scale,
    canvasOffset,
    startDragPos,
    updateDomainPosition,
  ]);

  // Handle wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.5, Math.min(2, scale + delta));
    onScaleChange(newScale);
  };

  // No dependency lines to render
  const renderDependencyLines = () => {
    return [];
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-slate-50 dark:bg-slate-900"
      onWheel={handleWheel}
      onMouseDown={handleCanvasMouseDown}
      ref={canvasRef}
    >
      <div
        className="absolute transition-transform duration-100 ease-linear"
        style={{
          transform: `scale(${scale}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`,
          transformOrigin: "0 0",
        }}
      >
        {domains.map((domain) => (
          <div
            key={domain.id}
            className="absolute"
            style={{
              left: `${domain.position.x}px`,
              top: `${domain.position.y}px`,
              cursor: dragging === domain.id ? "grabbing" : "grab",
            }}
            onMouseDown={(e) => handleMouseDown(e, domain)}
          >
            <DomainNode
              domain={domain}
              isSelected={selectedDomain?.id === domain.id}
              onSelect={setSelectedDomain}
            />
          </div>
        ))}
      </div>

      {/* Render dependency lines */}
      {renderDependencyLines()}
    </div>
  );
};

export default MindMapCanvas;

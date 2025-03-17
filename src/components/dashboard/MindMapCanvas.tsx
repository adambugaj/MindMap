import { useState, useRef, useEffect } from "react";
import { useDomainContext } from "@/context/DomainContext";
import DomainNode from "./DomainNode";
import DependencyLine from "./DependencyLine";
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

  // Auto-arrange domains in a hierarchical diagram
  useEffect(() => {
    if (domains.length > 0) {
      const CENTER_X = 600;
      const START_Y = 100;
      const LEVEL_HEIGHT = 200;
      const HORIZONTAL_SPACING = 320;

      // First level - main domain
      const mainDomain = domains[0];
      updateDomainPosition(mainDomain.id, {
        x: CENTER_X,
        y: START_Y,
      });

      // Second level - 3 domains in a row
      const secondLevelCount = Math.min(3, domains.length - 1);
      const secondLevelStartX =
        CENTER_X - ((secondLevelCount - 1) * HORIZONTAL_SPACING) / 2;

      for (let i = 0; i < secondLevelCount; i++) {
        const domain = domains[i + 1];
        if (domain) {
          updateDomainPosition(domain.id, {
            x: secondLevelStartX + i * HORIZONTAL_SPACING,
            y: START_Y + LEVEL_HEIGHT,
          });
        }
      }

      // Third level - remaining domains distributed evenly
      const thirdLevelCount = Math.max(0, domains.length - 4);
      if (thirdLevelCount > 0) {
        const thirdLevelStartX =
          CENTER_X - ((thirdLevelCount - 1) * HORIZONTAL_SPACING) / 2;

        for (let i = 0; i < thirdLevelCount; i++) {
          const domain = domains[i + 4];
          if (domain) {
            updateDomainPosition(domain.id, {
              x: thirdLevelStartX + i * HORIZONTAL_SPACING,
              y: START_Y + LEVEL_HEIGHT * 2,
            });
          }
        }
      }
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

  // Render dependency lines between nodes
  const renderDependencyLines = () => {
    const lines = [];

    if (domains.length > 0) {
      const mainDomain = domains[0];

      // Connect main domain to second level domains
      for (let i = 1; i < Math.min(4, domains.length); i++) {
        const childDomain = domains[i];
        lines.push(
          <DependencyLine
            key={`${mainDomain.id}-${childDomain.id}`}
            startX={mainDomain.position.x + 140} // Center of card
            startY={mainDomain.position.y + 150} // Bottom of card
            endX={childDomain.position.x + 140} // Center of card
            endY={childDomain.position.y} // Top of card
            showArrow={true}
          />,
        );
      }

      // Connect second level domains to third level domains
      for (let i = 1; i < Math.min(4, domains.length); i++) {
        const parentDomain = domains[i];
        const childStartIdx = 4 + (i - 1) * 3;

        for (
          let j = childStartIdx;
          j < Math.min(childStartIdx + 3, domains.length);
          j++
        ) {
          const childDomain = domains[j];
          if (childDomain) {
            lines.push(
              <DependencyLine
                key={`${parentDomain.id}-${childDomain.id}`}
                startX={parentDomain.position.x + 140} // Center of card
                startY={parentDomain.position.y + 150} // Bottom of card
                endX={childDomain.position.x + 140} // Center of card
                endY={childDomain.position.y} // Top of card
                showArrow={true}
              />,
            );
          }
        }
      }
    }

    return lines;
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

        {/* Render dependency lines */}
        {renderDependencyLines()}
      </div>
    </div>
  );
};

export default MindMapCanvas;

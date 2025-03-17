import { useEffect, useRef } from "react";

interface DependencyLineProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color?: string;
  thickness?: number;
  dashed?: boolean;
  showArrow?: boolean;
}

const DependencyLine = ({
  startX,
  startY,
  endX,
  endY,
  color = "#64748b",
  thickness = 2,
  dashed = false,
  showArrow = false,
}: DependencyLineProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Calculate canvas dimensions
    const width = Math.abs(endX - startX) + thickness * 2;
    const height = Math.abs(endY - startY) + thickness * 2;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Calculate offset to ensure line is within canvas
    const offsetX = Math.min(startX, endX) - thickness;
    const offsetY = Math.min(startY, endY) - thickness;

    // Adjust coordinates relative to canvas
    const x1 = startX - offsetX;
    const y1 = startY - offsetY;
    const x2 = endX - offsetX;
    const y2 = endY - offsetY;

    // Draw line
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = thickness;

    if (dashed) {
      ctx.setLineDash([5, 3]);
    }

    ctx.stroke();

    // Draw arrow if needed
    if (showArrow) {
      const angle = Math.atan2(y2 - y1, x2 - x1);
      const arrowSize = thickness * 4;

      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(
        x2 - arrowSize * Math.cos(angle - Math.PI / 6),
        y2 - arrowSize * Math.sin(angle - Math.PI / 6),
      );
      ctx.lineTo(
        x2 - arrowSize * Math.cos(angle + Math.PI / 6),
        y2 - arrowSize * Math.sin(angle + Math.PI / 6),
      );
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Position the canvas
    canvas.style.position = "absolute";
    canvas.style.left = `${offsetX}px`;
    canvas.style.top = `${offsetY}px`;
    canvas.style.pointerEvents = "none"; // Make it non-interactive
  }, [startX, startY, endX, endY, color, thickness, dashed, showArrow]);

  return <canvas ref={canvasRef} />;
};

export default DependencyLine;

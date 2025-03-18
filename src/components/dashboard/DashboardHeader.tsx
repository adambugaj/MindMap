import { Button } from "@/components/ui/button";
import { PlusCircle, ZoomIn, ZoomOut, Home, List, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DashboardHeaderProps {
  onAddDomain: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  viewMode?: "list" | "mindmap";
  onViewModeChange?: (mode: "list" | "mindmap") => void;
}

const DashboardHeader = ({
  onAddDomain = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onResetView = () => {},
  viewMode = "list",
  onViewModeChange = () => {},
}: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">PBN Domain Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={(value) =>
            value && onViewModeChange(value as "list" | "mindmap")
          }
        >
          <ToggleGroupItem value="list" aria-label="List View">
            <List className="h-4 w-4 mr-2" />
            List
          </ToggleGroupItem>
          <ToggleGroupItem value="mindmap" aria-label="Mind Map View">
            <Network className="h-4 w-4 mr-2" />
            Mind Map
          </ToggleGroupItem>
        </ToggleGroup>

        {viewMode === "mindmap" && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomIn}
              className="h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onZoomOut}
              className="h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onResetView}
              className="h-8 w-8"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>
        )}

        <Button onClick={onAddDomain}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;

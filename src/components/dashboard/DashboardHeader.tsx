import { Button } from "@/components/ui/button";
import { PlusCircle, ZoomIn, ZoomOut, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onAddDomain: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
}

const DashboardHeader = ({
  onAddDomain = () => {},
  onZoomIn = () => {},
  onZoomOut = () => {},
  onResetView = () => {},
}: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="w-full h-20 bg-background border-b border-border flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold">PBN Domain Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button onClick={onAddDomain}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;

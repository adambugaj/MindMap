import { useState, useEffect } from "react";
import { DomainProvider } from "@/context/DomainContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MindMapCanvas from "@/components/dashboard/MindMapCanvas";
import MobileView from "@/components/dashboard/MobileView";
import AddDomainDialog from "@/components/dashboard/AddDomainDialog";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(2, prev + 0.1));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.1));
  };

  const handleResetView = () => {
    setScale(1);
  };

  return (
    <DomainProvider>
      <div className="flex flex-col h-screen w-screen bg-background">
        {!isMobile && (
          <DashboardHeader
            onAddDomain={() => setShowAddDialog(true)}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onResetView={handleResetView}
          />
        )}

        <div className="flex-1 overflow-hidden">
          {isMobile ? (
            <MobileView />
          ) : (
            <MindMapCanvas scale={scale} onScaleChange={setScale} />
          )}
        </div>

        <AddDomainDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </div>
    </DomainProvider>
  );
};

export default Dashboard;

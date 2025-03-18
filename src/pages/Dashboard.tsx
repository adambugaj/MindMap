import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileView from "@/components/dashboard/MobileView";
import AddDomainDialog from "@/components/dashboard/AddDomainDialog";
import DomainList from "@/components/dashboard/DomainList";
import MindMapCanvas from "@/components/dashboard/MindMapCanvas";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "mindmap">("list");

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen bg-background">
      {!isMobile && (
        <DashboardHeader
          onAddDomain={() => setShowAddDialog(true)}
          onZoomIn={() => {}}
          onZoomOut={() => {}}
          onResetView={() => {}}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      )}

      <div className="flex-1 overflow-auto p-4">
        {isMobile ? (
          <MobileView />
        ) : viewMode === "list" ? (
          <DomainList />
        ) : (
          <MindMapCanvas />
        )}
      </div>

      <AddDomainDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default Dashboard;

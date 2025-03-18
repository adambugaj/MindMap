import { useState, useEffect } from "react";
import { DomainProvider } from "@/context/DomainContext";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MobileView from "@/components/dashboard/MobileView";
import AddDomainDialog from "@/components/dashboard/AddDomainDialog";
import DomainList from "@/components/dashboard/DomainList";

const Dashboard = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <DomainProvider>
      <div className="flex flex-col h-screen w-screen bg-background">
        {!isMobile && (
          <DashboardHeader
            onAddDomain={() => setShowAddDialog(true)}
            onZoomIn={() => {}}
            onZoomOut={() => {}}
            onResetView={() => {}}
          />
        )}

        <div className="flex-1 overflow-auto p-4">
          {isMobile ? <MobileView /> : <DomainList />}
        </div>

        <AddDomainDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </div>
    </DomainProvider>
  );
};

export default Dashboard;

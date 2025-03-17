import { useState } from "react";
import { useDomainContext } from "@/context/DomainContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, X } from "lucide-react";
import DomainNode from "./DomainNode";
import AddDomainDialog from "./AddDomainDialog";

const MobileView = () => {
  const { domains } = useDomainContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const filteredDomains = domains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.url.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <header className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-4">PBN Domain Mind Map</h1>

        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search domains..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-8"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchTerm("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {filteredDomains.length > 0 ? (
          filteredDomains.map((domain) => (
            <div key={domain.id} className="mb-4">
              <DomainNode domain={domain} />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? "No domains match your search"
                : "No domains added yet"}
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Domain
            </Button>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-border">
        <Button className="w-full" onClick={() => setShowAddDialog(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Domain
        </Button>
      </div>

      <AddDomainDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
    </div>
  );
};

export default MobileView;

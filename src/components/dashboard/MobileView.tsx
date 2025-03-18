import { useState } from "react";
import { useDomainContext } from "@/context/DomainContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PlusCircle,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Trash2,
} from "lucide-react";
import AddDomainDialog from "./AddDomainDialog";
import TaskStatusList from "./TaskStatusList";
import { Domain } from "@/types/domain";

const MobileView = () => {
  const { domains, removeDomain, updateTaskStatus } = useDomainContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [expandedDomains, setExpandedDomains] = useState<
    Record<string, boolean>
  >({});

  const filteredDomains = domains.filter(
    (domain) =>
      domain.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      domain.url.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const toggleExpanded = (domainId: string) => {
    setExpandedDomains((prev) => ({
      ...prev,
      [domainId]: !prev[domainId],
    }));
  };

  const handleTaskStatusChange = (
    domainId: string,
    taskId: string,
    completed: boolean,
  ) => {
    updateTaskStatus(domainId, taskId, completed);
  };

  const calculateProgress = (domain: Domain) => {
    const completedTasksCount = domain.tasks.filter(
      (task) => task.completed,
    ).length;
    const totalTasks = domain.tasks.length;
    return totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;
  };

  const getStatusColor = (progress: number) => {
    if (progress === 100) return "bg-green-500";
    if (progress > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full h-full bg-background flex flex-col">
      <header className="p-4 border-b border-border">
        <h1 className="text-xl font-bold mb-4">PBN Domain Dashboard</h1>

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
          filteredDomains.map((domain, index) => {
            const progress = calculateProgress(domain);
            const statusColor = getStatusColor(progress);
            const isExpanded = expandedDomains[domain.id] || false;
            const completedTasksCount = domain.tasks.filter(
              (task) => task.completed,
            ).length;
            const totalTasks = domain.tasks.length;

            return (
              <div key={domain.id} className="border rounded-lg p-3 bg-card">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold flex items-center">
                      <span className="mr-2">{index + 1}.</span>
                      {domain.name}
                    </div>
                    <a
                      href={domain.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground flex items-center hover:text-primary mt-1"
                    >
                      {domain.url}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDomain(domain.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>

                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      {completedTasksCount}/{totalTasks} tasks
                    </div>
                    <div className={`w-3 h-3 rounded-full ${statusColor}`} />
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`${statusColor} h-2 rounded-full transition-all duration-300 ease-in-out`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full flex items-center justify-center mt-2"
                  onClick={() => toggleExpanded(domain.id)}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-1" />
                      Hide Tasks
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-1" />
                      Show Tasks
                    </>
                  )}
                </Button>

                {isExpanded && (
                  <div className="mt-2 pt-2 border-t">
                    <TaskStatusList
                      tasks={domain.tasks}
                      onTaskStatusChange={(taskId, completed) =>
                        handleTaskStatusChange(domain.id, taskId, completed)
                      }
                      domainId={domain.id}
                    />
                  </div>
                )}
              </div>
            );
          })
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

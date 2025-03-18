import { useState } from "react";
import { useDomainContext } from "@/context/DomainContext";
import { Domain, Task } from "@/types/domain";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Trash2,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import TaskStatusList from "./TaskStatusList";
import AddTaskDialog from "./AddTaskDialog";

const DomainList = () => {
  const { domains, removeDomain, updateTaskStatus } = useDomainContext();
  const [expandedDomains, setExpandedDomains] = useState<
    Record<string, boolean>
  >({});
  const [addTaskDialogOpen, setAddTaskDialogOpen] = useState(false);
  const [selectedDomainId, setSelectedDomainId] = useState<string | null>(null);

  // Sort domains by creation date (newest first)
  const sortedDomains = [...domains].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
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

  const isTaskDisabled = (tasks: Task[], task: Task) => {
    if (!task.dependsOn || task.dependsOn.length === 0) return false;

    // Check if all dependencies are completed
    return !task.dependsOn.every((depId) => {
      const depTask = tasks.find((t) => t.id === depId);
      return depTask?.completed;
    });
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
    <div className="w-full bg-background p-4 rounded-md">
      {domains.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <p>
            No domains added yet. Click the "Add Domain" button to get started.
          </p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>URL</TableHead>
              <TableHead className="w-[180px]">Progress</TableHead>
              <TableHead className="hidden md:table-cell">Tasks</TableHead>
              <TableHead className="md:hidden w-[120px]">Tasks</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDomains.map((domain, index) => {
              const progress = calculateProgress(domain);
              const statusColor = getStatusColor(progress);
              const isExpanded = expandedDomains[domain.id] || false;
              const completedTasksCount = domain.tasks.filter(
                (task) => task.completed,
              ).length;
              const totalTasks = domain.tasks.length;

              return (
                <>
                  <TableRow key={domain.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold">
                      {domain.name}
                    </TableCell>
                    <TableCell>
                      <a
                        href={domain.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted-foreground flex items-center hover:text-primary"
                      >
                        {domain.url}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <div className="text-sm">
                            {completedTasksCount}/{totalTasks} tasks
                          </div>
                          <div
                            className={`w-3 h-3 rounded-full ${statusColor}`}
                          />
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`${statusColor} h-2 rounded-full transition-all duration-300 ease-in-out`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex flex-row gap-3 flex-wrap items-center">
                        {domain.tasks.map((task) => {
                          const isDisabled = isTaskDisabled(domain.tasks, task);
                          return (
                            <div
                              key={task.id}
                              className="flex items-center gap-1"
                            >
                              <Checkbox
                                id={`inline-task-${domain.id}-${task.id}`}
                                checked={task.completed}
                                onCheckedChange={(checked) => {
                                  handleTaskStatusChange(
                                    domain.id,
                                    task.id,
                                    checked === true,
                                  );
                                }}
                                disabled={isDisabled}
                                className="h-3.5 w-3.5"
                              />
                              <label
                                htmlFor={`inline-task-${domain.id}-${task.id}`}
                                className={`text-xs cursor-pointer ${task.completed ? "line-through text-muted-foreground" : ""} ${isDisabled ? "opacity-50" : ""}`}
                              >
                                {task.name}
                              </label>
                            </div>
                          );
                        })}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full"
                          onClick={() => {
                            setSelectedDomainId(domain.id);
                            setAddTaskDialogOpen(true);
                          }}
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="md:hidden">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full flex items-center justify-center"
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
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeDomain(domain.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                  {isExpanded && (
                    <TableRow>
                      <TableCell colSpan={6} className="p-0 border-t-0">
                        <div className="p-4 bg-muted/30">
                          <TaskStatusList
                            tasks={domain.tasks}
                            onTaskStatusChange={(taskId, completed) =>
                              handleTaskStatusChange(
                                domain.id,
                                taskId,
                                completed,
                              )
                            }
                            domainId={domain.id}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      )}

      {selectedDomainId && (
        <AddTaskDialog
          open={addTaskDialogOpen}
          onOpenChange={setAddTaskDialogOpen}
          domainId={selectedDomainId}
          existingTasks={
            domains.find((d) => d.id === selectedDomainId)?.tasks || []
          }
        />
      )}
    </div>
  );
};

export default DomainList;

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Domain } from "@/types/domain";
import { useDomainContext } from "@/context/DomainContext";
import { ExternalLink, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import TaskStatusList from "./TaskStatusList";

interface DomainNodeProps {
  domain: Domain;
  onSelect?: (domain: Domain) => void;
  isSelected?: boolean;
}

const DomainNode = ({
  domain,
  onSelect = () => {},
  isSelected = false,
}: DomainNodeProps) => {
  const [expanded, setExpanded] = useState(false);
  const { updateTaskStatus, removeDomain } = useDomainContext();

  const completedTasksCount = domain.tasks.filter(
    (task) => task.completed,
  ).length;
  const totalTasks = domain.tasks.length;
  const progress =
    totalTasks > 0 ? (completedTasksCount / totalTasks) * 100 : 0;

  const getStatusColor = () => {
    if (progress === 100) return "bg-green-500";
    if (progress > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleTaskStatusChange = (taskId: string, completed: boolean) => {
    updateTaskStatus(domain.id, taskId, completed);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeDomain(domain.id);
  };

  return (
    <Card
      className={`w-[280px] cursor-grab active:cursor-grabbing ${isSelected ? "ring-2 ring-primary" : ""} mb-4`}
      onClick={() => onSelect(domain)}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold truncate">
            {domain.name}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
          </Button>
        </div>
        <a
          href={domain.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground flex items-center hover:text-primary"
          onClick={(e) => e.stopPropagation()}
        >
          {domain.url}
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              Progress: {completedTasksCount}/{totalTasks} tasks
            </div>
            <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          </div>

          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className={`${getStatusColor()} h-2 rounded-full transition-all duration-300 ease-in-out`}
              style={{ width: `${progress}%` }}
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="w-full flex items-center justify-center mt-2"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
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

          {expanded && (
            <TaskStatusList
              tasks={domain.tasks}
              onTaskStatusChange={(taskId, completed) =>
                handleTaskStatusChange(taskId, completed)
              }
              domainId={domain.id}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DomainNode;

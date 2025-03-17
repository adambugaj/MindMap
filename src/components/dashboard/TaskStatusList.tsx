import { Task } from "@/types/domain";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface TaskStatusListProps {
  tasks: Task[];
  onTaskStatusChange: (taskId: string, completed: boolean) => void;
  domainId?: string;
}

const TaskStatusList = ({
  tasks = [],
  onTaskStatusChange = () => {},
  domainId = "",
}: TaskStatusListProps) => {
  const [newTaskName, setNewTaskName] = useState("");
  const { updateDomainTasks, removeDomainTask } = useDomainContext();

  // Sort tasks based on dependencies
  const sortedTasks = [...tasks].sort((a, b) => {
    // If b depends on a, a should come first
    if (b.dependsOn?.includes(a.id)) return -1;
    // If a depends on b, b should come first
    if (a.dependsOn?.includes(b.id)) return 1;
    // Otherwise maintain original order
    return 0;
  });

  const isTaskDisabled = (task: Task) => {
    if (!task.dependsOn || task.dependsOn.length === 0) return false;

    // Check if all dependencies are completed
    return !task.dependsOn.every((depId) => {
      const depTask = tasks.find((t) => t.id === depId);
      return depTask?.completed;
    });
  };

  const handleAddTask = () => {
    if (newTaskName.trim() && domainId) {
      const newTask: Task = {
        id: `custom-${Date.now()}`,
        name: newTaskName.trim(),
        completed: false,
      };
      updateDomainTasks(domainId, [...tasks, newTask]);
      setNewTaskName("");
    }
  };

  const handleRemoveTask = (taskId: string) => {
    if (domainId) {
      removeDomainTask(domainId, taskId);
    }
  };

  return (
    <div className="space-y-2 mt-2">
      {sortedTasks.map((task) => {
        const disabled = isTaskDisabled(task);
        const isDefaultTask = !task.id.startsWith("custom-");

        return (
          <div
            key={task.id}
            className={`flex items-center space-x-2 p-2 rounded-md ${disabled ? "opacity-50" : ""}`}
          >
            <Checkbox
              id={`task-${domainId}-${task.id}`}
              checked={task.completed}
              onCheckedChange={(checked) => {
                onTaskStatusChange(task.id, checked === true);
              }}
              disabled={disabled}
            />
            <label
              htmlFor={`task-${domainId}-${task.id}`}
              className={`text-sm cursor-pointer flex-grow ${task.completed ? "line-through text-muted-foreground" : ""}`}
            >
              {task.name}
            </label>
            {!isDefaultTask && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 p-0"
                onClick={() => handleRemoveTask(task.id)}
              >
                <Trash2 className="h-3 w-3 text-muted-foreground hover:text-destructive" />
              </Button>
            )}
          </div>
        );
      })}

      {/* Add new task */}
      <div className="flex items-center space-x-2 mt-4">
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Add new task..."
          className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={handleAddTask}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

import { useDomainContext } from "@/context/DomainContext";
export default TaskStatusList;

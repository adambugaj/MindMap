import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useDomainContext } from "@/context/DomainContext";
import { Task } from "@/types/domain";
import { v4 as uuidv4 } from "uuid";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  domainId: string;
  existingTasks: Task[];
}

const AddTaskDialog = ({
  open = false,
  onOpenChange = () => {},
  domainId,
  existingTasks,
}: AddTaskDialogProps) => {
  const [name, setName] = useState("");
  const [selectedDependencies, setSelectedDependencies] = useState<string[]>(
    [],
  );
  const [error, setError] = useState<string | null>(null);

  const { updateDomainTasks } = useDomainContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setError("Task name is required");
      return;
    }

    // Create new task
    const newTask: Task = {
      id: uuidv4(),
      name: name.trim(),
      completed: false,
      dependsOn:
        selectedDependencies.length > 0 ? selectedDependencies : undefined,
    };

    // Add task to domain
    const updatedTasks = [...existingTasks, newTask];
    updateDomainTasks(domainId, updatedTasks);

    // Reset form and close dialog
    setName("");
    setSelectedDependencies([]);
    setError(null);
    onOpenChange(false);
  };

  const handleDependencyChange = (taskId: string, checked: boolean) => {
    if (checked) {
      setSelectedDependencies([...selectedDependencies, taskId]);
    } else {
      setSelectedDependencies(
        selectedDependencies.filter((id) => id !== taskId),
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="task-name">Task Name</Label>
            <Input
              id="task-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>

          {existingTasks.length > 0 && (
            <div className="space-y-2">
              <Label>Dependencies (optional)</Label>
              <div className="space-y-2 max-h-40 overflow-y-auto p-2 border rounded-md">
                {existingTasks.map((task) => (
                  <div key={task.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dependency-${task.id}`}
                      checked={selectedDependencies.includes(task.id)}
                      onCheckedChange={(checked) =>
                        handleDependencyChange(task.id, checked === true)
                      }
                    />
                    <Label
                      htmlFor={`dependency-${task.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {task.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;

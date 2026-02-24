import { Pencil, Trash2, Check, X } from "lucide-react";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@repo/openapi";

type Task = { id: string; title: string; description: string };

export function TaskActions({ task }: { task: Task }) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const { error } = await apiClient.DELETE("/{id}", {
        params: { path: { id: task.id } },
      });
      if (error) throw new Error("Request failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task deleted");
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      const { error } = await apiClient.PUT("/{id}", {
      params: { path: { id: editedTask.id } },
      body: { title: editedTask.title, description: editedTask.description },
    })
    if (error) throw new Error("Request failed")
  },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsEditing(false);
      toast.success("Task updated");
    },
  });

  if (isEditing) {
    return (
      <div className="space-y-2 mt-2">
        <Input
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
          placeholder="Task title"
        />
        <textarea
          className="w-full border rounded-md p-2 text-sm resize-none min-h-16"
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          placeholder="Task description"
        />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending}
          >
            <Check className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setEditedTask(task); // reset to original values on cancel
              setIsEditing(false);
            }}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2 mt-2">
      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
        <Pencil className="w-4 h-4" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isPending}
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}

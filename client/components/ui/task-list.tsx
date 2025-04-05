// components/ui/task-list.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Define the structure of a task
interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

// Props for TaskList
interface TaskListProps {
  tasks: Task[];
}

// TaskList Component
export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} className="p-4">
          <CardHeader>
            <CardTitle className={task.completed ? "line-through" : ""}>
              {task.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {task.description || "No description provided."}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

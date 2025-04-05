import * as React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { TaskList } from "@/components/ui/task-list"; // Make sure this component exists

export default function Layout({ children }: { children: React.ReactNode }) {
  // Sample task data for demonstration
  const sampleTasks = [
    {
      id: 1,
      title: "Inspect Pipeline A",
      description: "Check for leaks and corrosion",
      completed: false,
    },
    {
      id: 2,
      title: "Review Inspection Report",
      description: "Analyze findings from yesterday",
      completed: true,
    },
    // Add more tasks as needed
  ];

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <main className="p-8">
        <SidebarTrigger />
        <h1 className="text-4xl font-bold mb-6 text-center">
          Welcome to Inspector Page
        </h1>
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Task List</h2>
          <TaskList tasks={sampleTasks} />
        </section>
        {children}
      </main>
    </SidebarProvider>
  );
}

import * as React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { TaskList } from "@/components/ui/task-list";
import { PipelineMap } from "@/components/ui/pipeline-map";
import { InspectionReport } from "@/components/ui/inspection-report";

export default function InspectorDashboard({ children }: { children?: React.ReactNode }) {
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

  // Sample pipeline data for map display
  const samplePipelines = [
    {
      id: 1,
      name: "Pipeline A",
      status: "Pending Inspection",
      location: { lat: 40.7128, lng: -74.0060 },
    },
    {
      id: 2,
      name: "Pipeline B",
      status: "Inspected",
      location: { lat: 34.0522, lng: -118.2437 },
    },
    // Add more pipelines as needed
  ];

  // Sample inspection report data
  const sampleReport = {
    inspectedCount: 1,
    pendingCount: 1,
    remarks: "One pipeline still pending inspection. Further analysis required on Pipeline A.",
  };

  // Additional details (e.g., notifications, upcoming tasks, etc.)
  const additionalDetails = "Additional status messages and upcoming inspection alerts will appear here.";

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <main className="p-8 space-y-8">
        <SidebarTrigger />
        <h1 className="text-4xl font-bold mb-6 text-center">
          Welcome to Inspector Page
        </h1>

        {/* Task List Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Task List</h2>
          <TaskList tasks={sampleTasks} />
        </section>

        {/* Pipeline Map Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Pipeline Map</h2>
          <PipelineMap pipelines={samplePipelines} />
        </section>

        {/* Inspection Report Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Inspection Report</h2>
          <InspectionReport report={sampleReport} />
        </section>

        {/* Additional Details Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Additional Details</h2>
          <p>{additionalDetails}</p>
        </section>

        {children}
      </main>
    </SidebarProvider>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Task = {
  id: number;
  task: string;
  description: string;
  assignedTo: string;
  status: string;
  pipelineSection: string;
  location: string;
  lastInspection: string;
  nextInspection: string;
  maintenanceHistory: string;
  criticalIssues: string;
  recommendedAction: string;
  additionalNotes: string;
};

export default function InspectorDashboard() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Expanded sample tasks data with more detailed fields.
  const tasks: Task[] = [
    {
      id: 1,
      task: "Inspect Pipeline A",
      description:
        "Perform a detailed check for leaks, corrosion, and pressure abnormalities along Pipeline A. Verify instrument readings and inspect for any structural weaknesses.",
      assignedTo: "Inspector John",
      status: "Pending",
      pipelineSection: "Section 1-5",
      location: "North Field",
      lastInspection: "2025-04-01",
      nextInspection: "2025-04-15",
      maintenanceHistory: "Minor leak patched on 2025-03-20",
      criticalIssues: "Minor leak near a joint and early signs of corrosion.",
      recommendedAction: "Schedule preventive maintenance and re-inspect in 2 weeks.",
      additionalNotes: "Monitor pressure sensors closely for any deviations.",
    },
    {
      id: 2,
      task: "Inspect Pipeline B",
      description:
        "Visual inspection completed for Pipeline B. Additional checks on valve integrity and joint wear are recommended.",
      assignedTo: "Inspector Jane",
      status: "Completed",
      pipelineSection: "Section 6-10",
      location: "East Field",
      lastInspection: "2025-03-28",
      nextInspection: "2025-04-12",
      maintenanceHistory: "Replaced valve on 2025-03-15",
      criticalIssues: "No significant issues detected.",
      recommendedAction: "Review inspection documentation and verify calibrations.",
      additionalNotes: "Routine maintenance appears effective.",
    },
    {
      id: 3,
      task: "Inspect Pipeline C",
      description:
        "Scheduled inspection pending for Pipeline C. Confirm time slots with operations team and check pump station efficiency.",
      assignedTo: "Inspector Alex",
      status: "Assigned",
      pipelineSection: "Section 11-15",
      location: "South Field",
      lastInspection: "2025-03-20",
      nextInspection: "2025-04-20",
      maintenanceHistory: "No maintenance actions recorded",
      criticalIssues: "Potential risk of blockage if debris accumulates.",
      recommendedAction: "Clean pipeline and inspect pump station performance.",
      additionalNotes: "Ensure safety protocols are followed during cleaning.",
    },
  ];

  // Click handler: When a row is clicked, set the selected task.
  const handleRowClick = (task: Task) => {
    setSelectedTask(task);
  };

  // Handler to return to the tasks list.
  const handleBack = () => {
    setSelectedTask(null);
  };

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-4 px-4 lg:px-6">
            {selectedTask ? (
              // Detailed Task View
              <Card className="p-6 text-sm">
                <CardHeader className="mb-4">
                  <CardTitle className="text-lg font-semibold">
                    {selectedTask.task}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Description:</strong>
                    <p className="ml-2">{selectedTask.description}</p>
                  </div>
                  <div>
                    <strong>Assigned To:</strong>
                    <p className="ml-2">{selectedTask.assignedTo}</p>
                  </div>
                  <div>
                    <strong>Status:</strong>
                    <p className="ml-2">{selectedTask.status}</p>
                  </div>
                  <div>
                    <strong>Pipeline Section:</strong>
                    <p className="ml-2">{selectedTask.pipelineSection}</p>
                  </div>
                  <div>
                    <strong>Location:</strong>
                    <p className="ml-2">{selectedTask.location}</p>
                  </div>
                  <div>
                    <strong>Last Inspection:</strong>
                    <p className="ml-2">{selectedTask.lastInspection}</p>
                  </div>
                  <div>
                    <strong>Next Inspection:</strong>
                    <p className="ml-2">{selectedTask.nextInspection}</p>
                  </div>
                  <div>
                    <strong>Maintenance History:</strong>
                    <p className="ml-2">{selectedTask.maintenanceHistory}</p>
                  </div>
                  <div>
                    <strong>Critical Issues:</strong>
                    <p className="ml-2">{selectedTask.criticalIssues}</p>
                  </div>
                  <div>
                    <strong>Recommended Action:</strong>
                    <p className="ml-2">{selectedTask.recommendedAction}</p>
                  </div>
                  <div>
                    <strong>Additional Notes:</strong>
                    <p className="ml-2">{selectedTask.additionalNotes}</p>
                  </div>
                </CardContent>
                <CardFooter className="mt-4">
                  <Button onClick={handleBack} size="sm">
                    Back to Tasks
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <>
                <div className="flex flex-col gap-3 py-4">
                  <h1 className="text-lg font-semibold">Inspector Dashboard</h1>
                </div>
                {/* Tasks Table Section */}
                <section>
                  <h2 className="text-lg font-semibold mb-3">
                    Assigned Inspections
                  </h2>
                  <Table>
                    <TableCaption className="text-sm">
                      A list of your assigned inspections.
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[150px] text-sm">Task</TableHead>
                        <TableHead className="text-sm">Description</TableHead>
                        <TableHead className="text-sm">Assigned To</TableHead>
                        <TableHead className="text-sm">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((item) => (
                        <TableRow
                          key={item.id}
                          onClick={() => handleRowClick(item)}
                          className="cursor-pointer hover:bg-muted transition-colors"
                        >
                          <TableCell className="font-medium text-sm">
                            {item.task}
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.description}
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.assignedTo}
                          </TableCell>
                          <TableCell className="text-sm">
                            {item.status}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </section>
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

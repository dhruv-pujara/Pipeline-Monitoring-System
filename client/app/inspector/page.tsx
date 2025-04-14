import * as React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function InspectorDashboard() {
  // Sample tasks data for assigned inspections
  const tasks = [
    {
      id: 1,
      task: "Inspect Pipeline A",
      description: "Inspection for leaks and rust",
      assignedTo: "Inspector John",
      status: "Pending",
    },
    {
      id: 2,
      task: "Inspect Pipeline B",
      description: "Visual inspection completed",
      assignedTo: "Inspector Jane",
      status: "Completed",
    },
    {
      id: 3,
      task: "Inspect Pipeline C",
      description: "Scheduled inspection pending",
      assignedTo: "Inspector Alex",
      status: "Assigned",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <main className="p-8 space-y-8">
        <SidebarTrigger />
        <h1 className="text-4xl font-bold mb-6 text-center">
          Inspector Dashboard
        </h1>

        {/* Tasks Table Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Assigned Inspections</h2>
          <Table>
            <TableCaption>A list of your assigned inspections.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Task</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.task}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>{item.assignedTo}</TableCell>
                  <TableCell>{item.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </main>
    </SidebarProvider>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type ReportFile = {
  id: number;
  fileName: string;
  title: string;
  createdAt: string;
  description: string;
};

export default function ViewFilesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Sample static data representing files (reports) from the database
  const files: ReportFile[] = [
    {
      id: 1,
      fileName: "pipeline_a_report.pdf",
      title: "Pipeline A Inspection Report",
      createdAt: "2025-04-01",
      description: "Detailed inspection report for Pipeline A, section 1-5 with maintenance notes.",
    },
    {
      id: 2,
      fileName: "pipeline_b_report.pdf",
      title: "Pipeline B Inspection Report",
      createdAt: "2025-03-28",
      description: "Final review of Pipeline B inspection. Valve integrity and joint wear details included.",
    },
    {
      id: 3,
      fileName: "pipeline_c_report.pdf",
      title: "Pipeline C Inspection Report",
      createdAt: "2025-03-20",
      description: "Inspection overview for Pipeline C covering pump station status and scheduling info.",
    },
  ];

  // Filter the files list based on the search query (case-insensitive)
  const filteredFiles = files.filter((file) => {
    const query = searchQuery.toLowerCase();
    return (
      file.fileName.toLowerCase().includes(query) ||
      file.title.toLowerCase().includes(query) ||
      file.description.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col gap-6 px-4 lg:px-6 py-8">
          <h1 className="text-xl font-semibold">View Files</h1>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={() => setSearchQuery("")}>Clear</Button>
          </div>
          <Table>
            <TableCaption>
              A list of inspection reports retrieved from the database.
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">File Name</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFiles.length > 0 ? (
                filteredFiles.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>{file.fileName}</TableCell>
                    <TableCell>{file.title}</TableCell>
                    <TableCell>{file.createdAt}</TableCell>
                    <TableCell>{file.description}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    No reports found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

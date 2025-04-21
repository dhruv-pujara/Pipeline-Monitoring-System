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
import { Card } from "@/components/ui/card";

type ReportFile = {
  inspectionID: number;
  pipelineID: number;
  inspectorID: number;
  segmentID: number;
  inspectionDate: string;
  findings: string;
};

export default function ViewFilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [files, setFiles] = useState<ReportFile[]>([
    {
      inspectionID: 1,
      pipelineID: 1001,
      inspectorID: 501,
      segmentID: 301,
      inspectionDate: "2025-04-01",
      findings: "Minor corrosion found near segment joint.",
    },
    {
      inspectionID: 2,
      pipelineID: 1002,
      inspectorID: 502,
      segmentID: 302,
      inspectionDate: "2025-03-28",
      findings: "Valve wear within acceptable limits.",
    },
    {
      inspectionID: 3,
      pipelineID: 1003,
      inspectorID: 503,
      segmentID: 303,
      inspectionDate: "2025-03-20",
      findings: "No significant issues detected.",
    },
    {
      inspectionID: 4,
      pipelineID: 1004,
      inspectorID: 504,
      segmentID: 304,
      inspectionDate: "2025-03-15",
      findings: "Oil residue detected near inspection port.",
    },
    {
      inspectionID: 5,
      pipelineID: 1005,
      inspectorID: 505,
      segmentID: 305,
      inspectionDate: "2025-03-10",
      findings: "Slight deformation in pipe bend area.",
    },
  ]);

  const filteredFiles = files.filter((file) => {
    const query = searchQuery.toLowerCase();
    return (
      file.pipelineID.toString().includes(query) ||
      file.inspectorID.toString().includes(query) ||
      file.inspectionDate.toLowerCase().includes(query) ||
      file.findings.toLowerCase().includes(query)
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar role="owner" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col gap-6 px-4 lg:px-6 py-8 min-h-screen">
          <h1 className="text-xl font-semibold">Inspection Reports</h1>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search inspections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={() => setSearchQuery("")}>Clear</Button>
          </div>

          <div className="relative overflow-x-auto">
            <Table>
              <TableCaption>A list of recent inspection reports.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Pipeline ID</TableHead>
                  <TableHead>Inspector ID</TableHead>
                  <TableHead>Segment ID</TableHead>
                  <TableHead>Inspection Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <TableRow
                      key={file.inspectionID}
                      className="relative group hover:bg-muted cursor-pointer"
                    >
                      <TableCell>{file.pipelineID}</TableCell>
                      <TableCell>{file.inspectorID}</TableCell>
                      <TableCell>{file.segmentID}</TableCell>
                      <TableCell>{file.inspectionDate}</TableCell>

                      {/* Hover Card */}
                      <div className="absolute z-10 left-0 top-0 translate-x-full w-80 p-4 bg-white border rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <Card className="p-4 space-y-2">
                          <div className="font-bold text-lg">
                            Inspection #{file.inspectionID}
                          </div>
                          <div className="text-sm">
                            <strong>Pipeline:</strong> {file.pipelineID}
                          </div>
                          <div className="text-sm">
                            <strong>Segment:</strong> {file.segmentID}
                          </div>
                          <div className="text-sm">
                            <strong>Inspector:</strong> {file.inspectorID}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Date:</strong> {file.inspectionDate}
                          </div>
                          <div className="text-sm">
                            <strong>Findings:</strong> {file.findings}
                          </div>
                        </Card>
                      </div>
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
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

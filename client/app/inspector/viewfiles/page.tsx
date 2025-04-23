"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell, TableCaption,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface Inspection {
  InspectionID: number;
  PipelineID: number;
  SegmentID: number;
  InspectionDate: string;
  Findings: string;
}

interface Issue {
  IssueID: number;
  IssueType: string;
  Severity: string;
}

export default function ViewFilesPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selected, setSelected] = useState<Inspection | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const inspectorID = user?.id;
    if (!inspectorID) return;

    fetch("http://localhost:8800/inspector/completed-inspections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspectorID }),
    })
      .then((res) => res.json())
      .then((data: Inspection[]) => setInspections(data))
      .catch((err) => console.error("Failed to fetch inspections:", err));
  }, []);

  useEffect(() => {
    if (!selected) return;
    fetch(`http://localhost:8800/inspection/${selected.InspectionID}/issues`)
      .then((res) => res.json())
      .then((data: Issue[]) => setIssues(data))
      .catch((err) => console.error("Failed to fetch issues:", err));
  }, [selected]);

  if (!selected) {
    return (
      <SidebarProvider>
        <AppSidebar role="inspector" />
        <SidebarInset>
          <SiteHeader />
          <main className="p-8">
            <h1 className="text-2xl font-bold mb-4">View Your Completed Work</h1>
            <Table>
              <TableCaption>Click a row to view issues</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Inspection ID</TableHead>
                  <TableHead>Pipeline ID</TableHead>
                  <TableHead>Segment ID</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inspections.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No completed inspections found.
                    </TableCell>
                  </TableRow>
                )}
                {inspections.map((insp) => (
                  <TableRow
                    key={insp.InspectionID}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => setSelected(insp)}
                  >
                    <TableCell>{insp.InspectionID}</TableCell>
                    <TableCell>{insp.PipelineID}</TableCell>
                    <TableCell>{insp.SegmentID}</TableCell>
                    <TableCell>{insp.InspectionDate.substring(0, 10)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-8 space-y-6">
          <Button variant="outline" onClick={() => setSelected(null)}>
            ← Back to list
          </Button>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              Inspection #{selected.InspectionID}
            </h2>
            <p><strong>Pipeline:</strong> {selected.PipelineID}</p>
            <p><strong>Segment:</strong> {selected.SegmentID}</p>
            <p><strong>Date:</strong> {selected.InspectionDate.substring(0, 10)}</p>
            <p><strong>Findings:</strong> {selected.Findings}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Reported Issues</h3>
            {issues.length === 0 ? (
              <p>No issues reported for this inspection.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Issue ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issues.map((issue) => (
                    <TableRow key={issue.IssueID}>
                      <TableCell>{issue.IssueID}</TableCell>
                      <TableCell>{issue.IssueType}</TableCell>
                      <TableCell>{issue.Severity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

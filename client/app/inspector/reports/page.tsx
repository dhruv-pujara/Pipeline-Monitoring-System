"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import ReportIssueCard from "@/components/ui/report-issue-card";

interface Inspection {
  InspectionID: number;
  PipelineID: number;
  InspectorID: number;
  SegmentID: number;
  InspectionDate: string | null;
  Findings: string | null;
}

export default function ReportsPage() {
  // TODO: pull this from your auth/session
  const inspectorID = 201;

  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selected, setSelected] = useState<Inspection | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8800/inspections?inspectorID=${inspectorID}`)
      .then((res) => res.json())
      .then((data: Inspection[]) => {
        // keep only those with both date + findings set
        const completed = data.filter(
          (i) => i.InspectionDate !== null && i.Findings !== null
        );
        setInspections(completed);
      })
      .catch((err) =>
        console.error("Error fetching completed inspections:", err)
      );
  }, [inspectorID]);

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-8 flex flex-col gap-6">
          {!selected ? (
            <>
              <h1 className="text-2xl font-bold">Completed Inspections</h1>
              <Table>
                <TableCaption>Click an inspection to report issues</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((insp) => (
                    <TableRow
                      key={insp.InspectionID}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() => setSelected(insp)}
                    >
                      <TableCell>{insp.InspectionID}</TableCell>
                      <TableCell>{insp.PipelineID}</TableCell>
                      <TableCell>{insp.SegmentID}</TableCell>
                      <TableCell>{insp.InspectorID}</TableCell>
                      <TableCell>{insp.InspectionDate}</TableCell>
                    </TableRow>
                  ))}
                  {inspections.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No completed inspections found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">
                Inspection #{selected.InspectionID}
              </h1>
              <ReportIssueCard inspectionID={selected.InspectionID} />
              <button
                className="mt-4 text-sm text-gray-500 underline"
                onClick={() => setSelected(null)}
              >
                ← Back to list
              </button>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

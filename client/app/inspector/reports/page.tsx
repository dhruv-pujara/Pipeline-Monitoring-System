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
  InspectionDate: string;
  Findings: string;
}

export default function ReportsPage() {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selected, setSelected] = useState<Inspection | null>(null);

  useEffect(() => {
    // <<< DUMMY DATA FOR REPORTS >>>
    const dummyReports: Inspection[] = [
      {
        InspectionID: 1001,
        PipelineID:   501,
        InspectorID:  201,
        SegmentID:    11,
        InspectionDate: "2025-04-10",
        Findings:      "No leaks found. All valves operating normally.",
      },
      {
        InspectionID: 1002,
        PipelineID:   502,
        InspectorID:  201,
        SegmentID:    22,
        InspectionDate: "2025-04-12",
        Findings:      "Minor corrosion at joint #4. Recommended touch‑up.",
      },
      {
        InspectionID: 1003,
        PipelineID:   503,
        InspectorID:  201,
        SegmentID:    33,
        InspectionDate: "2025-04-15",
        Findings:      "Pressure drop detected. Blockage cleared.",
      },
    ];

    // Only keep “completed” ones (Findings non‑empty)
    setInspections(dummyReports.filter((r) => Boolean(r.Findings)));
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-8 bg-black text-white flex flex-col gap-6">
          {!selected ? (
            <>
              <h1 className="text-2xl font-bold">Completed Inspections</h1>
              <Table className="bg-black text-white">
                <TableCaption className="text-white">
                  Click one to report issues
                </TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-white">ID</TableHead>
                    <TableHead className="text-white">Pipeline</TableHead>
                    <TableHead className="text-white">Segment</TableHead>
                    <TableHead className="text-white">Inspector</TableHead>
                    <TableHead className="text-white">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((insp) => (
                    <TableRow
                      key={insp.InspectionID}
                      className="cursor-pointer bg-black hover:bg-gray-800 transition-colors"
                      onClick={() => setSelected(insp)}
                    >
                      <TableCell className="text-white">
                        {insp.InspectionID}
                      </TableCell>
                      <TableCell className="text-white">
                        {insp.PipelineID}
                      </TableCell>
                      <TableCell className="text-white">
                        {insp.SegmentID}
                      </TableCell>
                      <TableCell className="text-white">
                        {insp.InspectorID}
                      </TableCell>
                      <TableCell className="text-white">
                        {insp.InspectionDate}
                      </TableCell>
                    </TableRow>
                  ))}
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
                className="mt-4 text-sm text-gray-400 underline"
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
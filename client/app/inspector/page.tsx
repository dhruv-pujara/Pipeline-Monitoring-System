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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Inspection {
  InspectionID: number;
  PipelineID: number;
  InspectorID: number;
  SegmentID: number;
  InspectionDate: string | null;
  Findings: string | null;
  instructions: string;
}

export default function InspectorDashboard() {
  const inspectorID = 201;
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selected, setSelected] = useState<Inspection | null>(null);

  // Form state
  const [date, setDate] = useState("");
  const [findings, setFindings] = useState("");

  useEffect(() => {
    // Dummy data
    const dummy: Inspection[] = [
      {
        InspectionID: 1,
        PipelineID: 101,
        InspectorID: 201,
        SegmentID: 11,
        InspectionDate: null,
        Findings: null,
        instructions:
          "Inspect all joints and valves in Segment 11 for corrosion and leaks.",
      },
      {
        InspectionID: 2,
        PipelineID: 102,
        InspectorID: 201,
        SegmentID: 22,
        InspectionDate: null,
        Findings: null,
        instructions:
          "Check pressure gauges and structural integrity in Segment 22.",
      },
    ];
    setInspections(dummy.filter((i) => i.InspectorID === inspectorID));
  }, [inspectorID]);

  // Save partial or final updates
  async function saveField(updated: {
    inspectionDate?: string;
    findings?: string;
  }) {
    if (!selected) return;
    const payload = {
      inspectionID: selected.InspectionID,
      inspectionDate: updated.inspectionDate ?? date,
      findings: updated.findings ?? findings,
    };
    await fetch(
      "http://localhost/pipeline-monitoring/api/updateInspection.php",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    // Update local state
    setInspections((prev) =>
      prev.map((i) =>
        i.InspectionID === selected.InspectionID
          ? {
              ...i,
              InspectionDate: payload.inspectionDate || null,
              Findings: payload.findings || null,
            }
          : i
      )
    );
    setSelected((prev) =>
      prev
        ? {
            ...prev,
            InspectionDate: payload.inspectionDate || null,
            Findings: payload.findings || null,
          }
        : null
    );
  }

  const onDateBlur = () => saveField({ inspectionDate: date });
  const onFindingsBlur = () => saveField({ findings });

  const statusOf = (i: Inspection) => {
    if (i.Findings) return "Completed";
    if (i.InspectionDate) return "Draft";
    return "Pending";
  };

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-8 bg-black text-white space-y-6">
          {/* Dynamic title */}
          <h1 className="text-2xl font-semibold">
            {selected
              ? `Inspection #${selected.InspectionID}`
              : "Inspector Dashboard"}
          </h1>

          {!selected ? (
            <section className="space-y-4">
              <h2 className="text-xl font-medium">Your Assigned Inspections</h2>
              <Table className="bg-black text-white">
                <TableCaption>Click to resume or start</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Inspector</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.map((insp) => (
                    <TableRow
                      key={insp.InspectionID}
                      className="bg-black cursor-pointer"
                      onClick={() => {
                        setSelected(insp);
                        setDate(insp.InspectionDate || "");
                        setFindings(insp.Findings || "");
                      }}
                    >
                      <TableCell>{insp.InspectionID}</TableCell>
                      <TableCell>{insp.PipelineID}</TableCell>
                      <TableCell>{insp.SegmentID}</TableCell>
                      <TableCell>{insp.InspectorID}</TableCell>
                      <TableCell>{statusOf(insp)}</TableCell>
                    </TableRow>
                  ))}
                  {!inspections.length && (
                    <TableRow className="bg-black">
                      <TableCell colSpan={5} className="text-center">
                        No assignments.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </section>
          ) : (
            <section className="space-y-6">
              {/* Instructions */}
              <Card className="p-4 bg-black border border-gray-700">
                <CardContent>
                  <p className="text-sm">
                    <strong>Instructions:</strong> {selected.instructions}
                  </p>
                </CardContent>
              </Card>

              {/* Fixed details */}
              <Card className="p-4 bg-black border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Details</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {([
                    ["Inspection ID", selected.InspectionID],
                    ["Pipeline ID", selected.PipelineID],
                    ["Segment ID", selected.SegmentID],
                    ["Inspector ID", selected.InspectorID],
                  ] as [string, number][]).map(([lbl, val]) => (
                    <div key={lbl} className="grid gap-1">
                      <label className="text-xs">{lbl}</label>
                      <Input
                        value={String(val)}
                        disabled
                        className="bg-black text-white border-gray-600"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Findings form */}
              <Card className="p-4 bg-black border border-gray-700">
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Your Findings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-1">
                    <label className="text-xs">Inspection Date</label>
                    <Input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      onBlur={onDateBlur}
                      className="bg-black text-white border-gray-600"
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs">Findings</label>
                    <Textarea
                      rows={4}
                      value={findings}
                      onChange={(e) => setFindings(e.target.value)}
                      onBlur={onFindingsBlur}
                      className="bg-black text-white border-gray-600 placeholder-gray-500"
                      placeholder="Describe your findings…"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Back
                  </Button>
                  {/* Only show Submit when both fields are non-empty */}
                  {date && findings ? (
                    <Button onClick={() => saveField({ inspectionDate: date, findings })}>
                      Submit
                    </Button>
                  ) : (
                    <span className="text-sm text-gray-500">Incomplete</span>
                  )}
                </CardFooter>
              </Card>
            </section>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
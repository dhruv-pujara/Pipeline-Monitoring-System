"use client";

import React, { useState, useEffect } from "react";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import {
  Table, TableHeader, TableRow, TableHead,
  TableBody, TableCell, TableCaption,
} from "@/components/ui/table";
import {
  Card, CardHeader, CardTitle, CardContent, CardFooter,
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
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [selected, setSelected] = useState<Inspection | null>(null);
  const [date, setDate] = useState("");
  const [findings, setFindings] = useState("");

  // Fetch assigned inspections for this inspector
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    fetch("http://localhost:8800/my-inspections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspectorID: user.id }),
    })
      .then((res) => res.json())
      .then((data: Inspection[]) => setInspections(data))
      .catch((err) => console.error("Error fetching inspections:", err));
  }, []);

  // Determine if selected inspection has already been submitted
  const isSubmitted = Boolean(selected?.InspectionDate) && Boolean(selected?.Findings);

  // Save date or findings
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

    try {
      const res = await fetch("http://localhost:8800/updateInspection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // Update local state
      setInspections((prev) =>
        prev.map((i) =>
          i.InspectionID === payload.inspectionID
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
    } catch (err) {
      console.error("Save failed:", err);
      alert("Save failed: " + (err as Error).message);
    }
  }

  // Blur handlers
  const onDateBlur = () => saveField({ inspectionDate: date });
  const onFindingsBlur = () => saveField({ findings });

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-8 space-y-6">
          <h1 className="text-2xl font-semibold">
            {selected
              ? `Inspection #${selected.InspectionID}`
              : "Inspector Dashboard"}
          </h1>

          {!selected ? (
            <section className="space-y-4">
              <h2 className="text-xl font-medium">Your Assigned Inspections</h2>
              <Table>
                <TableCaption>Click to resume or start</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Pipeline</TableHead>
                    <TableHead>Segment</TableHead>
                    <TableHead>Inspector</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inspections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No assignments.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspections.map((insp) => (
                      <TableRow
                        key={insp.InspectionID}
                        className="cursor-pointer"
                        onClick={() => {
                          setSelected(insp);
                          const formattedDate = insp.InspectionDate
                            ? new Date(insp.InspectionDate).toISOString().split("T")[0]
                            : "";
                          setDate(formattedDate);
                          setFindings(insp.Findings || "");
                        }}
                      >
                        <TableCell>{insp.InspectionID}</TableCell>
                        <TableCell>{insp.PipelineID}</TableCell>
                        <TableCell>{insp.SegmentID}</TableCell>
                        <TableCell>{insp.InspectorID}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </section>
          ) : (
            <section className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">Details</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                  {(
                    [
                      ["Inspection ID", selected.InspectionID],
                      ["Pipeline ID", selected.PipelineID],
                      ["Segment ID", selected.SegmentID],
                      ["Inspector ID", selected.InspectorID],
                    ] as [string, number][]
                  ).map(([lbl, val]) => (
                    <div key={lbl} className="grid gap-1">
                      <label className="text-xs">{lbl}</label>
                      <Input value={String(val)} disabled />
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
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
                      disabled={isSubmitted}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs">Findings</label>
                    <Textarea
                      rows={4}
                      value={findings}
                      onChange={(e) => setFindings(e.target.value)}
                      onBlur={onFindingsBlur}
                      placeholder="Describe your findings…"
                      disabled={isSubmitted}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={() => setSelected(null)}>
                    Back
                  </Button>
                  {isSubmitted ? (
                    <Button disabled>Submitted</Button>
                  ) : date && findings ? (
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

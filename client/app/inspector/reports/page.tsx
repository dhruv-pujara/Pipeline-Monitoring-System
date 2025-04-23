"use client";

import React, { useState, useEffect } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableCaption,
} from "@/components/ui/table";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";

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
  const [issueType, setIssueType] = useState("");
  const [severity, setSeverity] = useState("");
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [inspectorID, setInspectorID] = useState<number | null>(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const id = user?.id;
    setInspectorID(id);

    fetch("http://localhost:8800/inspector/completed-inspections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inspectorID: id }),
    })
      .then((res) => res.json())
      .then((data: Inspection[]) => {
        const completed = data.filter(
          (i) => i.InspectionDate !== "0000-00-00" && i.Findings !== "-"
        );
        setInspections(completed);
      })
      .catch((err) => console.error("Error fetching completed inspections:", err));
  }, []);

  const submitIssue = async () => {
    if (!selected) return;

    try {
      const res = await fetch("http://localhost:8800/inspector/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          InspectionID: selected.InspectionID,
          IssueType: issueType,
          Severity: severity,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit issue");

      setIssueType("");
      setSeverity("");
      setJustSubmitted(true);
    } catch (err) {
      alert("Issue submission failed");
      console.error(err);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <div className="p-8 flex flex-col gap-6">
          {!selected ? (
            <>
              <h1 className="text-2xl font-bold">Report Issues for your Inspections</h1>
              <Table>
                <TableCaption>Click to report an issue</TableCaption>
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
                  {inspections.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No completed inspections available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    inspections.map((insp) => (
                      <TableRow
                        key={insp.InspectionID}
                        className="cursor-pointer hover:bg-gray-100"
                        onClick={() => {
                          setSelected(insp);
                          setJustSubmitted(false);
                        }}
                      >
                        <TableCell>{insp.InspectionID}</TableCell>
                        <TableCell>{insp.PipelineID}</TableCell>
                        <TableCell>{insp.SegmentID}</TableCell>
                        <TableCell>{insp.InspectorID}</TableCell>
                        <TableCell>{insp.InspectionDate.substring(0, 10)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </>
          ) : (
            <div className="space-y-6">
              <h1 className="text-2xl font-bold">Inspection #{selected.InspectionID}</h1>

              <Card className="border rounded-lg">
                <CardHeader>
                  <CardTitle>Inspection Details</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Pipeline ID</label>
                    <Input value={selected.PipelineID} disabled />
                  </div>
                  <div>
                    <label className="text-sm">Segment ID</label>
                    <Input value={selected.SegmentID} disabled />
                  </div>
                  <div>
                    <label className="text-sm">Inspector ID</label>
                    <Input value={inspectorID ?? selected.InspectorID} disabled />
                  </div>
                  <div>
                    <label className="text-sm">Date</label>
                    <Input value={selected.InspectionDate.substring(0, 10)} disabled />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm">Findings</label>
                    <Textarea value={selected.Findings} disabled />
                  </div>
                </CardContent>
              </Card>

              <Card className="border rounded-lg">
                <CardHeader>
                  <CardTitle>Report an Issue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm">Inspection ID</label>
                    <Input value={selected.InspectionID} disabled />
                  </div>
                  <div>
                    <label className="text-sm">Issue Type</label>
                    <Textarea
                      rows={3}
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      placeholder="Describe the issue (e.g., Leak, Corrosion)"
                    />
                  </div>
                  <div>
                    <label className="text-sm">Severity</label>
                    <Select value={severity} onValueChange={setSeverity}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Low", "Medium", "High", "Critical"].map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={submitIssue}>
                    {justSubmitted ? "Report Another Issue" : "Report Issue"}
                  </Button>
                </CardContent>
              </Card>

              <Button
                variant="outline"
                className="text-sm"
                onClick={() => setSelected(null)}
              >
                ← Back to list
              </Button>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

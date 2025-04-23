"use client";

import React, { useState, useEffect } from "react";
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

type Inspection = {
  InspectionID: number;
  PipelineID: number;
  InspectorID: number;
  SegmentID: number;
  InspectionDate: string; // ISO string
  Findings: string;
};

export default function ViewFilesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInspections = async () => {
      const token = localStorage.getItem("token") || "";
      try {
        const res = await fetch("http://localhost:8800/inspections", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: Inspection[] = await res.json();
        setInspections(data);
      } catch (err) {
        console.error("Error fetching inspections:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInspections();
  }, []);

  const filtered = inspections.filter((insp) => {
    const q = searchQuery.toLowerCase();
    return (
      insp.PipelineID.toString().includes(q) ||
      insp.InspectorID.toString().includes(q) ||
      insp.SegmentID.toString().includes(q) ||
      insp.InspectionDate.substring(0,10).includes(q) ||
      insp.Findings.toLowerCase().includes(q)
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

          {loading ? (
            <p>Loading…</p>
          ) : (
            // <-- changed here: add overflow-y-auto & max-h-[500px]
            <div className="relative overflow-x-auto overflow-y-auto-h-[500px] mt-6">
              <Table>
                <TableCaption>A list of recent inspection reports.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pipeline ID</TableHead>
                    <TableHead>Inspector ID</TableHead>
                    <TableHead>Segment ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Findings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((insp) => (
                      <TableRow
                        key={insp.InspectionID}
                        className="relative group hover:bg-muted cursor-pointer"
                      >
                        <TableCell>{insp.PipelineID}</TableCell>
                        <TableCell>{insp.InspectorID}</TableCell>
                        <TableCell>{insp.SegmentID}</TableCell>
                        <TableCell>
                          {insp.InspectionDate.substring(0,10)}
                        </TableCell>
                        <TableCell>{insp.Findings}</TableCell>

                        {/* Hover Card */}
                        <div className="absolute z-10 left-0 top-0 translate-x-full w-80 p-4 bg-white border rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <Card className="p-4 space-y-2">
                            <div className="font-bold text-lg">
                              Inspection #{insp.InspectionID}
                            </div>
                            <div className="text-sm">
                              <strong>Pipeline:</strong> {insp.PipelineID}
                            </div>
                            <div className="text-sm">
                              <strong>Segment:</strong> {insp.SegmentID}
                            </div>
                            <div className="text-sm">
                              <strong>Inspector:</strong> {insp.InspectorID}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <strong>Date:</strong>{" "}
                              {insp.InspectionDate.substring(0,10)}
                            </div>
                            <div className="text-sm">
                              <strong>Findings:</strong> {insp.Findings}
                            </div>
                          </Card>
                        </div>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No reports found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

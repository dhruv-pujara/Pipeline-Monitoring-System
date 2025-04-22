

"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

// Type definitions
type Inspector = { InspectorID: number; Name: string; Phone?: string; Email?: string };
type Pipeline = { PipelineID: number; Location: string };
type Segment = { SegmentID: number; PipelineID: number; PressureLevel: number; FlowRate: number; LastModifiedDate: string };
type Assigned = { AssignedInspections: string; InspectorID: number };
type TableType = "inspector" | "pipeline" | "segment";

export default function Page() {
  const [inspectors, setInspectors] = useState<Inspector[]>([]);
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [assigned, setAssigned] = useState<Assigned[]>([]);
  const [activeTable, setActiveTable] = useState<TableType | null>(null);

  const [form, setForm] = useState({
    inspectorId: "",
    pipelineId: "",
    segmentId: "",
    inspectionDate: ""
  });

  useEffect(() => {
    fetch("http://localhost:8800/inspectors").then(res => res.json()).then(setInspectors);
    fetch("http://localhost:8800/pipelines").then(res => res.json()).then(setPipelines);
    fetch("http://localhost:8800/segments").then(res => res.json()).then(setSegments);
    fetch("http://localhost:8800/assigned").then(res => res.json()).then(setAssigned);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:8800/assign-inspection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    if (res.ok) {
      alert(data.message);
    } else {
      alert("Failed to assign inspection");
    }
  };

  const handleRowClick = (type: TableType, item: any) => {
    const idKey = type === "inspector" ? "InspectorID" : `${type.charAt(0).toUpperCase() + type.slice(1)}ID`;
    const selectedId = item[idKey];

    if (selectedId !== undefined) {
      setForm(prev => ({
        ...prev,
        [`${type}Id`]: selectedId.toString()
      }));
    } else {
      console.warn("ID not found in row:", item);
    }
  };

  const renderTable = (type: TableType) => {
    let data: any[] = [];
  
    if (type === "inspector") {
      data = inspectors.map(i => ({
        InspectorID: i.InspectorID,
        Name: i.Name,
        Phone: i.Phone,
        Email: i.Email
      }));
    }
  
    if (type === "pipeline") {
      data = pipelines;
    }
  
    if (type === "segment") {
      data = form.pipelineId
        ? segments.filter(seg => seg.PipelineID.toString() === form.pipelineId)
        : segments;
    }
  
    return (
      <Table className="mt-4">
        <TableHeader>
          <TableRow>
            {Object.keys(data[0] || {}).map(key => (
              <TableHead key={key}>{key}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={index}
              onClick={() => handleRowClick(type, item)}
              className="cursor-pointer hover:bg-gray-100"
            >
              {Object.values(item).map((val, i) => (
                <TableCell key={i}>
                  {typeof val === "string" || typeof val === "number" ? val : JSON.stringify(val)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };
  

  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          <h1 className="text-2xl font-bold mb-6">Inspection Assignment Dashboard</h1>

          <form onSubmit={handleAssign} className="space-y-4 max-w-xl">
            <div>
              <Label>Inspector ID</Label>
              <Input name="inspectorId" value={form.inspectorId} onChange={handleChange} />
            </div>
            <div>
              <Label>Pipeline ID</Label>
              <Input name="pipelineId" value={form.pipelineId} onChange={handleChange} />
            </div>
            <div>
              <Label>Segment ID</Label>
              <Input name="segmentId" value={form.segmentId} onChange={handleChange} />
            </div>
            <Button type="submit">Assign Inspection</Button>
          </form>

          <div className="flex space-x-4 mt-10">
            <Button variant="outline" onClick={() => setActiveTable("inspector")}>Show Inspectors</Button>
            <Button variant="outline" onClick={() => setActiveTable("pipeline")}>Show Pipelines</Button>
            <Button variant="outline" onClick={() => setActiveTable("segment")}>Show Segments</Button>
          </div>

          {activeTable && renderTable(activeTable)}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


// import { AppSidebar } from "@/components/ui/app-sidebar"
// import { ChartAreaInteractive } from "@/components/ui/chart-area-interactive"
// import { DataTable } from "@/components/ui/data-table"
// import { SectionCards } from "@/components/ui/section-cards"
// import { SiteHeader } from "@/components/ui/site-header"
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

// export default function Page() {
//   return (
//     <SidebarProvider>
//       <AppSidebar role="admin" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//               <div className="px-4 lg:px-6">
//                 <h1 className="text-2xl font-bold">Inspections</h1>
//               </div>

//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }
'use client'
import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Page() {
  const [inspectors, setInspectors] = useState([]);
  const [pipelines, setPipelines] = useState([]);
  const [segments, setSegments] = useState([]);
  const [assigned, setAssigned] = useState([]);

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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAssign = async (e) => {
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

  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">
          <h1 className="text-2xl font-bold mb-6">Inspection Assignment Dashboard</h1>

          <form onSubmit={handleAssign} className="space-y-4">
            <div>
              <Label>Inspector</Label>
              <Select onValueChange={(val) => setForm(prev => ({ ...prev, inspectorId: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Inspector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {inspectors.map(i => (
                      <SelectItem key={i.id} value={i.id.toString()}>{i.name}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Pipeline</Label>
              <Select onValueChange={(val) => setForm(prev => ({ ...prev, pipelineId: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Pipeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {pipelines.map(p => (
                      <SelectItem key={p.PipelineID} value={p.PipelineID.toString()}>{p.Location}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Segment</Label>
              <Select onValueChange={(val) => setForm(prev => ({ ...prev, segmentId: val }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {segments.map(s => (
                      <SelectItem key={s.SegmentID} value={s.SegmentID.toString()}>{s.SegmentID}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Inspection Date</Label>
              <Input name="inspectionDate" type="date" value={form.inspectionDate} onChange={handleChange} />
            </div>

            <Button type="submit">Assign Inspection</Button>
          </form>

          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-2">Assigned Inspections</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assigned ID</TableHead>
                  <TableHead>Inspector ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assigned.map(a => (
                  <TableRow key={`${a.AssignedInspections}-${a.InspectorID}`}>
                    <TableCell>{a.AssignedInspections}</TableCell>
                    <TableCell>{a.InspectorID}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

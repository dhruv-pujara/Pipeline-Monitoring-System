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
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type Pipeline = {
  PipelineID: number;
  Location: string;
  Diameter: number;
  Material: string;
  Status: string;
  InstallationDate: string;
  Longitude: number;
  Latitude: number;
};

type Segment = {
  SegmentID: number;
  PipelineID: number;
  PressureLevel: number;
  FlowRate: number;
  LastModifiedDate: string;
};

export default function Page() {
  const [search, setSearch] = useState("");
  const [pipelines, setPipelines] = useState<Pipeline[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token") || "";

  const [toDelete, setToDelete] = useState<{ type: "pipeline" | "segment"; id: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [showPipelineForm, setShowPipelineForm] = useState(false);
  const [pipelineForm, setPipelineForm] = useState<Partial<Pipeline>>({
    Location: "",
    Diameter: undefined,
    Material: "",
    Status: "Active",
    InstallationDate: "",
    Longitude: undefined,
    Latitude: undefined,
  });

  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [segmentForm, setSegmentForm] = useState<Partial<Segment>>({
    PipelineID: undefined,
    PressureLevel: undefined,
    FlowRate: undefined,
    LastModifiedDate: "",
  });

  async function fetchData() {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("http://localhost:8800/pipelines", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("http://localhost:8800/segments",  { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!pRes.ok || !sRes.ok) throw new Error("Failed to load data");
      setPipelines(await pRes.json());
      setSegments(await sRes.json());
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { fetchData(); }, []);

  async function doDelete() {
    if (!toDelete) return;
    try {
      const url = `http://localhost:8800/${toDelete.type === "pipeline" ? "pipelines" : "segments"}/${toDelete.id}`;
      const res = await fetch(url, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(await res.text());
      setSuccessMsg(`${toDelete.type === "pipeline" ? "Pipeline" : "Segment"} deleted`);
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setToDelete(null);
    }
  }

  async function handleAddPipeline() {
    const { Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude } = pipelineForm;
    if (!Location || Diameter == null || !Material || !Status || !InstallationDate || Longitude == null || Latitude == null) {
      setErrorMsg("Please fill in all pipeline fields.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8800/pipelines", {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccessMsg("Pipeline added successfully");
      setShowPipelineForm(false);
      setPipelineForm({ Location:"", Diameter:undefined, Material:"", Status:"Active", InstallationDate:"", Longitude:undefined, Latitude:undefined });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  }

  async function handleAddSegment() {
    const { PipelineID, PressureLevel, FlowRate, LastModifiedDate } = segmentForm;
    if (PipelineID == null || !pipelines.find(p => p.PipelineID === PipelineID)) {
      setErrorMsg("Pipeline doesn't exist");
      return;
    }
    if (PipelineID == null || PressureLevel == null || FlowRate == null || !LastModifiedDate) {
      setErrorMsg("Please fill in all segment fields.");
      return;
    }
    try {
      const res = await fetch("http://localhost:8800/segments", {
        method: "POST",
        headers: { "Content-Type":"application/json", Authorization:`Bearer ${token}` },
        body: JSON.stringify({ PipelineID, PressureLevel, FlowRate, LastModifiedDate }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSuccessMsg("Segment added successfully");
      setShowSegmentForm(false);
      setSegmentForm({ PipelineID:undefined, PressureLevel:undefined, FlowRate:undefined, LastModifiedDate:"" });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.message);
    }
  }

  const q = search.toLowerCase();
  const filteredPipelines = pipelines.filter(p =>
    p.PipelineID.toString().includes(q) ||
    p.Location.toLowerCase().includes(q) ||
    p.Material.toLowerCase().includes(q) ||
    p.Status.toLowerCase().includes(q)
  );
  const filteredSegments = segments.filter(s =>
    s.SegmentID.toString().includes(q) ||
    s.PipelineID.toString().includes(q)
  );

  return (
    <SidebarProvider>
      <AppSidebar role="owner" />
      <SidebarInset>
        <SiteHeader />
        <main className="p-4 space-y-6">
          <h1 className="text-2xl font-bold">Pipelines & Segments</h1>

          <div className="flex gap-2">
            <Input placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
            <Button onClick={() => setSearch("")}>Clear</Button>
          </div>

          {loading && <p>Loading…</p>}

          {/* Pipelines Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Pipelines</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Diameter</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Installed</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPipelines.map(p => (
                  <TableRow key={p.PipelineID}>
                    <TableCell>{p.PipelineID}</TableCell>
                    <TableCell>{p.Location}</TableCell>
                    <TableCell>{p.Diameter}</TableCell>
                    <TableCell>{p.Material}</TableCell>
                    <TableCell>{p.Status}</TableCell>
                    <TableCell>{p.InstallationDate.substring(0,10)}</TableCell>
                    <TableCell>{p.Longitude}</TableCell>
                    <TableCell>{p.Latitude}</TableCell>
                    <TableCell>
                      <AlertDialog
                        open={toDelete?.type==="pipeline"&&toDelete.id===p.PipelineID}
                        onOpenChange={open=>!open&&setToDelete(null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" onClick={()=>setToDelete({type:"pipeline",id:p.PipelineID})}>Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Pipeline?</AlertDialogTitle>
                            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={doDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredPipelines.length===0 && (
                  <TableRow><TableCell colSpan={9} className="text-center">No pipelines.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Add Pipeline Form */}
          {!showPipelineForm ? (
            <Button onClick={()=>setShowPipelineForm(true)}>Add New Pipeline</Button>
          ) : (
            <div className="p-4 border rounded space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input placeholder="Location" value={pipelineForm.Location||""} onChange={e=>setPipelineForm(f=>({...f,Location:e.target.value}))}/>
                <Input type="number" placeholder="Diameter" value={pipelineForm.Diameter??""} onChange={e=>setPipelineForm(f=>({...f,Diameter:e.target.value?parseInt(e.target.value):undefined}))}/>
                <Input placeholder="Material" value={pipelineForm.Material||""} onChange={e=>setPipelineForm(f=>({...f,Material:e.target.value}))}/>
                <Input placeholder="Status" value={pipelineForm.Status||""} onChange={e=>setPipelineForm(f=>({...f,Status:e.target.value}))}/>
                <Input type="date" placeholder="Installed" value={pipelineForm.InstallationDate||""} onChange={e=>setPipelineForm(f=>({...f,InstallationDate:e.target.value}))}/>
                <Input type="number" step="any" placeholder="Longitude" value={pipelineForm.Longitude??""} onChange={e=>setPipelineForm(f=>({...f,Longitude:e.target.value?parseFloat(e.target.value):undefined}))}/>
                <Input type="number" step="any" placeholder="Latitude" value={pipelineForm.Latitude??""} onChange={e=>setPipelineForm(f=>({...f,Latitude:e.target.value?parseFloat(e.target.value):undefined}))}/>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddPipeline}>Save</Button>
                <Button variant="outline" onClick={()=>setShowPipelineForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Segments Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>Segments</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>PipelineID</TableHead>
                  <TableHead>PressureLevel</TableHead>
                  <TableHead>FlowRate</TableHead>
                  <TableHead>LastModifiedDate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSegments.map(s => (
                  <TableRow key={s.SegmentID}>
                    <TableCell>{s.SegmentID}</TableCell>
                    <TableCell>{s.PipelineID}</TableCell>
                    <TableCell>{s.PressureLevel}</TableCell>
                    <TableCell>{s.FlowRate}</TableCell>
                    <TableCell>{s.LastModifiedDate.substring(0,10)}</TableCell>
                    <TableCell>
                      <AlertDialog
                        open={toDelete?.type==="segment"&&toDelete.id===s.SegmentID}
                        onOpenChange={open=>!open&&setToDelete(null)}
                      >
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" onClick={()=>setToDelete({type:"segment",id:s.SegmentID})}>Delete</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Segment?</AlertDialogTitle>
                            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={doDelete}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredSegments.length===0 && (
                  <TableRow><TableCell colSpan={6} className="text-center">No segments.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Add Segment Form */}
          {!showSegmentForm ? (
            <Button onClick={()=>setShowSegmentForm(true)}>Add New Segment</Button>
          ) : (
            <div className="p-4 border rounded space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input type="number" placeholder="PipelineID" value={segmentForm.PipelineID??""} onChange={e=>setSegmentForm(f=>({...f,PipelineID:e.target.value?parseInt(e.target.value):undefined}))}/>
                <Input type="number" placeholder="PressureLevel" value={segmentForm.PressureLevel??""} onChange={e=>setSegmentForm(f=>({...f,PressureLevel:e.target.value?parseInt(e.target.value):undefined}))}/>
                <Input type="number" placeholder="FlowRate" value={segmentForm.FlowRate??""} onChange={e=>setSegmentForm(f=>({...f,FlowRate:e.target.value?parseInt(e.target.value):undefined}))}/>
                <Input type="date" placeholder="LastModifiedDate" value={segmentForm.LastModifiedDate||""} onChange={e=>setSegmentForm(f=>({...f,LastModifiedDate:e.target.value}))}/>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddSegment}>Save</Button>
                <Button variant="outline" onClick={()=>setShowSegmentForm(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {/* Error Dialog */}
          {errorMsg && (
            <AlertDialog open onOpenChange={()=>setErrorMsg(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Error</AlertDialogTitle>
                  <AlertDialogDescription>{errorMsg}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={()=>setErrorMsg(null)}>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          {/* Success Dialog */}
          {successMsg && (
            <AlertDialog open onOpenChange={()=>setSuccessMsg(null)}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Success</AlertDialogTitle>
                  <AlertDialogDescription>{successMsg}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogAction onClick={()=>setSuccessMsg(null)}>OK</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

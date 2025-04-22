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

  // Pipeline form state
  const [showPipelineForm, setShowPipelineForm] = useState(false);
  const [pipelineForm, setPipelineForm] = useState<{
    Location: string;
    Diameter?: number;
    Material: string;
    Status: string;
    InstallationDate: string;
    Longitude?: number;
    Latitude?: number;
  }>({
    Location: "",
    Diameter: undefined,
    Material: "",
    Status: "Active",
    InstallationDate: "",
    Longitude: undefined,
    Latitude: undefined,
  });

  // Segment form state
  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [segmentForm, setSegmentForm] = useState<{
    PipelineID?: number;
    PressureLevel?: number;
    FlowRate?: number;
    LastModifiedDate: string;
  }>({
    PipelineID: undefined,
    PressureLevel: undefined,
    FlowRate: undefined,
    LastModifiedDate: "",
  });

  const token = localStorage.getItem("token") || "";

  // Fetch pipelines & segments
  const fetchData = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("http://localhost:8800/pipelines", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8800/segments", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const [pData, sData] = await Promise.all([pRes.json(), sRes.json()]);
      setPipelines(Array.isArray(pData) ? pData : []);
      setSegments(Array.isArray(sData) ? sData : []);
    } catch (err) {
      alert("Failed to load data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Delete helper
  const deleteWithConfirm = async (
    url: string,
    onSuccess: () => void,
    message: string
  ) => {
    if (!confirm(message)) return;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      if (!res.ok) {
        alert("Delete failed: " + text);
        return;
      }
      onSuccess();
    } catch (err: any) {
      alert("Error deleting: " + err.message);
      console.error(err);
    }
  };

  // Add pipeline
  const handleAddPipeline = async () => {
    const {
      Location,
      Diameter,
      Material,
      Status,
      InstallationDate,
      Longitude,
      Latitude,
    } = pipelineForm;

    if (
      !Location ||
      Diameter == null ||
      !Material ||
      !Status ||
      !InstallationDate ||
      Longitude == null ||
      Latitude == null
    ) {
      alert("Please fill in all pipeline fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8800/pipelines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Location,
          Diameter,
          Material,
          Status,
          InstallationDate,
          Longitude,
          Latitude,
        }),
      });
      const text = await res.text();
      if (!res.ok) {
        alert("Add pipeline failed: " + text);
        return;
      }
      setShowPipelineForm(false);
      setPipelineForm({
        Location: "",
        Diameter: undefined,
        Material: "",
        Status: "Active",
        InstallationDate: "",
        Longitude: undefined,
        Latitude: undefined,
      });
      await fetchData();
    } catch (err: any) {
      alert("Error adding pipeline: " + err.message);
      console.error(err);
    }
  };

  // Add segment
  const handleAddSegment = async () => {
    const { PipelineID, PressureLevel, FlowRate, LastModifiedDate } =
      segmentForm;

    if (
      PipelineID == null ||
      PressureLevel == null ||
      FlowRate == null ||
      !LastModifiedDate
    ) {
      alert("Please fill in all segment fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8800/segments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          PipelineID,
          PressureLevel,
          FlowRate,
          LastModifiedDate,
        }),
      });
      const text = await res.text();
      if (!res.ok) {
        alert("Add segment failed: " + text);
        return;
      }
      setShowSegmentForm(false);
      setSegmentForm({
        PipelineID: undefined,
        PressureLevel: undefined,
        FlowRate: undefined,
        LastModifiedDate: "",
      });
      await fetchData();
    } catch (err: any) {
      alert("Error adding segment: " + err.message);
      console.error(err);
    }
  };

  // Filtering
  const q = search.toLowerCase();
  const filteredPipelines = pipelines.filter(
    (p) =>
      p.PipelineID.toString().includes(q) ||
      p.Location.toLowerCase().includes(q)
  );
  const filteredSegments = segments.filter(
    (s) =>
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

          {/* Search */}
          <div className="flex gap-2">
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={() => setSearch("")}>Clear</Button>
          </div>

          {loading ? (
            <p>Loading…</p>
          ) : (
            <>
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
                      <TableHead>Lon</TableHead>
                      <TableHead>Lat</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPipelines.map((p) => (
                      <TableRow key={p.PipelineID}>
                        <TableCell>{p.PipelineID}</TableCell>
                        <TableCell>{p.Location}</TableCell>
                        <TableCell>{p.Diameter}</TableCell>
                        <TableCell>{p.Material}</TableCell>
                        <TableCell>{p.Status}</TableCell>
                        <TableCell>
                          {p.InstallationDate.substring(0, 10)}
                        </TableCell>
                        <TableCell>{p.Longitude}</TableCell>
                        <TableCell>{p.Latitude}</TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              deleteWithConfirm(
                                `http://localhost:8800/pipelines/${p.PipelineID}`,
                                fetchData,
                                `Delete pipeline #${p.PipelineID}?`
                              )
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredPipelines.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center">
                          No pipelines.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Add Pipeline Form */}
              <div>
                {!showPipelineForm ? (
                  <Button onClick={() => setShowPipelineForm(true)}>
                    Add New Pipeline
                  </Button>
                ) : (
                  <div className="p-4 border rounded space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Location"
                        value={pipelineForm.Location}
                        onChange={(e) =>
                          setPipelineForm((f) => ({
                            ...f,
                            Location: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Diameter"
                        value={pipelineForm.Diameter ?? ""}
                        onChange={(e) =>
                          setPipelineForm((f) => ({
                            ...f,
                            Diameter: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        } />
                      <Input
                        placeholder="Material"
                        value={pipelineForm.Material}
                        onChange={(e) =>
                          setPipelineForm((f) => ({
                            ...f,
                            Material: e.target.value,
                          }))
                        }
                      />

                      {/* Fixed Status select */}
                      <select
                        name="Status"
                        value={pipelineForm.Status}
                        onChange={(e) =>
                          setPipelineForm((f) => ({
                            ...f,
                            Status: e.target.value,
                          }))
                        }
                        className="col-span-2 p-2 border rounded"
                      >
                        <option value="" disabled hidden>
                          Status
                        </option>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Under Maintenance">
                          Under Maintenance
                        </option>
                      </select>

                      <Input
                        type="date"
                        placeholder="Installed"
                        value={pipelineForm.InstallationDate}
                        onChange={(e) =>
                          setPipelineForm((f) => ({
                            ...f,
                            InstallationDate: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Longitude"
                        step="any"
                        value={pipelineForm.Longitude ?? ""}
                        onChange={(e) =>
                          setPipelineForm((f) => ({
                            ...f,
                            Longitude: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Latitude"
                        step="any"
                        value={pipelineForm.Latitude ?? ""}
                        onChange={(e) =>
                          setPipelineForm((f) => ({
                            ...f,
                            Latitude: e.target.value
                              ? parseFloat(e.target.value)
                              : undefined,
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddPipeline}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowPipelineForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Segments Table */}
              <div className="mt-6 overflow-x-auto">
                <Table>
                  <TableCaption>Segments</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Pipeline</TableHead>
                      <TableHead>Pressure</TableHead>
                      <TableHead>Flow</TableHead>
                      <TableHead>Modified</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSegments.map((s) => (
                      <TableRow key={s.SegmentID}>
                        <TableCell>{s.SegmentID}</TableCell>
                        <TableCell>{s.PipelineID}</TableCell>
                        <TableCell>{s.PressureLevel}</TableCell>
                        <TableCell>{s.FlowRate}</TableCell>
                        <TableCell>
                          {s.LastModifiedDate.substring(0, 10)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              deleteWithConfirm(
                                `http://localhost:8800/segments/${s.SegmentID}`,
                                fetchData,
                                `Delete segment #${s.SegmentID}?`
                              )
                            }
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredSegments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center">
                          No segments.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Add Segment Form */}
              <div className="mt-4">
                {!showSegmentForm ? (
                  <Button onClick={() => setShowSegmentForm(true)}>
                    Add New Segment
                  </Button>
                ) : (
                  <div className="p-4 border rounded space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        type="number"
                        placeholder="Pipeline ID"
                        value={segmentForm.PipelineID ?? ""}
                        onChange={(e) =>
                          setSegmentForm((f) => ({
                            ...f,
                            PipelineID: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Pressure Level"
                        value={segmentForm.PressureLevel ?? ""}
                        onChange={(e) =>
                          setSegmentForm((f) => ({
                            ...f,
                            PressureLevel: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Flow Rate"
                        value={segmentForm.FlowRate ?? ""}
                        onChange={(e) =>
                          setSegmentForm((f) => ({
                            ...f,
                            FlowRate: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="date"
                        placeholder="Last Modified"
                        value={segmentForm.LastModifiedDate}
                        onChange={(e) =>
                          setSegmentForm((f) => ({
                            ...f,
                            LastModifiedDate: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddSegment}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowSegmentForm(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

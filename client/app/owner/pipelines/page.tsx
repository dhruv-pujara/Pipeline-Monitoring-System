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

  const [showPipelineForm, setShowPipelineForm] = useState(false);
  const [newPipeline, setNewPipeline] = useState<Partial<Pipeline>>({
    PipelineID: undefined,
    Location: "",
    Diameter: undefined,
    Material: "",
    Status: "Active",
    InstallationDate: "",
    Longitude: undefined,
    Latitude: undefined,
  });

  const [showSegmentForm, setShowSegmentForm] = useState(false);
  const [newSegment, setNewSegment] = useState<Partial<Segment>>({
    SegmentID: undefined,
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
      if (Array.isArray(pData)) setPipelines(pData);
      if (Array.isArray(sData)) setSegments(sData);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add a new pipeline
  const handleAddPipeline = async () => {
    console.log("Adding pipeline:", newPipeline);
    const res = await fetch("http://localhost:8800/pipelines", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newPipeline),
    });
    if (res.ok) {
      setShowPipelineForm(false);
      setNewPipeline({
        PipelineID: undefined,
        Location: "",
        Diameter: undefined,
        Material: "",
        Status: "Active",
        InstallationDate: "",
        Longitude: undefined,
        Latitude: undefined,
      });
      await fetchData();
    } else {
      console.error("Add pipeline failed:", await res.text());
    }
  };

  // Add a new segment
  const handleAddSegment = async () => {
    console.log("Adding segment:", newSegment);
    const res = await fetch("http://localhost:8800/segments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newSegment),
    });
    if (res.ok) {
      setShowSegmentForm(false);
      setNewSegment({
        SegmentID: undefined,
        PipelineID: undefined,
        PressureLevel: undefined,
        FlowRate: undefined,
        LastModifiedDate: "",
      });
      await fetchData();
    } else {
      console.error("Add segment failed:", await res.text());
    }
  };

  // Delete helper
  const deleteWithConfirm = async (
    url: string,
    onSuccess: () => void,
    message: string
  ) => {
    if (!confirm(message)) return;
    const res = await fetch(url, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) onSuccess();
    else console.error("Delete failed:", await res.text());
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
                                `Are you sure you want to delete pipeline #${p.PipelineID}?`
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
                        type="number"
                        placeholder="Pipeline ID"
                        value={newPipeline.PipelineID ?? ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            PipelineID: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        placeholder="Location"
                        value={newPipeline.Location || ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            Location: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Diameter"
                        value={newPipeline.Diameter ?? ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            Diameter: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        placeholder="Material"
                        value={newPipeline.Material || ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            Material: e.target.value,
                          }))
                        }
                      />
                      <Input
                        placeholder="Status"
                        value={newPipeline.Status || ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            Status: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="date"
                        placeholder="Installed"
                        value={newPipeline.InstallationDate || ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            InstallationDate: e.target.value,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Longitude"
                        value={newPipeline.Longitude ?? ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            Longitude: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Latitude"
                        value={newPipeline.Latitude ?? ""}
                        onChange={(e) =>
                          setNewPipeline((prev) => ({
                            ...prev,
                            Latitude: e.target.value
                              ? parseInt(e.target.value, 10)
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
                                `Are you sure you want to delete segment #${s.SegmentID}?`
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
                        placeholder="Segment ID"
                        value={newSegment.SegmentID ?? ""}
                        onChange={(e) =>
                          setNewSegment((prev) => ({
                            ...prev,
                            SegmentID: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Pipeline ID"
                        value={newSegment.PipelineID ?? ""}
                        onChange={(e) =>
                          setNewSegment((prev) => ({
                            ...prev,
                            PipelineID: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Pressure Level"
                        value={newSegment.PressureLevel ?? ""}
                        onChange={(e) =>
                          setNewSegment((prev) => ({
                            ...prev,
                            PressureLevel: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="number"
                        placeholder="Flow Rate"
                        value={newSegment.FlowRate ?? ""}
                        onChange={(e) =>
                          setNewSegment((prev) => ({
                            ...prev,
                            FlowRate: e.target.value
                              ? parseInt(e.target.value, 10)
                              : undefined,
                          }))
                        }
                      />
                      <Input
                        type="date"
                        placeholder="Last Modified"
                        value={newSegment.LastModifiedDate || ""}
                        onChange={(e) =>
                          setNewSegment((prev) => ({
                            ...prev,
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

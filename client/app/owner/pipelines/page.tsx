"use client";

import * as React from "react";
import { useState } from "react";
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

export default function ViewPipelinesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      PipelineID: 1001,
      Location: "Site A",
      Diameter: 36,
      Material: "Steel",
      Status: "Active",
      InstallationDate: "2023-06-01",
      Longitude: -75.1234,
      Latitude: 39.9876,
    },
    {
      PipelineID: 1002,
      Location: "Site B",
      Diameter: 42,
      Material: "PVC",
      Status: "Inactive",
      InstallationDate: "2022-05-15",
      Longitude: -73.9876,
      Latitude: 40.1234,
    },
    {
      PipelineID: 1003,
      Location: "Site C",
      Diameter: 24,
      Material: "Copper",
      Status: "Active",
      InstallationDate: "2024-01-10",
      Longitude: -77.2345,
      Latitude: 38.5432,
    },
    {
      PipelineID: 1004,
      Location: "Site D",
      Diameter: 30,
      Material: "Plastic",
      Status: "Under Maintenance",
      InstallationDate: "2023-09-23",
      Longitude: -74.8765,
      Latitude: 41.2345,
    },
    {
      PipelineID: 1005,
      Location: "Site E",
      Diameter: 18,
      Material: "Aluminum",
      Status: "Inactive",
      InstallationDate: "2021-04-05",
      Longitude: -76.5432,
      Latitude: 40.6789,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newPipeline, setNewPipeline] = useState<Partial<Pipeline>>({
    PipelineID: undefined,
    Location: "",
    Diameter: undefined,
    Material: "",
    Status: "Active",  // Default to "Active"
    InstallationDate: "",
    Longitude: undefined,
    Latitude: undefined,
  });

  const handleAddPipeline = () => {
    const { PipelineID, Location, Diameter, Material, Status, InstallationDate, Longitude, Latitude } = newPipeline;
    if (!PipelineID || !Location || !Diameter || !Material || !Status || !InstallationDate || Longitude === undefined || Latitude === undefined) {
      alert("Please fill in all fields.");
      return;
    }

    setPipelines((prev) => [...prev, newPipeline as Pipeline]);
    setNewPipeline({
      PipelineID: undefined,
      Location: "",
      Diameter: undefined,
      Material: "",
      Status: "Active",  // Reset to default "Active" after submission
      InstallationDate: "",
      Longitude: undefined,
      Latitude: undefined,
    });
    setShowForm(false);
  };

  const filteredPipelines = pipelines.filter((pipeline) => {
    const query = searchQuery.toLowerCase();
    return (
      pipeline.PipelineID.toString().includes(query) ||
      pipeline.Location.toLowerCase().includes(query) ||
      pipeline.Material.toLowerCase().includes(query) ||
      pipeline.Status.toLowerCase().includes(query) ||
      pipeline.InstallationDate.toLowerCase().includes(query) ||
      pipeline.Longitude.toString().includes(query) ||
      pipeline.Latitude.toString().includes(query)
    );
  });

  return (
    <SidebarProvider>
      <AppSidebar role="owner" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col gap-6 px-4 lg:px-6 py-8 min-h-screen">
          <h1 className="text-xl font-semibold">Pipelines</h1>
          <div className="flex items-center gap-4">
            <Input
              type="search"
              placeholder="Search pipelines..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={() => setSearchQuery("")}>Clear</Button>
          </div>

          <div className="relative overflow-x-auto">
            <Table>
              <TableCaption>A list of pipelines.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Pipeline ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Diameter</TableHead>
                  <TableHead>Material</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Installation Date</TableHead>
                  <TableHead>Longitude</TableHead>
                  <TableHead>Latitude</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPipelines.length > 0 ? (
                  filteredPipelines.map((pipeline) => (
                    <TableRow
                      key={pipeline.PipelineID}
                      className="relative group hover:bg-muted cursor-pointer"
                    >
                      <TableCell>{pipeline.PipelineID}</TableCell>
                      <TableCell>{pipeline.Location}</TableCell>
                      <TableCell>{pipeline.Diameter}</TableCell>
                      <TableCell>{pipeline.Material}</TableCell>
                      <TableCell>{pipeline.Status}</TableCell>
                      <TableCell>{pipeline.InstallationDate}</TableCell>
                      <TableCell>{pipeline.Longitude}</TableCell>
                      <TableCell>{pipeline.Latitude}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const confirmed = window.confirm(
                              `Are you sure you want to delete pipeline #${pipeline.PipelineID}?`
                            );
                            if (confirmed) {
                              setPipelines((prev) =>
                                prev.filter((p) => p.PipelineID !== pipeline.PipelineID)
                              );
                            }
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>

                      {/* Hover Card */}
                      <div className="absolute z-10 left-0 top-0 translate-x-full w-80 p-4 bg-white border rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <Card className="p-4 space-y-2">
                          <div className="font-bold text-lg">
                            Pipeline #{pipeline.PipelineID}
                          </div>
                          <div className="text-sm">
                            <strong>Location:</strong> {pipeline.Location}
                          </div>
                          <div className="text-sm">
                            <strong>Diameter:</strong> {pipeline.Diameter} inches
                          </div>
                          <div className="text-sm">
                            <strong>Material:</strong> {pipeline.Material}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <strong>Status:</strong> {pipeline.Status}
                          </div>
                          <div className="text-sm">
                            <strong>Installation Date:</strong> {pipeline.InstallationDate}
                          </div>
                          <div className="text-sm">
                            <strong>Longitude:</strong> {pipeline.Longitude}
                          </div>
                          <div className="text-sm">
                            <strong>Latitude:</strong> {pipeline.Latitude}
                          </div>
                        </Card>
                      </div>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center">
                      No pipelines found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Add New Entry Section */}
          <div className="mt-6">
            {!showForm ? (
              <Button onClick={() => setShowForm(true)}>Add New Pipeline</Button>
            ) : (
              <div className="space-y-4 bg-muted p-4 rounded-xl max-w-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    placeholder="Pipeline ID"
                    value={newPipeline.PipelineID ?? ""}
                    onChange={(e) =>
                      setNewPipeline((prev) => ({
                        ...prev,
                        PipelineID: parseInt(e.target.value),
                      }))
                    }
                  />
                  <Input
                    placeholder="Location"
                    value={newPipeline.Location ?? ""}
                    onChange={(e) =>
                      setNewPipeline((prev) => ({
                        ...prev,
                        Location: e.target.value,
                      }))
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Diameter (in inches)"
                    value={newPipeline.Diameter ?? ""}
                    onChange={(e) =>
                      setNewPipeline((prev) => ({
                        ...prev,
                        Diameter: parseInt(e.target.value),
                      }))
                    }
                  />
                  <Input
                    placeholder="Material"
                    value={newPipeline.Material ?? ""}
                    onChange={(e) =>
                      setNewPipeline((prev) => ({
                        ...prev,
                        Material: e.target.value,
                      }))
                    }
                  />
                  <select
                    className="col-span-2"
                    value={newPipeline.Status}
                    onChange={(e) =>
                      setNewPipeline((prev) => ({
                        ...prev,
                        Status: e.target.value,
                      }))
                    }
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="UnderMaintenance">Under Maintenance</option>
                  </select>
                  <Input
                    type="date"
                    value={newPipeline.InstallationDate ?? ""}
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
                        Longitude: parseFloat(e.target.value),
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
                        Latitude: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="flex gap-4">
                  <Button onClick={handleAddPipeline}>Add Pipeline</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

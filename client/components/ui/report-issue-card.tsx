"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export function ReportIssueCard() {
  // Updated state for pipeline component instead of "Area"
  const [area, setArea] = React.useState("Pipe");
  const [securityLevel, setSecurityLevel] = React.useState("Severity 2");
  const [subject, setSubject] = React.useState("");
  const [description, setDescription] = React.useState("");
  
  // State for pipeline selection remains the same.
  const [pipeline, setPipeline] = React.useState("Pipeline A");

  // New state for anomalies checklist.
  const [anomalies, setAnomalies] = React.useState({
    leak: false,
    corrosion: false,
    pressureDrop: false,
    structuralDamage: false,
    blockage: false,
  });

  const toggleAnomaly = (key: keyof typeof anomalies) => {
    setAnomalies((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  function handleSubmit() {
    console.log("Form data:", {
      pipelineComponent: area,
      securityLevel,
      pipeline,
      subject,
      description,
      anomalies,
    });
    // Implement your API submission logic here.
  }

  function handleCancel() {
    // Reset all fields to their initial values.
    setArea("Pipe");
    setSecurityLevel("Severity 2");
    setPipeline("Pipeline A");
    setSubject("");
    setDescription("");
    setAnomalies({
      leak: false,
      corrosion: false,
      pressureDrop: false,
      structuralDamage: false,
      blockage: false,
    });
  }

  return (
    <div>
      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <Card>
          <CardHeader className="flex flex-col space-y-1.5 p-6 pb-0">
            <CardTitle className="font-semibold leading-none tracking-tight">
              Report an issue
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Which pipeline is experiencing issues?
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-0">
            <div className="grid gap-6">
              {/* Pipeline Component & Security Level */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="pipeline-component">Pipeline Component</Label>
                  <Select value={area} onValueChange={setArea}>
                    <SelectTrigger id="pipeline-component">
                      <SelectValue placeholder="Select Component" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pipe">Pipe</SelectItem>
                      <SelectItem value="Valve">Valve</SelectItem>
                      <SelectItem value="Joint">Joint</SelectItem>
                      <SelectItem value="Pump Station">Pump Station</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="security-level">Security Level</Label>
                  <Select value={securityLevel} onValueChange={setSecurityLevel}>
                    <SelectTrigger id="security-level">
                      <SelectValue placeholder="Select Security Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Severity 1">Severity 1</SelectItem>
                      <SelectItem value="Severity 2">Severity 2</SelectItem>
                      <SelectItem value="Severity 3">Severity 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pipeline Selection */}
              <div className="grid gap-2">
                <Label htmlFor="pipeline">Pipeline</Label>
                <Select value={pipeline} onValueChange={setPipeline}>
                  <SelectTrigger id="pipeline">
                    <SelectValue placeholder="Select Pipeline" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pipeline A">Pipeline A</SelectItem>
                    <SelectItem value="Pipeline B">Pipeline B</SelectItem>
                    <SelectItem value="Pipeline C">Pipeline C</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="I need help with..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please include all information relevant to your issue."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Anomalies Checklist */}
              <div className="grid gap-2">
                <Label className="font-medium">Anomalies Checklist</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={anomalies.leak}
                      onCheckedChange={() => toggleAnomaly("leak")}
                    />
                    <span>Leak</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={anomalies.corrosion}
                      onCheckedChange={() => toggleAnomaly("corrosion")}
                    />
                    <span>Corrosion</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={anomalies.pressureDrop}
                      onCheckedChange={() => toggleAnomaly("pressureDrop")}
                    />
                    <span>Pressure Drop</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={anomalies.structuralDamage}
                      onCheckedChange={() => toggleAnomaly("structuralDamage")}
                    />
                    <span>Structural Damage</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={anomalies.blockage}
                      onCheckedChange={() => toggleAnomaly("blockage")}
                    />
                    <span>Blockage</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between space-x-2 p-6 pt-0">
            <Button variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

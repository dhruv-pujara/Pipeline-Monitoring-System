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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

interface ReportIssueCardProps {
  inspectionID: number;
}

const ANOMALY_TYPES = [
  "Leak",
  "Corrosion",
  "Pressure Drop",
  "Structural Damage",
  "Blockage",
];

export default function ReportIssueCard({ inspectionID }: ReportIssueCardProps) {
  const [anomalies, setAnomalies] = useState<Record<string, boolean>>({});
  const [severity, setSeverity] = useState<string>("");

  useEffect(() => {
    const init: Record<string, boolean> = {};
    ANOMALY_TYPES.forEach(a => (init[a] = false));
    setAnomalies(init);
  }, []);

  const toggleAnomaly = (type: string) => {
    setAnomalies(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const hasSelected = Object.values(anomalies).some(Boolean);
  const isComplete = hasSelected && Boolean(severity);

  const handleSubmit = async () => {
    const selected = Object.entries(anomalies)
      .filter(([, on]) => on)
      .map(([type]) => type);

    try {
      await Promise.all(selected.map(type =>
        fetch("/api/addIssue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ inspectionID, issueType: type, severity }),
        })
      ));
      alert("Issues submitted");
      // reset
      setSeverity("");
      const reset: Record<string, boolean> = {};
      ANOMALY_TYPES.forEach(a => (reset[a] = false));
      setAnomalies(reset);
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  };

  return (
    <Card className="bg-black border border-gray-700 text-white p-6">
      <CardHeader>
        <CardTitle className="text-xl">Report Anomalies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-300">Inspection ID</label>
          <Input
            value={String(inspectionID)}
            disabled
            className="bg-black text-white border-gray-600"
          />
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-300">Select Anomalies</label>
          <div className="space-y-2">
            {ANOMALY_TYPES.map(type => (
              <button
                key={type}
                onClick={() => toggleAnomaly(type)}
                className={`w-full text-left px-3 py-2 rounded-md border ${
                  anomalies[type]
                    ? "bg-gray-700 border-gray-500"
                    : "bg-black border-gray-600"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-xs font-medium text-gray-300">Severity</label>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="bg-black text-white border-gray-600">
              <SelectValue placeholder="Select Severity" />
            </SelectTrigger>
            <SelectContent className="bg-black text-white">
              {["Low", "Medium", "High"].map(lvl => (
                <SelectItem key={lvl} value={lvl}>
                  {lvl}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        {isComplete ? (
          <Button onClick={handleSubmit}>Submit</Button>
        ) : (
          <span className="px-4 py-2 bg-gray-800 text-gray-500 rounded-md">
            Incomplete
          </span>
        )}
      </CardFooter>
    </Card>
  );
}

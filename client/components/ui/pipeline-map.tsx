import * as React from "react";

export type Pipeline = {
  id: number;
  name: string;
  status: string;
  location: { lat: number; lng: number };
};

interface PipelineMapProps {
  pipelines: Pipeline[];
}

export function PipelineMap({ pipelines }: PipelineMapProps) {
  return (
    <div className="border border-gray-300 p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Pipeline Map (Placeholder)</h3>
      <ul>
        {pipelines.map((pipeline) => (
          <li key={pipeline.id}>
            {pipeline.name} - {pipeline.status} (
            {pipeline.location.lat}, {pipeline.location.lng})
          </li>
        ))}
      </ul>
    </div>
  );
}

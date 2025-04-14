import * as React from "react";

interface InspectionReportProps {
  report: {
    inspectedCount: number;
    pendingCount: number;
    remarks: string;
  };
}

export function InspectionReport({ report }: InspectionReportProps) {
  return (
    <div className="border border-gray-300 p-4 rounded shadow">
      <h3 className="text-xl font-bold mb-4">Inspection Report (Placeholder)</h3>
      <p>
        <strong>Inspected:</strong> {report.inspectedCount}
      </p>
      <p>
        <strong>Pending:</strong> {report.pendingCount}
      </p>
      <p>
        <strong>Remarks:</strong> {report.remarks}
      </p>
    </div>
  );
}

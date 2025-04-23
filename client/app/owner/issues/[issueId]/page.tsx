"use client";

import React, { useEffect, useState } from "react";

type Issue = {
  IssueID: number;
  InspectionID: number;
  IssueType: string;
  Severity: string;
};

type Props = { params: { issueId: string } };

export default function IssueDetail({ params }: Props) {
  const [issue, setIssue] = useState<Issue | null>(null);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetch(`http://localhost:8800/issues/${params.issueId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setIssue)
      .catch(console.error);
  }, [params.issueId]);

  if (!issue) return <p>Loading issue…</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">
        Issue #{issue.IssueID}: {issue.IssueType}
      </h2>
      <p>
        <strong>Severity:</strong> {issue.Severity}
      </p>
      <p>
        <strong>Inspection ID:</strong> {issue.InspectionID}
      </p>
    </div>
  );
}

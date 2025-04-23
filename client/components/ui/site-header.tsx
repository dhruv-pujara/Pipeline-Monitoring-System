"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BellIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Issue = {
  IssueID: number;
  InspectionID: number;
  IssueType: string;
  Severity: string;
};

export function SiteHeader() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selected, setSelected] = useState<Issue | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    fetch("http://localhost:8800/issues", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setIssues)
      .catch(console.error);
  }, [token]);

  function openIssue(issue: Issue) {
    setSelected(issue);
    setModalOpen(true);
  }

  return (
    <>
      <header className="flex h-12 items-center justify-between border-b px-4 lg:px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition">
              <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="end" className="w-60">
            <DropdownMenuLabel>Open Issues</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {issues.length > 0 ? (
              issues.map((i) => (
                <DropdownMenuItem
                  key={i.IssueID}
                  onSelect={() => openIssue(i)}
                >
                  Issue #{i.IssueID}
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No issues</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Issue #{selected?.IssueID ?? ""}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <p>
              <strong>Inspection ID:</strong> {selected?.InspectionID}
            </p>
            <p>
              <strong>Type:</strong> {selected?.IssueType}
            </p>
            <p>
              <strong>Severity:</strong> {selected?.Severity}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

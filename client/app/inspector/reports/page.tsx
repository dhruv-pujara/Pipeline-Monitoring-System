"use client";

import * as React from "react";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ReportIssueCard } from "@/components/ui/report-issue-card";

export default function ReportsPage() {
  return (
    <SidebarProvider>
      <AppSidebar role="inspector" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex flex-col gap-6 px-4 lg:px-6 py-8">
          <h1 className="text-2xl font-bold">Reports</h1>
          <ReportIssueCard />
          {/* You can add additional report-related UI here */}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

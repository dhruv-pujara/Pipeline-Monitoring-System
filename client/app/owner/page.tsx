"use client";

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SiteHeader } from "@/components/ui/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import MapboxPipelineMap from "@/components/mapbox";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar role="owner" />

      <SidebarInset className="h-screen overflow-hidden">
        <SiteHeader />

        <div className="flex flex-1 flex-col">
          <div className="flex-1 relative">
            <MapboxPipelineMap />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

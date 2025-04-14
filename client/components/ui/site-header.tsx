"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { BellIcon } from "lucide-react"
import { useRouter } from "next/navigation"

export function SiteHeader() {
  const router = useRouter()

  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center justify-between border-b transition-[width,height] ease-linear px-4 lg:px-6">
      <div className="flex items-center gap-1">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
      </div>

      {/* Notifications Button (Pushed Slightly to the Left) */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/notifications")}
          className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <BellIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>
      </div>
    </header>
  )
}

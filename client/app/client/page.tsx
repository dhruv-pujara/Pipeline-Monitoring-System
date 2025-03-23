import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-8">
        <SidebarTrigger />
        <h1 className="text-4xl font-bold mb-6 text-center">
          Welcome to Client Page
        </h1>
        {children}
      </main>
    </SidebarProvider>
  )
}

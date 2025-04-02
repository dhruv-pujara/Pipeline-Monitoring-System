// "use client"

// import * as React from "react"
// import {
//   ArrowUpCircleIcon,
//   BarChartIcon,
//   CameraIcon,
//   ClipboardListIcon,
//   DatabaseIcon,
//   FileCodeIcon,
//   FileIcon,
//   FileTextIcon,
//   FolderIcon,
//   HelpCircleIcon,
//   LayoutDashboardIcon,
//   ListIcon,
//   SearchIcon,
//   SettingsIcon,
//   UsersIcon,
// } from "lucide-react"

// import { NavDocuments } from "@/components/ui/nav-documents"
// import { NavMain } from "@/components/ui/nav-main"
// import { NavUser } from "@/components/ui/nav-user"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarFooter,
//   SidebarHeader,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// const data = {
//   user: {
//     name: "Nebila Wako",
//     email: "nebilawako@gmail.com",
//     avatar: "/avatars/shadcn.jpg",
//   },
//   navMain: [
//     {
//       title: "Dashboard",
//       url: "#",
//       icon: LayoutDashboardIcon,
//     },
//     {
//       title: "Lifecycle",
//       url: "#",
//       icon: ListIcon,
//     },
//     {
//       title: "Analytics",
//       url: "#",
//       icon: BarChartIcon,
//     },
//     {
//       title: "Projects",
//       url: "#",
//       icon: FolderIcon,
//     },
//     {
//       title: "Team",
//       url: "#",
//       icon: UsersIcon,
//     },
//   ],
//   navClouds: [
//     {
//       title: "Capture",
//       icon: CameraIcon,
//       isActive: true,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Proposal",
//       icon: FileTextIcon,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//     {
//       title: "Prompts",
//       icon: FileCodeIcon,
//       url: "#",
//       items: [
//         {
//           title: "Active Proposals",
//           url: "#",
//         },
//         {
//           title: "Archived",
//           url: "#",
//         },
//       ],
//     },
//   ],
  
  
// }

// export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
//   return (
//     <Sidebar collapsible="offcanvas" {...props}>
//       <SidebarHeader className="mb-9">
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton
//               asChild
//               className="data-[slot=sidebar-menu-button]:!p-1.5"
//             >
//               <a href="#">
//                 <ArrowUpCircleIcon className="h-5 w-5" />
//                 <span className="text-base font-semibold">PipeX.</span>
//               </a>

//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarHeader>
//       <SidebarContent>
//         <NavMain items={data.navMain} />
//       </SidebarContent>
//       <SidebarFooter>
//         <NavUser user={data.user} />
//       </SidebarFooter>
//     </Sidebar>
//   )
// }

"use client"

import * as React from "react"
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  FileCodeIcon,
  FileTextIcon,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Nebila Wako",
    email: "nebilawako@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

// 👇 Role-based navMain options
const navMainByRole = {
  owner: [
    {
      title: "Dashboard",
      url: "/owner",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Pipelines",
      url: "/owner/pipelines",
      icon: FolderIcon,
    },
    {
      title: "Inspection",
      url: "/owner/inspections",
      icon: CameraIcon,
    },
  ],
  inspector: [
    {
      title: "Dashboard",
      url: "/inspector",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Report",
      url: "/inspector/reports",
      icon: FileTextIcon,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Inspections",
      url: "/admin/inspections",
      icon: ClipboardListIcon,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileTextIcon,
    },
  ],
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  role: "owner" | "inspector" | "admin"
}

export function AppSidebar({ role, ...props }: AppSidebarProps) {
  const navMain = navMainByRole[role] || []

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="mb-9">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#" className="flex items-center space-x-2">
                <ArrowUpCircleIcon className="h-7 w-7" />
                <span className="text-xl font-bold">PipeX.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

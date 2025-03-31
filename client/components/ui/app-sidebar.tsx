
// import { Calendar, Home, Inbox, Search, Settings, Users } from "lucide-react"

// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// interface AppSidebarProps {
//   role: "admin" | "client" | "inspector"
// }

// const menuItems = {
//   admin: [
//     { title: "Home", url: "/admin/home", icon: Home },
//     { title: "Users", url: "/admin/users", icon: Users },
//     { title: "Report", url: "/admin/report", icon: Settings },
//   ],
//   client: [
//     { title: "Home", url: "/client/home", icon: Home },
//     { title: "Inspections", url: "/client/inspections", icon: Calendar },
//     { title: "Notifications", url: "/client/notifications", icon: Search },
//   ],
//   inspector: [
//     { title: "Home", url: "/inspector/home", icon: Home },
//     { title: "Inspections", url: "/inspector/inspections", icon: Inbox },
//     { title: "Report", url: "/inspector/report", icon: Calendar },
//   ],
// }

// export function AppSidebar({ role }: AppSidebarProps) {
//   const items = menuItems[role]

//   return (
//     <Sidebar>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarGroupLabel>Application</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {items.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton asChild>
//                     <a href={item.url}>
//                       <item.icon className="w-5 h-5" />
//                       <span>{item.title}</span>
//                     </a>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>
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
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavSecondary } from "@/components/ui/nav-secondary"
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

// const menuItems = {
//   admin: [
//     { title: "Home", url: "/admin/home", icon: Home },
//     { title: "Users", url: "/admin/users", icon: Users },
//     { title: "Report", url: "/admin/report", icon: Settings },
//   ],
//   client: [
//     { title: "Home", url: "/client/home", icon: Home },
//     { title: "Inspections", url: "/client/inspections", icon: Calendar },
//     { title: "Notifications", url: "/client/notifications", icon: Search },
//   ],
//   inspector: [
//     { title: "Home", url: "/inspector/home", icon: Home },
//     { title: "Inspections", url: "/inspector/inspections", icon: Inbox },
//     { title: "Report", url: "/inspector/report", icon: Calendar },
//   ],
// }

const data = {
  user: {
    name: "Nebila Wako",
    email: "nebilawako@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "#",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Lifecycle",
      url: "#",
      icon: ListIcon,
    },
    {
      title: "Analytics",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Projects",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "#",
      icon: UsersIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">PipeX.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}



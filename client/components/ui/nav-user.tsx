// // "use client"

// // import { useRouter } from "next/navigation"
// // import {
// //   BellIcon,
// //   LogOutIcon,
// //   MoreVerticalIcon,
// //   UserCircleIcon,
// // } from "lucide-react"

// // import {
// //   Avatar,
// //   AvatarFallback,
// //   AvatarImage,
// // } from "@/components/ui/avatar"
// // import {
// //   DropdownMenu,
// //   DropdownMenuContent,
// //   DropdownMenuGroup,
// //   DropdownMenuItem,
// //   DropdownMenuLabel,
// //   DropdownMenuSeparator,
// //   DropdownMenuTrigger,
// // } from "@/components/ui/dropdown-menu"
// // import {
// //   SidebarMenu,
// //   SidebarMenuButton,
// //   SidebarMenuItem,
// //   useSidebar,
// // } from "@/components/ui/sidebar"

// // export function NavUser({
// //   user,
// // }: {
// //   user: {
// //     name: string
// //     email: string
// //     avatar: string
// //   }
// // }) {
// //   const { isMobile } = useSidebar()
// //   const router = useRouter()

// //   const handleLogout = () => {
// //     // Perform any logout logic here (e.g., clear tokens, reset session)
// //     router.push("/") // Redirect to login page
// //   }

// //   return (
// //     <SidebarMenu>
// //       <SidebarMenuItem>
// //         <DropdownMenu>
// //           <DropdownMenuTrigger asChild>
// //             <SidebarMenuButton
// //               size="lg"
// //               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
// //             >
// //                <Avatar className="h-8 w-8 rounded-lg grayscale">
// //                 <AvatarImage src="https://github.com/shadcn.png" />
// //                 <AvatarFallback className="rounded-lg">PX</AvatarFallback>
// //               </Avatar>
// //               <div className="grid flex-1 text-left text-sm leading-tight">
// //                 <span className="truncate font-medium">{user.name}</span>
// //                 <span className="truncate text-xs text-muted-foreground">
// //                   {user.email}
// //                 </span>
// //               </div>
// //               <MoreVerticalIcon className="ml-auto size-4" />
// //             </SidebarMenuButton>
// //           </DropdownMenuTrigger>
// //           <DropdownMenuContent
// //             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
// //             side={isMobile ? "bottom" : "right"}
// //             align="end"
// //             sideOffset={4}
// //           >
// //             <DropdownMenuLabel className="p-0 font-normal">
// //               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
// //               <Avatar className="h-8 w-8 rounded-lg grayscale">
// //                 <AvatarImage src="https://github.com/shadcn.png" />
// //                 <AvatarFallback className="rounded-lg">PX</AvatarFallback>
// //               </Avatar>
// //                 <div className="grid flex-1 text-left text-sm leading-tight">
// //                   <span className="truncate font-medium">{user.name}</span>
// //                   <span className="truncate text-xs text-muted-foreground">
// //                     {user.email}
// //                   </span>
// //                 </div>
// //               </div>
// //             </DropdownMenuLabel>
// //             <DropdownMenuSeparator />
// //             <DropdownMenuGroup>
// //             </DropdownMenuGroup>
// //             <DropdownMenuSeparator />
// //             <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
// //               <LogOutIcon />
// //               Log out
// //             </DropdownMenuItem>
// //           </DropdownMenuContent>
// //         </DropdownMenu>
// //       </SidebarMenuItem>
// //     </SidebarMenu>
// //   )
// // }



// "use client"

// import { useRouter } from "next/navigation"
// import {
//   LogOutIcon,
//   MoreVerticalIcon,
// } from "lucide-react"

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar"

// export function NavUser({
//   user,
// }: {
//   user: {
//     name: string
//     email: string
//   }
// }) {
//   const { isMobile } = useSidebar()
//   const router = useRouter()

//   const handleLogout = () => {
//     localStorage.removeItem("user")
//     router.push("/") // Redirect to login
//   }

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
//             >
//               <Avatar className="h-8 w-8 rounded-lg grayscale">
//                 <AvatarImage src="https://github.com/shadcn.png" />
//                 <AvatarFallback className="rounded-lg">CN</AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-medium">{user.name}</span>
//                 <span className="truncate text-xs text-muted-foreground">{user.email}</span>
//               </div>
//               <MoreVerticalIcon className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage src="https://github.com/shadcn.png" />
//                   <AvatarFallback className="rounded-lg">CN</AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-medium">{user.name}</span>
//                   <span className="truncate text-xs text-muted-foreground">{user.email}</span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup />
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
//               <LogOutIcon className="mr-2 h-4 w-4" />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   )
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LogOutIcon,
  MoreVerticalIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/");
  };

  if (!user) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback className="rounded-lg">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup />
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOutIcon className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

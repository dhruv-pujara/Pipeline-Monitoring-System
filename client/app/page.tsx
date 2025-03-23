
// "use client"

// import * as React from "react"
// import { Moon, Sun } from "lucide-react"
// import { useTheme } from "next-themes"
// import { ThemeProvider } from "@/components/theme-provider"
// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent } from "@/components/ui/tabs"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// // Mode Toggle Component
// function ModeToggle() {
//   const { setTheme } = useTheme()

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="outline" size="icon" className="absolute top-4 right-4">
//           <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//           <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//           <span className="sr-only">Toggle theme</span>
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         <DropdownMenuItem onClick={() => setTheme("light")}>
//           Light
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("dark")}>
//           Dark
//         </DropdownMenuItem>
//         <DropdownMenuItem onClick={() => setTheme("system")}>
//           System
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// // Main Component
// export default function TabsDemo() {
//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//       <div className="relative flex h-screen items-center justify-center bg-background text-foreground">
//         <ModeToggle />
//         <Tabs defaultValue="account" className="w-[400px]">
//           <TabsContent value="account">
//             <Card>
//               <CardHeader className="text-center">
//                 <CardTitle>Welcome to PipeX!</CardTitle>
//                 <CardDescription>
//                   Real-time pipeline inspection and monitoring—  
//                   Precision, safety, and control at your fingertips.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-1">
//                   <Label htmlFor="role">Select Role</Label>
//                   <Select>
//                     <SelectTrigger id="role">
//                       <SelectValue placeholder="Choose role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="admin">Admin</SelectItem>
//                       <SelectItem value="client">Client</SelectItem>
//                       <SelectItem value="inspector">Inspector</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-1">
//                   <Label htmlFor="name">Username</Label>
//                   <Input id="name" />
//                 </div>
//                 <div className="space-y-1">
//                   <Label htmlFor="password">Password</Label>
//                   <Input id="password" type="password" />
//                 </div>
//               </CardContent>
//               <CardFooter className="flex justify-center">
//                 <Button>Log In</Button>
//               </CardFooter>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </ThemeProvider>
//   )
// }


"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mode Toggle Component
function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="absolute top-4 right-4">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Main Component
export default function TabsDemo() {
  const router = useRouter()
  const [role, setRole] = useState<string | undefined>()

  const handleLogin = () => {
    if (role === "admin") {
      router.push("/admin")
    } else if (role === "client") {
      router.push("/client")
    } else if (role === "inspector") {
      router.push("/inspector")
    } else {
      alert("Please select a role.")
    }
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="relative flex h-screen items-center justify-center bg-background text-foreground">
        <ModeToggle />
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsContent value="account">
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Welcome to PipeX!</CardTitle>
                <CardDescription>
                  Real-time pipeline inspection and monitoring—  
                  Precision, safety, and control at your fingertips.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="role">Select Role</Label>
                  <Select onValueChange={(value) => setRole(value)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Choose role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="inspector">Inspector</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="name">Username</Label>
                  <Input id="name" />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button onClick={handleLogin}>Log In</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ThemeProvider>
  )
}

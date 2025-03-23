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
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function TabsDemo() {
//   return (
//     <div className="flex h-screen items-center justify-center">
//       <Tabs defaultValue="account" className="w-[400px]">
//         <TabsContent value="account">
//           <Card>
//             <CardHeader className="text-center">
//               <CardTitle>Welcome to PipeX!</CardTitle>
//               <CardDescription>
//               Real-time pipeline inspection and monitoring—
// Precision, safety, and control at your fingertips.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <div className="space-y-1">
//                 <Label htmlFor="name">Username</Label>
//                 <Input id="name"/>
//               </div>
//               <div className="space-y-1">
//                 <Label htmlFor="password">Password</Label>
//                 <Input id="password"/>
//               </div>
//             </CardContent>
//             <CardFooter className="flex justify-center">
//               <Button >Log In</Button>
//             </CardFooter>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TabsDemo() {
  return (
    <div className="flex h-screen items-center justify-center">
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
                <Select>
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
              <Button>Log In</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

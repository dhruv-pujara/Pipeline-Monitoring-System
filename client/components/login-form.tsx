'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [role, setRole] = useState<string | undefined>()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const res = await fetch("http://localhost:8800/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })
  
      const data = await res.json()
  
      if (!res.ok) {
        alert(data.error || "Login failed")
        return
      }
  
      localStorage.setItem("token", data.token)
      alert("Login successful")
  
      // Redirect based on data.role from the backend (NOT the dropdown selection)
      if (data.role === "Admin") {
        router.push("/admin")
      } else if (data.role === "Owner") {
        router.push("/owner")
      } else if (data.role === "Inspector") {
        router.push("/inspector")
      } else {
        alert("Unknown role, please contact admin.")
      }
  
    } catch (err) {
      console.error("Login error:", err)
      alert("Something went wrong.")
    }
  }
  


  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your PipeX account
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="role">Select Role</Label>
                <Select onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Choose role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="inspector">Inspector</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="usernam">Username</Label>
                <Input
                  id="username"
                  type="username"
                  placeholder="john.doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>

          <div className="relative hidden bg-muted md:block">
            <img
              src="/pipeline.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}

// components/pipeline/add-pipeline-modal.tsx
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function AddPipelineModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [name, setName] = useState("")
  const [segment, setSegment] = useState("")
  const [location, setLocation] = useState("")

  const handleAdd = () => {
    // TODO: Send data to backend
    console.log("New Pipeline:", { name, segment, location })
    onOpenChange(false)
    setName("")
    setSegment("")
    setLocation("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Pipeline</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Segment</Label>
            <Input value={segment} onChange={(e) => setSegment(e.target.value)} />
          </div>
          <div>
            <Label>Location</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

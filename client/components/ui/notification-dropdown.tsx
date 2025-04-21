"use client"

import * as React from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { BellIcon } from "lucide-react"

const NotificationDropdown = () => {
  const notifications = [
    { id: 1, message: "New inspection request" },
    { id: 2, message: "Pipeline updated successfully" },
    { id: 3, message: "New report generated" },
  ]

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center cursor-pointer">
        <BellIcon className="h-6 w-6 text-gray-700" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="z-50 w-64 max-h-60 overflow-y-auto rounded-md border bg-white p-2 shadow-lg">
        <div className="text-sm font-medium text-gray-900">Notifications</div>
        <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />
        {notifications.map((notification) => (
          <DropdownMenu.Item
            key={notification.id}
            className="flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1 text-sm"
          >
            {notification.message}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default NotificationDropdown

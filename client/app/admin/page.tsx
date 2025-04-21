"use client";

import { useState } from "react"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Shadcn UI Table components

export default function Page() {
  const [activeForm, setActiveForm] = useState("create")

  const renderProfileSection = () => {
    switch (activeForm) {
      case "create":
        return <CreateUserForm />
      case "update":
        return <UpdateUserForm />
      case "delete":
        return <DeleteUserForm />
      default:
        return <CreateUserForm />
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar role="admin" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-4 lg:px-6">
                <h1 className="text-2xl font-bold">Welcome Back Admin</h1>
              </div>

              <div className="px-4 lg:px-6">
                <div className="container py-6">
                  <section className="overflow-hidden rounded-[0.5rem] border bg-background shadow">
                    <div className="hidden space-y-6 p-10 pb-16 md:block">
                      <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                        <p className="text-muted-foreground">
                          Manage users information, create and update new users.
                        </p>
                      </div>

                      <div className="shrink-0 bg-border h-[1px] w-full my-6" />

                      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <aside className="-mx-4 lg:w-1/5">
                          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                            <button
                              onClick={() => setActiveForm("create")}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors hover:text-accent-foreground hover:underline ${
                                activeForm === "create" ? "bg-accent" : ""
                              }`}
                            >
                              Create new user
                            </button>
                            <button
                              onClick={() => setActiveForm("update")}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors hover:text-accent-foreground hover:underline ${
                                activeForm === "update" ? "bg-accent" : ""
                              }`}
                            >
                              Update user
                            </button>
                            <button
                              onClick={() => setActiveForm("delete")}
                              className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors hover:text-accent-foreground hover:underline ${
                                activeForm === "delete" ? "bg-accent" : ""
                              }`}
                            >
                              Delete user
                            </button>
                          </nav>
                        </aside>

                        <div className="flex-1 lg:max-w-2xl space-y-6">
                          {renderProfileSection()}
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

function CreateUserForm() {
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    role: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("http://localhost:8800/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        alert("User registered successfully")
      } else {
        alert("Error: " + (data.message || "Something went wrong"))
      }
    } catch (error) {
      alert("Network error")
      console.error(error)
    }
  }

  return (
    <>
      <h3 className="text-lg font-medium">Create User</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="w-full border px-3 py-2 rounded-md"
  required
>
  <option value="" disabled hidden>
    Role
  </option>
  <option value="owner">Owner</option>
  <option value="admin">Admin</option>
  <option value="inspector">Inspector</option>
</select>
<Button type="submit" className="px-4 py-2">
  Create
</Button>
      </form>
    </>
  )
}

type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
};

function UpdateUserForm() {
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    role: '',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]); // Explicitly set the type here as User[]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle the form submission logic here (e.g., API call to update the user)
    try {
      const res = await fetch('http://localhost:8800/updateUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert('User updated successfully');
      } else {
        alert('Error: ' + (data.message || 'Something went wrong'));
      }
    } catch (error) {
      alert('Network error');
      console.error(error);
    }
  };

  return (
    <>
      <h3 className="text-lg font-medium">Update User</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded-md"
          required
        >
          <option value="" disabled hidden>
            Role
          </option>
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="inspector">Inspector</option>
        </select>
        <Button type="submit" className="px-4 py-2">
          Update
        </Button>
      </form>

      {/* Search Input */}
      <div className="mt-6">
        <input
          placeholder="Search User"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      {/* Shadcn UI Table */}
      <div className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="px-4 py-2">Full Name</TableHead>
              <TableHead className="px-4 py-2">Username</TableHead>
              <TableHead className="px-4 py-2">Email</TableHead>
              <TableHead className="px-4 py-2">Role</TableHead>
              <TableHead className="px-4 py-2">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users
              .filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase())) // Filter users based on search term
              .map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-4 py-2">{user.name}</TableCell>
                  <TableCell className="px-4 py-2">{user.username}</TableCell>
                  <TableCell className="px-4 py-2">{user.email}</TableCell>
                  <TableCell className="px-4 py-2">{user.role}</TableCell>
                  <TableCell className="px-4 py-2">
                    <Button className="px-2 py-1" onClick={() => { /* Set form values for update */ }}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}



function DeleteUserForm() {
  return (
    <>
      <h3 className="text-lg font-medium">Delete User</h3>
      <form className="space-y-6">
        <input placeholder="User ID to delete" className="w-full border px-3 py-2 rounded-md" />
        <button className="bg-destructive text-white px-4 py-2 rounded-md">Delete</button>
      </form>
    </>
  )
}

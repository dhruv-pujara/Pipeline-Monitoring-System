"use client"

import { AppSidebar } from "@/components/ui/app-sidebar"
import { SiteHeader } from "@/components/ui/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default function Page() {
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
                    <div className="md:hidden">
                      <img
                        alt="Forms"
                        loading="lazy"
                        width="1280"
                        height="791"
                        className="block dark:hidden"
                        src="/_next/image?url=%2Fexamples%2Fforms-light.png&w=3840&q=75"
                      />
                      <img
                        alt="Forms"
                        loading="lazy"
                        width="1280"
                        height="791"
                        className="hidden dark:block"
                        src="/_next/image?url=%2Fexamples%2Fforms-dark.png&w=3840&q=75"
                      />
                    </div>

                    <div className="hidden space-y-6 p-10 pb-16 md:block">
                      <div className="space-y-0.5">
                        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
                        <p className="text-muted-foreground">Manage users information, create and update new users .</p>
                      </div>
                      <div className="shrink-0 bg-border h-[1px] w-full my-6" />

                      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                        <aside className="-mx-4 lg:w-1/5">
                          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                            {[
                              { href: "/examples/forms", label: "Create new user" },
                              { href: "/examples/forms/account", label: "Update user" },
                              { href: "/examples/forms/appearance", label: "Delete User" },
          
                            ].map(({ href, label }) => (
                              <a
                                key={href}
                                className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 transition-colors hover:text-accent-foreground hover:underline"
                                href={href}
                              >
                                {label}
                              </a>
                            ))}
                          </nav>
                        </aside>

                        <div className="flex-1 lg:max-w-2xl space-y-6">
                          <div>
                            <h3 className="text-lg font-medium">Profile</h3>
                            <p className="text-sm text-muted-foreground">This is how others will see you on the site.</p>
                          </div>
                          <div className="shrink-0 bg-border h-[1px] w-full" />
                          <form className="space-y-8">
                            <div className="space-y-2">
                              <label htmlFor="username" className="text-sm font-medium leading-none">Username</label>
                              <input
                                className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm md:text-sm"
                                placeholder="shadcn"
                                id="username"
                                name="username"
                              />
                              <p className="text-[0.8rem] text-muted-foreground">
                                This is your public display name. It can be your real name or a pseudonym.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                              <select id="email" name="email" className="w-full rounded-md border px-3 py-2 text-sm shadow-sm">
                                <option value="">Select a verified email to display</option>
                                <option value="m@example.com">m@example.com</option>
                                <option value="m@google.com">m@google.com</option>
                                <option value="m@support.com">m@support.com</option>
                              </select>
                              <p className="text-[0.8rem] text-muted-foreground">
                                You can manage verified email addresses in your <a href="/examples/forms">email settings</a>.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="bio" className="text-sm font-medium leading-none">Bio</label>
                              <textarea
                                id="bio"
                                name="bio"
                                className="flex min-h-[60px] w-full rounded-md border px-3 py-2 text-base shadow-sm resize-none md:text-sm"
                                placeholder="Tell us a little bit about yourself"
                              >I own a computer.</textarea>
                              <p className="text-[0.8rem] text-muted-foreground">
                                You can <span>@mention</span> other users and organizations to link to them.
                              </p>
                            </div>

                            <div className="space-y-2">
                              <label htmlFor="url" className="text-sm font-medium leading-none">URLs</label>
                              <input
                                id="url"
                                name="urls.0.value"
                                defaultValue="https://shadcn.com"
                                className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm md:text-sm"
                              />
                              <input
                                name="urls.1.value"
                                defaultValue="http://twitter.com/shadcn"
                                className="flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-sm md:text-sm"
                              />
                            </div>

                            <button
                              type="submit"
                              className="inline-flex items-center justify-center rounded-md bg-primary text-white h-9 px-4 py-2 text-sm font-medium shadow hover:bg-primary/90"
                            >
                              Update Profile
                            </button>
                          </form>
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

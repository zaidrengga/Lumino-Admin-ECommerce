"use client"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { BellRing, Home, ListOrdered, Package, Users2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const listNavigasi = [
    {
        title: "Overview",
        href: "/",
        icons: Home,
    },
    {
        title: "Products",
        href: "/products",
        icons: Package,
    },
    {
        title: "Orders",
        href: "/orders",
        icons: ListOrdered,
    },
    {
        title: "Notifications",
        href: "/notifications",
        icons: BellRing,
    },
    {
        title: "Users",
        href: "/users",
        icons: Users2,
    },
]

export function AppSidebar() {
    const { open } = useSidebar()
    const pathname = usePathname()

    return (
        <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center justify-between gap-2">
                    <h1 className={`text-2xl text-primary font-bold text-nowrap ${open ? "" : "hidden"}`}>Lumino <span className="text-base text-muted-foreground font-semibold">Dashboard</span></h1>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {listNavigasi.map((item, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton asChild size={"lg"} tooltip={item.title} variant={pathname === item.href ? "primary" : "outline"}>
                                        <Link href={item.href}>
                                            <item.icons />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    )
}
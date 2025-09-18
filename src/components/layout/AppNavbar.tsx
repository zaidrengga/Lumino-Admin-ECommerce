"use client"

import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "../ui/mode-toggel"
import { SidebarTrigger, useSidebar } from "../ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import Link from "next/link";
import { Bell } from "lucide-react";
import { NotificationData } from "@/lib/types";
import { useCrud } from "@/hooks/use-crud";
import { Badge } from "../ui/badge";

const AppNavbar = () => {
    const { user, logout } = useAuth();
    const { isMobile, open } = useSidebar()
    const {items: notifications} = useCrud<NotificationData>("notifications")

    return (
        <header className={`fixed inset-x-0 top-0 z-50 p-2 bg-background ${isMobile ? "" : `${open ? "left-[16rem]" : "left-[4rem]"}`} transform transition-all duration-300`}>
            <nav className='w-full bg-sidebar rounded-lg shadow flex items-center justify-between p-1.5 border'>
                <div>
                    <SidebarTrigger />
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="outline" size="icon" asChild className="relative rounded-full">
                        <Link href="/notifications">
                            <Bell />
                            <Badge className="absolute -top-1 -right-1 rounded-full h-4 w-4 text-xs" variant="destructive">
                                {notifications.filter((n) => !n.isRead).length}
                            </Badge>
                        </Link>
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="icon">
                                <span className="sr-only">Open user menu</span>
                                {user?.username?.charAt(0).toUpperCase()}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="space-y-4">
                            <span className="text-sm text-muted-foreground">Profile</span>
                            <div className="space-y-1 p-2 border rounded-lg bg-accent">
                                <p className="text-sm font-medium leading-none">{user?.username}</p>
                                <p className="text-sm text-muted-foreground">{user?.user_email}</p>
                            </div>
                            <Button variant="destructive" className="w-full justify-start" onClick={logout}>Logout</Button>
                        </PopoverContent>
                    </Popover>
                    <ModeToggle />
                </div>
            </nav>
        </header>
    )
}

export default AppNavbar
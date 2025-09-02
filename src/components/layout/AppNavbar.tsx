"use client"

import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "../ui/mode-toggel"
import { SidebarTrigger } from "../ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";

const AppNavbar = () => {
    const { user, logout } = useAuth();

    return (
        <header className='sticky top-0 z-50 p-2 bg-background'>
            <nav className='w-full bg-sidebar rounded-lg shadow flex items-center justify-between p-1.5 border'>
                <div>
                    <SidebarTrigger />
                </div>
                <div className='flex items-center gap-2'>
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
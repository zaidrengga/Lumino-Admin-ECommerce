"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import AppNavbar from "@/components/layout/AppNavbar";
import { ModeToggle } from "@/components/ui/mode-toggel";
import { Toaster } from "@/components/ui/sonner";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname.startsWith("/login");

    if (isAuthPage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <ModeToggle className="absolute top-4 right-4" />
                {children}
            </div>
        );
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <Toaster />
            <main className="w-full min-h-screen">
                <AppNavbar />
                <div className="p-4">{children}</div>
            </main>
        </SidebarProvider>
    );
}

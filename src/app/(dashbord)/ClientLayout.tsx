"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import AppNavbar from "@/components/layout/AppNavbar";
import { ModeToggle } from "@/components/ui/mode-toggel";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/loding";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const { loading } = useAuth();

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

    if (loading) return <Loading />

    return (
        <SidebarProvider>
            <AppSidebar />
            <Toaster />
            <main className="w-full min-h-screen overflow-x-hidden">
                <AppNavbar />
                <div className="p-4 mt-16">{children}</div>
            </main>
        </SidebarProvider>
    );
}
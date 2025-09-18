"use client";

import { Users } from "@/generated/prisma";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
    user: Users | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Users | null>(null);
    const [loading, setLoading] = useState(true);

    // fetch user saat pertama load
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/auth/login", {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                if (!res.ok) {
                    console.error("Error fetching user:", res.statusText);
                }

                const data = await res.json();
                setUser(data);
                return data;
            } catch (error) {
                console.error("Error fetching user:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ user_email: email, user_password: password }),
        });

        if (!res.ok) {
            throw new Error("Login gagal");
        }

        const data = await res.json();
        setUser(data.user);
    };

    const logout = async () => {
        await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth harus digunakan di dalam AuthProvider");
    }
    return context;
}
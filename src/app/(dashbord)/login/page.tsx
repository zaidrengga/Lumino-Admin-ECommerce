"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Loading from "@/components/ui/loding";

export default function LoginPage() {
    const { login, loading: authLoading } = useAuth();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(email, password);
            router.push("/")
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Login gagal");
            }
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <Loading />
    return (
        <div className="bg-accent shadow-md rounded-2xl p-8 w-full max-w-md">
            <h1 className="text-2xl font-semibold mb-6 text-center">Login To <span className="text-primary font-bold">Lumino Dashboard</span></h1>

            {error && (
                <p className="text-red-500 text-sm text-center mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="space-y-2 relative">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2/3 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </Button>
                </div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Login"}
                </Button>
            </form>
        </div>
    );
}

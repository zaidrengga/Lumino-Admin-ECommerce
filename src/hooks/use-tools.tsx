import { useState, useEffect } from "react";

export interface Tool {
    id: string;
    name: string;
    icon: string;
}

export function useTools() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchTools = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/tools");
            if (!res.ok) throw new Error("Failed to fetch tools");
            const data: Tool[] = await res.json();
            setTools(data);
        } catch (err) {
            setError((err as Error).message || "Failed to fetch tools");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTools();
    }, []);

    return { tools, loading, error, refetch: fetchTools };
}

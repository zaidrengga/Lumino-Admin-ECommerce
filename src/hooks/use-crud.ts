import { useCallback, useEffect, useState } from "react";

export function useCrud<T extends { id: string }>(table: string, id?: string) {
    const [items, setItems] = useState<T[]>([]);
    const [item, setItem] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- FETCH ALL ---
    const fetchAll = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/${table}`, {
                cache: "no-store",
                next: {
                    tags: [table],
                },
            });
            if (!res.ok) throw new Error("Gagal fetch data");
            const data = await res.json();
            setItems(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("fetchAll error:", err);
            setError("Gagal mengambil data");
        } finally {
            setLoading(false);
        }
    };

    // --- FETCH ONE ---
    const fetchOne = useCallback(async (targetId?: string) => {
        if (!targetId) return null
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/${table}/${targetId}`, {
                cache: "force-cache",
                next: {
                    tags: [`${table}-${targetId}`],
                }
            })
            if (!res.ok) throw new Error("Gagal fetch data")
            const json = await res.json()
            setItem(json)
            return json
        } catch (err) {
            console.error("fetchOne error:", err)
            setError("Gagal mengambil data")
            return null
        } finally {
            setLoading(false)
        }
    }, [table])

    useEffect(() => {
        fetchAll();
        fetchOne(id);
    }, [table]);

    // --- ADD ---
    const add = async (item: T): Promise<boolean> => {
        try {
            const res = await fetch(`/api/${table}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Gagal menambahkan data");
            }

            const data = await res.json();
            setItems(prev => [...prev, data]);
            return true;

        } catch (err: any) {
            console.error("add error:", err);
            setError(err.message || "Gagal menambahkan data");
            return false;
        }
    };

    const update = async (data: T) => {
        setLoading(true)
        setError(null)

        try {
            const res = await fetch(`/api/${table}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error("Gagal update produk")
            }

            const updated = await res.json()
            setItems(prev =>
                prev.map(item => item.id === data.id ? { ...item, ...updated } : item)
            )
            return updated
        } catch (err: any) {
            setError(err.message)
            console.error("updateProduct error:", err)
            return null
        } finally {
            setLoading(false)
        }
    }

    const remove = async (id: string) => {
        try {
            const res = await fetch(`/api/${table}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (!res.ok) {
                const errMsg = await res.text();
                throw new Error(errMsg || "Gagal menghapus data");
            }
            setItems((prev) => prev.filter((item) => item.id !== id));
        } catch (err) {
            console.error("remove error:", err);
            setError(err instanceof Error ? err.message : "Gagal menghapus data");
        }
    };


    return { items, item, fetchOne, loading, error, add, setError, setLoading, remove, update };
}
import { Product } from "@/generated/prisma";
import { useEffect, useState } from "react";

export interface ProductData {
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    features?: string[];
    tools?: string[]; // array of tool IDs
}

export function useProduct() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch semua produk
    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            const data: Product[] = await res.json();
            setProducts(data);
        } catch (err) {
            setError((err as Error).message || "Failed to fetch products");
        } finally {
            setLoading(false);
        }
    };

    // Tambah product baru
    const addProduct = async (productData: ProductData) => {
        setLoading(true);
        setError(null);

        // pastikan features dan tools selalu array
        const payload = {
            ...productData,
            features: productData.features || [],
            tools: productData.tools || [],
        };

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                throw new Error(errorData?.error || "Failed to create product");
            }

            const newProduct: Product = await res.json();
            setProducts((prev) => [newProduct, ...prev]);
            return newProduct;
        } catch (err) {
            setError((err as Error).message || "Failed to create product");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return { products, loading, error, fetchProducts, addProduct };
}
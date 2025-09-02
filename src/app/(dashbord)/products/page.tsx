"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "@/components/template/ProductSearch";
import { ProductFilter } from "@/components/template/ProductFilter";
import Link from "next/link";
import { useProduct } from "@/hooks/use-product";
import { Product } from "@/generated/prisma";

const ProductsPage = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string | undefined>(undefined);
    const { products } = useProduct();

    const filteredProducts: Product[] = products.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) &&
            (category ? p.category === category : true)
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <Card>
                <CardContent className="w-full flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">Products</h1>
                    <Button asChild>
                        <Link href="/products/new-product">
                            Add New Product <Plus className="ml-1" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            {/* Search */}
            <Card>
                <CardContent className="flex items-center gap-4 w-full justify-between">
                    <ProductSearch value={search} onChange={setSearch} onReset={() => setSearch("")} />
                    <ProductFilter
                        value={category}
                        options={["Electronics", "Furniture", "Stationery"]}
                        onChange={setCategory}
                        onReset={() => setCategory(undefined)}
                    />
                </CardContent>
            </Card>

            {/* Product List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <Card key={product.id}>
                            <CardContent>
                                <h2 className="font-bold">{product.title}</h2>
                                <p className="text-muted-foreground">Category: {product.category}</p>
                                <p className="text-muted-foreground">Price: ${product.price}</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-muted-foreground col-span-full text-center">No products found.</p>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
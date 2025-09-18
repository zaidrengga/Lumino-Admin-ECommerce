"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Info, Pen, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "@/components/template/ProductSearch";
import { ProductFilter } from "@/components/template/ProductFilter";
import Link from "next/link";
import Image from "next/image";
import { imageLoader } from "@/components/ui/image-loader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Loading from "@/components/ui/loding";
import { formatRupiah } from "@/lib/utils";
import { useCrud } from "@/hooks/use-crud";
import { ProductData } from "@/lib/types";

const ProductsPage = () => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState<string | undefined>(undefined);
    const { items: products, loading } = useCrud<ProductData>("products");

    const filteredProducts = products.filter(
        (p) =>
            p.title.toLowerCase().includes(search.toLowerCase()) &&
            (category ? p.category === category : true)
    );

    if (loading) return <Loading />;
    return (
        <div className="flex flex-col gap-4">

            <div className="w-full flex justify-between items-center">
                <h1 className="text-2xl font-bold text-primary">Products</h1>
                <Button asChild>
                    <Link href="/products/new-product">
                        Add New Product <Plus className="ml-1" />
                    </Link>
                </Button>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="flex items-center gap-4 w-full justify-between">
                    <ProductSearch value={search} onChange={setSearch} onReset={() => setSearch("")} />
                    <ProductFilter
                        value={category}
                        options={["Web Template", "Ai Agent"]}
                        onChange={setCategory}
                        onReset={() => setCategory(undefined)}
                    />
                </CardContent>
            </Card>

            <div className="border rounded-lg overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader className="bg-card">
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell className="w-[100px]">
                                        <Image
                                            src={product.image}
                                            alt={product.title}
                                            width={100}
                                            height={100}
                                            priority
                                            loader={imageLoader}
                                            className="rounded-md aspect-square object-cover"
                                        />
                                    </TableCell>
                                    <TableCell>{product.title}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{formatRupiah(product.price)}</TableCell>
                                    <TableCell className={product.status === "Active" ? "text-green-500" : "text-red-500"}>{product.status}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button asChild>
                                            <Link href={`/products/${product.id}`} ><Info /> Detail</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ProductsPage;
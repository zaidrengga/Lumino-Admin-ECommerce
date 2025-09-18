"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { toast } from "sonner";
import { Category, ProductData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FormInput, FormListInput, FormSelect, FormTextrea } from "@/components/template/FormField";
import { FormImageCloudinary } from "@/components/template/FormImageClouudinary";
import Image from "next/image";
import { X } from "lucide-react";
import Loading from "@/components/ui/loding";
import { useCrud } from "@/hooks/use-crud";
import { Tols } from "@/generated/prisma";
import { imageLoader } from "@/components/ui/image-loader";

const NewProductPage = () => {
    const [newProduct, setNewProduct] = useState<ProductData>({
        id: "",
        title: "",
        description: "",
        category: "",
        price: 0,
        image: "",
        demo: "",
        features: [],
        tools: [],
        rating: 0,
        revenue: 0,
        sales: 0,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
    });

    const { add: addProduct, loading } = useCrud<ProductData>("products");
    const { items: toolsList, loading: loadingTools } = useCrud<Tols>("tools");

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newProduct.title || !newProduct.category || !newProduct.price) {
            toast.error("Please fill all the required fields");
            return;
        }

        try {
            await addProduct(newProduct);
            toast.success("Product added successfully");
            // Reset form
            setNewProduct({
                id: "",
                title: "",
                description: "",
                category: "",
                price: 0,
                image: "",
                demo: "",
                features: [],
                tools: [],
                rating: 0,
                revenue: 0,
                sales: 0,
                status: "Active",
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add product");
        }
    };

    if (loading || loadingTools) {
        return <Loading />;
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardContent>
                    <h1 className="text-2xl font-bold text-primary">Add New Product</h1>
                </CardContent>
            </Card>

            <form onSubmit={handleAddProduct} className="flex gap-4 lg:flex-row flex-col">
                {/* Left Form */}
                <Card className="w-full lg:w-1/2">
                    <CardContent className="space-y-6">
                        <FormSelect
                            id="category"
                            label="Category"
                            placeholder="Select category"
                            options={Category.map((c) => ({ value: c, label: c }))}
                            value={newProduct.category}
                            onChange={(value) =>
                                setNewProduct((prev) => ({
                                    ...prev,
                                    category: value as string,
                                }))
                            }
                            required
                        />

                        <FormImageCloudinary
                            label="Product Image"
                            value={newProduct.image}
                            onChange={(url) =>
                                setNewProduct((prev) => ({ ...prev, image: url }))
                            }
                        />

                        <FormInput
                            id="title"
                            label="Title"
                            placeholder="Product title"
                            value={newProduct.title}
                            onChange={(e) =>
                                setNewProduct((prev) => ({ ...prev, title: e.target.value }))
                            }
                            required
                        />

                        <FormTextrea
                            id="description"
                            label="Description"
                            placeholder="Product description"
                            value={newProduct.description}
                            onChange={(e) =>
                                setNewProduct((prev) => ({ ...prev, description: e.target.value }))
                            }
                        />
                    </CardContent>
                </Card>

                {/* Right Form */}
                <Card className="w-full lg:w-1/2">
                    <CardContent className="space-y-6">
                        <FormInput
                            id="price"
                            label="Price"
                            placeholder="Product price"
                            type="number"
                            value={newProduct.price}
                            onChange={(e) =>
                                setNewProduct((prev) => ({ ...prev, price: Number(e.target.value) }))
                            }
                            required
                        />

                        <FormListInput
                            label="Features"
                            values={newProduct.features}
                            onChange={(updated) =>
                                setNewProduct((prev) => ({ ...prev, features: updated }))
                            }
                            placeholder="Add feature"
                        />

                        <div className="space-y-2">
                            {/* Tools multi-select */}
                            <FormSelect
                                label="Tools"
                                placeholder="Select tools..."
                                multiple={true}
                                value={newProduct.tools!.map((tool) => tool.id)}
                                options={toolsList.map((t) => ({
                                    value: t.id,
                                    label: t.name,
                                }))}
                                onChange={(value) => {
                                    const selectedTools = toolsList.filter((t) =>
                                        value.includes(t.id)
                                    );
                                    setNewProduct((prev) => ({
                                        ...prev,
                                        tools: selectedTools,
                                    }));
                                }}
                                addNew
                                addNewLink="/products/new-tools"
                            />

                            {/* Display selected tools with remove button */}
                            {newProduct.tools!.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {newProduct.tools!.map((tl) => {
                                        const tool = toolsList.find((t) => t.id === tl.id);
                                        if (tool) {
                                            return (
                                                <div
                                                    key={tl.id}
                                                    className="flex items-center gap-1 px-2 py-1 bg-accent border rounded text-sm"
                                                >
                                                    <Image
                                                        width={16}
                                                        height={16}
                                                        src={tool.icon}
                                                        alt={tool.name}
                                                        className="w-4 h-4"
                                                        loader={imageLoader}
                                                    />
                                                    <span>{tool.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setNewProduct((prev) => ({
                                                                ...prev,
                                                                tools: prev.tools ? prev.tools.filter((t) => t !== tl) : [],
                                                            }))
                                                        }
                                                        className="ml-1 text-red-500 hover:text-red-700 font-bold"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        } else {
                                            // Handle the case where no matching tool is found
                                            return null; // or some other default value
                                        }
                                    })}
                                </div>
                            )}
                        </div>

                        <FormInput
                            id="demo"
                            label="Demo"
                            placeholder="Product Demo"
                            type="text"
                            value={newProduct.demo || ""}
                            onChange={(e) =>
                                setNewProduct((prev) => ({ ...prev, demo: e.target.value }))
                            }
                        />

                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Loading..." : "Submit"}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default NewProductPage;

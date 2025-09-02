"use client";

import { Card, CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import { toast } from "sonner";
import { useProduct } from "@/hooks/use-product";
import { useTools } from "@/hooks/use-tools";
import { Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FormInput, FormListInput, FormSelect, FormTextrea } from "@/components/template/FormField";
import { FormImageCloudinary } from "@/components/template/FormImageClouudinary";
import Image from "next/image";
import { X } from "lucide-react";

interface NewProductState {
    title: string;
    description: string;
    category: string;
    price: number;
    image: string;
    features: string[];
    tools: string[]; // array of selected tool IDs
}

const NewProductPage = () => {
    const [newProduct, setNewProduct] = useState<NewProductState>({
        title: "",
        description: "",
        category: "",
        price: 0,
        image: "",
        features: [],
        tools: [],
    });

    const { addProduct, loading } = useProduct();
    const { tools: toolsList } = useTools();

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
                title: "",
                description: "",
                category: "",
                price: 0,
                image: "",
                features: [],
                tools: [],
            });
        } catch (error) {
            console.error(error);
            toast.error("Failed to add product");
        }
    };

    return (
        <div className="space-y-4">
            <Card>
                <CardContent>
                    <h1 className="text-2xl font-bold text-primary">Add New Product</h1>
                </CardContent>
            </Card>

            <form onSubmit={handleAddProduct} className="flex gap-4 lg:flex-row flex-col">
                {/* Left Form */}
                <Card className="w-full max-w-xl">
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
                <Card className="w-full max-w-md">
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
                                value={newProduct.tools}
                                onChange={(val) =>
                                    setNewProduct((prev) => ({
                                        ...prev,
                                        tools: val as string[],
                                    }))
                                }
                                options={toolsList.map((t) => ({
                                    value: t.id,
                                    label: t.name,
                                }))}
                            />

                            {/* Display selected tools with remove button */}
                            {newProduct.tools.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {newProduct.tools.map((id) => {
                                        const tool = toolsList.find((t) => t.id === id);
                                        if (!tool) return null;

                                        return (
                                            <div
                                                key={id}
                                                className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-sm"
                                            >
                                                <Image
                                                    width={16}
                                                    height={16}
                                                    src={tool.icon}
                                                    alt={tool.name}
                                                    className="w-4 h-4"
                                                />
                                                <span>{tool.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setNewProduct((prev) => ({
                                                            ...prev,
                                                            tools: prev.tools.filter((t) => t !== id),
                                                        }))
                                                    }
                                                    className="ml-1 text-red-500 hover:text-red-700 font-bold"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

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

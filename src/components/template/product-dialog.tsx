"use client";

import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormInput, FormListInput, FormSelect, FormTextrea } from "@/components/template/FormField";
import { FormImageCloudinary } from "@/components/template/FormImageClouudinary";
import { Category, ProductData } from "@/lib/types";
import Image from "next/image";
import { Pen, X } from "lucide-react";
import { toast } from "sonner";
import { imageLoader } from "../ui/image-loader";
import { useCrud } from "@/hooks/use-crud";
import { Tols } from "@/generated/prisma";

interface EditProductDialogProps {
    product: ProductData;
    trigger?: React.ReactNode; // tombol pemicu dialog
}

export const EditProductDialog: React.FC<EditProductDialogProps> = ({ product, trigger }) => {
    const [open, setOpen] = useState(false);
    const [editedProduct, setEditedProduct] = useState<ProductData>(product);

    const { update: updateProduct, loading } = useCrud<ProductData>("products");
    const { items: toolsList } = useCrud<Tols>("tools");

    // Sync ulang ketika product berubah
    useEffect(() => {
        setEditedProduct(product);
    }, [product]);

    const handleSave = async () => {
        try {
            await updateProduct(editedProduct);
            toast.success("Product updated successfully");
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update product");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ? trigger : (
                    <Button variant="outline">
                        <Pen /> Edit
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] w-full flex flex-col">
                {/* Header tetap di atas */}
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>

                {/* Bagian form yang bisa discroll */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                    <FormSelect
                        id="category"
                        label="Category"
                        placeholder="Select category"
                        options={Category.map((c) => ({ value: c, label: c }))}
                        value={editedProduct.category}
                        onChange={(value) =>
                            setEditedProduct((prev) => ({
                                ...prev,
                                category: value as string,
                            }))
                        }
                        required
                    />

                    <FormImageCloudinary
                        label="Product Image"
                        value={editedProduct.image}
                        onChange={(url) =>
                            setEditedProduct((prev) => ({ ...prev, image: url }))
                        }
                    />

                    <FormInput
                        id="title"
                        label="Title"
                        placeholder="Product title"
                        value={editedProduct.title}
                        onChange={(e) =>
                            setEditedProduct((prev) => ({ ...prev, title: e.target.value }))
                        }
                        required
                    />

                    <FormTextrea
                        id="description"
                        label="Description"
                        placeholder="Product description"
                        value={editedProduct.description}
                        onChange={(e) =>
                            setEditedProduct((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />

                    <FormInput
                        id="price"
                        label="Price"
                        placeholder="Product price"
                        type="number"
                        value={editedProduct.price}
                        onChange={(e) =>
                            setEditedProduct((prev) => ({
                                ...prev,
                                price: Number(e.target.value),
                            }))
                        }
                        required
                    />

                    <FormListInput
                        label="Features"
                        values={editedProduct.features}
                        onChange={(updated) =>
                            setEditedProduct((prev) => ({ ...prev, features: updated }))
                        }
                        placeholder="Add feature"
                    />

                    <div className="space-y-2">
                        <FormSelect
                            label="Tools"
                            placeholder="Select tools..."
                            multiple={true}
                            value={editedProduct.tools?.map((tool) => tool.id) ?? []}
                            options={toolsList.map((t) => ({
                                value: t.id,
                                label: t.name,
                            }))}
                            onChange={(values) =>
                                setEditedProduct((prev) => ({
                                    ...prev,
                                    tools: toolsList.filter((t) => values.includes(t.id)),
                                }))
                            }
                            required
                        />

                        {editedProduct.tools!.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {editedProduct.tools!.map((tl) => {
                                    const tool = toolsList.find((t) => t.id === tl.id);
                                    if (!tool) return null;
                                    return (
                                        <div
                                            key={tl.id}
                                            className="flex items-center gap-1 px-2 py-1 bg-accent rounded text-sm"
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
                                                    setEditedProduct((prev) => ({
                                                        ...prev,
                                                        tools: prev.tools?.filter((t) => t.id !== tl.id),
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
                </div>

                {/* Footer tetap di bawah */}
                <DialogFooter className="mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
};

"use client"

import { imageLoader } from '@/components/ui/image-loader';
import Loading from '@/components/ui/loding';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { EditProductDialog } from '@/components/template/product-dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { formatRupiah, formattedDate } from '@/lib/utils';
import { useCrud } from '@/hooks/use-crud';
import { ProductData } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const ProductByIdPage = () => {
    const { items: products, loading, remove: deleteProduct } = useCrud<ProductData>("products");

    const { id } = useParams();
    const router = useRouter();

    const product = products.find((p) => p.id === id);


    if (loading) return <Loading />;
    if (!product) return <p>Product not found</p>;

    const handleDelete = async () => {
        try {
            await deleteProduct(product.id);
            toast.success("Product deleted successfully");
            router.push("/products");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className='space-y-4 max-w-4xl mx-auto'>
            <div className="flex gap-4 lg:flex-row flex-col">
                <div className="w-full max-w-xl rounded-2xl border overflow-hidden">
                    <Image
                        priority
                        loader={imageLoader}
                        src={product.image}
                        alt={product.title}
                        width={200}
                        height={200}
                        className='w-full object-cover aspect-square'
                    />
                </div>

                <Card>
                    <CardContent className='space-y-4'>
                        <div>
                            <Badge>{product.category}</Badge><span className='text-xs text-muted-foreground'> ~ {formattedDate(product.createdAt)}</span>
                        </div>
                        <h1 className='text-2xl font-bold text-primary'>{product.title}</h1>
                        <p className='text-lg font-bold'>{formatRupiah(product.price)}</p>

                        <div className="flex items-center gap-2 flex-wrap">
                            {product.tools?.map((tool, i) => (
                                <Badge
                                    key={i}
                                    variant={"outline"}
                                >
                                    <Image
                                        loader={imageLoader}
                                        src={tool.icon}
                                        alt={tool.name}
                                        width={15}
                                        height={15}
                                        className='dark:invert'
                                    />
                                    {tool.name}
                                </Badge>
                            ))}
                        </div>

                        <div className="flex gap-2 w-full">
                            <EditProductDialog product={product} trigger={<Button variant="secondary">Edit</Button>} />
                            <Button variant="destructive" onClick={handleDelete}>
                                Delete
                            </Button>
                            <Button asChild>
                                <Link href={product.demo || "#"}>Demo</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <p className="sm:text-lg text-md">
                {product.description}
            </p>

            <ul className='list-disc ml-4'>
                {product.features.map((feature, index) => (
                    <li key={index} className='sm:text-lg text-md'>{feature}</li>
                ))}
            </ul>
        </div>
    )
}

export default ProductByIdPage

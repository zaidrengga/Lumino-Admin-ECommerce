import { sendNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Validasi field wajib
        if (
            !body.title ||
            !body.description ||
            !body.category ||
            !body.price ||
            !body.image
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const toolConnections =
            body.tools?.length
                ? { connect: body.tools.map((tool: { id: string }) => ({ id: tool.id })) } // <-- BENAR
                : undefined;

        const newProduct = await prisma.product.create({
            data: {
                title: body.title,
                description: body.description,
                category: body.category,
                price: Number(body.price),
                image: body.image,
                features: body.features || [],
                tools: toolConnections,
                demo: body.demo || null,
                rating: 0,
                sales: 0,
                revenue: 0,
            },
            include: { tools: true },
        });

        await sendNotifications({
            type: 'PRODUCT_CREATED',
            content: `Produk baru "${newProduct.title}" telah ditambahkan.`,
            link: `/products/${newProduct.id}`
        });

        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            include: { tools: true }, // sertakan tools
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Failed to fetch products" },
            { status: 500 }
        );
    }
}


export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        // Validasi wajib ada id
        if (!body.id) {
            return NextResponse.json(
                { error: "Product ID is required" },
                { status: 400 }
            );
        }

        // Kalau tidak ada field sama sekali
        if (
            !body.title &&
            !body.description &&
            !body.category &&
            body.price === undefined &&
            !body.image &&
            !body.features &&
            !body.tools
        ) {
            return NextResponse.json(
                { error: "No fields provided to update" },
                { status: 400 }
            );
        }

        // Handle tools (konversi jadi array of { id })
        let toolConnections;
        if (body.tools) {
            toolConnections = {
                set: body.tools.map((tool: any) =>
                    typeof tool === "string" ? { id: tool } : { id: tool.id }
                ),
            };
        }

        const updatedProduct = await prisma.product.update({
            where: { id: body.id },
            data: {
                title: body.title ?? undefined,
                description: body.description ?? undefined,
                category: body.category ?? undefined,
                price:
                    body.price !== undefined
                        ? Number(body.price)
                        : undefined,
                image: body.image ?? undefined,
                features: body.features ?? undefined,
                tools: toolConnections,
            },
            include: { tools: true },
        });

        await sendNotifications({
            type: 'PRODUCT_UPDATED',
            content: `Produk "${updatedProduct.title}" telah diperbarui.`,
            link: `/products/${updatedProduct.id}`
        });

        return NextResponse.json(updatedProduct, { status: 200 });
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Failed to update product" },
            { status: 500 }
        );
    }
}



// DELETE Product
export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.id) {
            return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
        }

        // Ambil data produk sebelum dihapus untuk digunakan di notifikasi
        const productToDelete = await prisma.product.findUnique({
            where: { id: body.id }
        });

        if (!productToDelete) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        await prisma.product.delete({
            where: { id: body.id },
        });

        // --- (OPSIONAL) NOTIFIKASI SAAT PRODUK DIHAPUS ---
        // 4. Panggil fungsi notifikasi setelah produk berhasil dihapus
        await sendNotifications({
            type: 'PRODUCT_UPDATED', // Bisa juga buat tipe baru: PRODUCT_DELETED
            content: `Produk "${productToDelete.title}" telah dihapus.`,
            // Tidak ada link karena produknya sudah tidak ada
        });
        // ----------------------------------------------

        return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
    }
}
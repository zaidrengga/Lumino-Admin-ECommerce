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
                ? { connect: body.tools.map((id: string) => ({ id })) }
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
                rating: 0,
                sales: 0,
                revenue: 0,
            },
            include: { tools: true },
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

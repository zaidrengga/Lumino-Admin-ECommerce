import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const tool = await prisma.tols.createMany({ data: body });
        return NextResponse.json(tool);
    } catch (error) {
        console.error("Error creating tool:", error);
        return NextResponse.json({ error: "Failed to create tool" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const tools = await prisma.tols.findMany({
            orderBy: { name: "asc" },
        });
        return NextResponse.json(tools);
    } catch (error) {
        console.error("Error fetching tools:", error);
        return NextResponse.json({ error: "Failed to fetch tools" }, { status: 500 });
    }
}
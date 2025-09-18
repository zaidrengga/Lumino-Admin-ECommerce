import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        if (!body) {
            return NextResponse.json({ error: "No data provided" }, { status: 400 });
        }
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
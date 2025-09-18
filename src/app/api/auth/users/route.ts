import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            orderBy: { createAt: "desc" }
        });
        if (!users) {
            return NextResponse.json(
                { error: "Failed to fetch users" },
                { status: 500 }
            );
        }

        return NextResponse.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

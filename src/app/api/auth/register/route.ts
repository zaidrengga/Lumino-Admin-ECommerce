import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {

    const password = await bcrypt.hash("admin123", 4)

    await prisma.users.create({
        data: {
            username: "Admin Lumino",
            user_email: "admin@gmail.com",
            user_password: password
        }
    })

    NextResponse.json([{"message": "nice"}])
}
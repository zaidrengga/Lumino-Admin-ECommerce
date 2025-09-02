import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: NextRequest) {
    try {
        const { user_email, user_password } = await req.json();

        const user = await prisma.users.findUnique({ where: { user_email } });
        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
        }

        const valid = await bcrypt.compare(user_password, user.user_password);
        if (!valid) {
            return NextResponse.json({ error: "Password salah" }, { status: 401 });
        }

        // buat token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, user_email: user.user_email, role: user.role, createAt: user.createAt },
            JWT_SECRET as string,
            { expiresIn: "1d" }
        );

        // buat response dan set cookie
        const response = NextResponse.json({
            message: "Login berhasil", user: {
                id: user.id,
                username: user.username,
                user_email: user.user_email,
                role: user.role,
                createdAt: user.createAt
            }
        });
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 hari
            path: "/",
        });

        return response;
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Gagal login" }, { status: 500 });
    }
}


export async function GET(req: NextRequest) {
    try {
        const cookieStore = req.cookies;
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

        const user = await prisma.users.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Gagal mendapatkan user" }, { status: 500 });
    }
}
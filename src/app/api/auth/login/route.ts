// file: app/api/auth/login/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";


// Helper function untuk mendapatkan dan meng-encode JWT Secret
function getJwtSecretKey(): Uint8Array {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

    if (!secret) {
        throw new Error("JWT Secret key is not set in environment variables!");
    }
    return secret;
}

// === FUNGSI LOGIN (POST) ===
export async function POST(req: NextRequest) {
    try {
        const { user_email, user_password } = await req.json();

        if (!user_email || !user_password) {
            return NextResponse.json({ error: "Email dan password wajib diisi" }, { status: 400 });
        }

        const user = await prisma.users.findUnique({ where: { user_email } });
        if (!user) {
            return NextResponse.json({ error: "Kredensial tidak valid" }, { status: 401 });
        }

        const isPasswordValid = await bcrypt.compare(user_password, user.user_password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Kredensial tidak valid" }, { status: 401 });
        }

        // --- Perubahan utama: Membuat token dengan 'jose' ---
        const token = await new SignJWT({
            // Payload bisa lebih ringkas, data lengkap bisa diambil dari GET
            username: user.username,
            role: user.role,
        })
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(user.id) // 'sub' (subject) adalah klaim standar untuk user ID
            .setIssuedAt()
            .setExpirationTime("1d") // Waktu kedaluwarsa
            .sign(getJwtSecretKey()); // Tanda tangani dengan secret

        const response = NextResponse.json({
            message: "Login berhasil",
            user: {
                id: user.id,
                username: user.username,
                user_email: user.user_email,
                role: user.role,
            }
        }, { status: 200 });

        // Set token di cookie
        response.cookies.set({
            name: "token",
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 1 hari
            path: "/",
        });

        return response;

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Terjadi kesalahan pada server" }, { status: 500 });
    }
}


// === FUNGSI CEK SESI (GET) ===
export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // --- Perubahan utama: Memverifikasi token dengan 'jose' ---
        const { payload } = await jwtVerify(token, getJwtSecretKey());

        const userId = payload.sub; // Ambil ID dari klaim 'sub'

        if (!userId) {
            return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                username: true,
                user_email: true,
                role: true,
                createAt: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        // Error dari jwtVerify (token tidak valid/kedaluwarsa) akan ditangkap di sini
        console.error("Verification failed:", error);
        return NextResponse.json({ message: "Unauthorized: Sesi tidak valid" }, { status: 401 });
    }
}
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value;

    // === 1. Kalau belum ada token ===
    if (!token) {
        // Hanya izinkan /login dan /api/auth/login
        if (pathname.startsWith("/login") || pathname.startsWith("/api/auth/login")) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }

    try {
        const { payload } = await jwtVerify(token, secret);

        // === 2. Kalau bukan admin ===
        if (String(payload.role).toLowerCase() !== "admin") {
            if (pathname.startsWith("/login") || pathname.startsWith("/api/auth/login")) {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL("/login", req.url));
        }

        // === 3. Kalau sudah login admin & coba akses /login → lempar ke / ===
        if (pathname.startsWith("/login")) {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // === 4. Admin valid → lanjutkan ===
        return NextResponse.next();
    } catch (error) {
        console.error("JWT verification failed:", error);

        // Token invalid → treat sama seperti belum login
        if (pathname.startsWith("/login") || pathname.startsWith("/api/auth/login")) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL("/login", req.url));
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

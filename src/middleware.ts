import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;

    // kalau belum login → redirect ke /login
    if (!token && !req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // kalau sudah login → jangan boleh buka /login lagi
    if (token && req.nextUrl.pathname.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Middleware ini ngejaga semua route kecuali asset static & API
export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

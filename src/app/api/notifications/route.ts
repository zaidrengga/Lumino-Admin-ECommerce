import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";



export async function GET() {
    try {
        const notifctions = await prisma.notification.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include: {
                user: true,

            }
        })

        return NextResponse.json(notifctions, { status: 200 })
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.id) {
            return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
        }

        const notifications = await prisma.notification.delete({
            where: {
                id: body.id
            }
        })

        return NextResponse.json(notifications, { status: 200 })
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return NextResponse.json({ error: "Failed to delete notifications" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        if (!body.id) {
            return NextResponse.json({ error: "Notification ID is required" }, { status: 400 });
        }

        const notifications = await prisma.notification.update({
            where: {
                id: body.id
            },
            data: {
                isRead: true
            }
        })

        return NextResponse.json(notifications, { status: 200 })
    } catch (error) {
        console.error("Error deleting notifications:", error);
        return NextResponse.json({ error: "Failed to delete notifications" }, { status: 500 });
    }
}
// @/lib/notifications.ts

import { NotificationType } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";

interface NotificationPayload {
    userId?: string;
    type: NotificationType;
    content: string;
    link?: string;
}

export async function sendNotifications({ userId, type, content, link }: NotificationPayload) {
    try {
        if (!userId) {
            // 1. Cari semua user yang rolenya adalah 'admin'
            const admins = await prisma.users.findMany({
                where: { role: 'admin' },
                select: { id: true }
            });

            if (admins.length === 0) {
                console.log("No admins found to notify.");
                return;
            }
            const notificationData = admins.map(admin => ({
                userId: admin.id,
                type,
                content,
                link: link || null,
            }));

            await prisma.notification.createMany({
                data: notificationData
            })
        }


        await prisma.notification.create({
            data: {
                userId: userId || "",
                type,
                content,
                link: link || null,
            },
        });

    } catch (error) {
        console.error("Failed to create admin notifications:", error);
        // Penting: Proses ini sebaiknya tidak menghentikan respons utama ke user.
        // Jadi, kita hanya log error-nya saja.
    }
}
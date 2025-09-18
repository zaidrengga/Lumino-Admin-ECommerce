import { StatusOrder } from "@/generated/prisma";
import { formatRupiah } from "@/lib/format";
import { sendNotifications } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const orders = await prisma.order.findMany({
            orderBy: { createAt: "desc" },
        });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        return NextResponse.json(
            { error: "Failed to fetch orders" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        if (
            !body.user_id ||
            !body.product_id
        ) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const count = await prisma.order.count();

        // bikin ID baru
        const orderId = `ORDER#${count + 1}`;

        const newOrder = await prisma.order.create({
            data: {
                id: orderId,
                user_id: body.user_id,
                product_id: body.product_id,
                total_price: body.total_price
            },
        });

        await sendNotifications({
            userId: body.user_id,
            type: "NEW_ORDER_RECEIVED",
            content: `Order baru senilai ${formatRupiah(newOrder.total_price)} telah dibuat.`,
            link: `/orders/${newOrder.id}`,
        })

        return NextResponse.json(newOrder, { status: 201 });

    } catch (error) {
        console.error("Error creating order:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

// --- UPDATE ORDER STATUS ---
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, status } = body;

        // Validasi input
        if (!id || !status) {
            return NextResponse.json(
                { error: "Missing required fields: id, status" },
                { status: 400 }
            );
        }

        // Validasi apakah status yang diberikan valid
        if (!Object.values(StatusOrder).includes(status)) {
            return NextResponse.json({ error: `Invalid status value. Must be one of: ${Object.values(StatusOrder).join(', ')}` }, { status: 400 });
        }

        // Update status order
        const updatedOrder = await prisma.order.update({
            where: { id },
            data: { status },
        });

        if (status === "Finished") {
            await sendNotifications({
                userId: updatedOrder.user_id,
                type: "ORDER_STATUS",
                content: `Pesanan ${id} telah Di Selesaikan.`,
                link: `/orders/${id}`
            });
        } else if (status === "Canceled") {
            await sendNotifications({
                userId: updatedOrder.user_id,
                type: "ORDER_STATUS",
                content: `Pesanan ${id} telah Di Batalkan.`,
                link: `/orders/${id}`
            });
        } else if (status === "Process") {
            await sendNotifications({
                userId: updatedOrder.user_id,
                type: "ORDER_STATUS",
                content: `Pesanan ${id} telah Di Proses.`,
                link: `/orders/${id}`
            });
        }

        return NextResponse.json(updatedOrder, { status: 200 });
    } catch (error) {
        console.error("Error updating order status:", error);
        // Handle jika order tidak ditemukan
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }
        return NextResponse.json(
            { error: "Failed to update order status" },
            { status: 500 }
        );
    }
}


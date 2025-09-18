"use client"

import { Card, CardContent } from '@/components/ui/card'
import Loading from '@/components/ui/loding'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Order, StatusOrder, Users } from '@/generated/prisma'
import { useCrud } from '@/hooks/use-crud'
import { formatRupiah, formattedDate } from '@/lib/utils'
import { ProductData } from '@/lib/types'
import Link from 'next/link'
import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import clsx from 'clsx'

const statusOptions = [
    { value: "Panding", color: "text-yellow-500" },
    { value: "Process", color: "text-blue-500" },
    { value: "Finished", color: "text-green-500" },
    { value: "Cancelled", color: "text-red-500" },
]

const OrderPage = () => {
    // ✅ cukup sekali panggil useCrud untuk orders
    const { items: orders, loading: orderLoading, update: updateOrder } = useCrud<Order>("orders");
    const { items: products, loading: productLoading } = useCrud<ProductData>("products");
    const { items: users, loading: userLoading } = useCrud<Users>("auth/users");

    const handleUpdateStatus = async (id: string, status: StatusOrder) => {
        try {
            await updateOrder({
                id,
                status,
                createAt: orders.find((order) => order.id === id)?.createAt as Date,
                updateAt: new Date(),
                total_price: orders.find((order) => order.id === id)?.total_price as number,
                product_id: orders.find((order) => order.id === id)?.product_id as string,
                user_id: orders.find((order) => order.id === id)?.user_id as string
            });
        } catch (err) {
            console.error("Failed to update order status:", err)
        }
    }

    if (orderLoading || productLoading || userLoading) return <Loading />

    return (
        <div className="space-y-4">
            <h1 className='text-2xl font-bold text-primary'>Order</h1>

            <div className="rounded-lg border overflow-hidden overflow-x-auto">
                <Table>
                    <TableHeader className='bg-card'>
                        <TableRow>
                            <TableHead>OrderId</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>
                                        {users.find((user) => user.id === order.user_id)?.username}
                                    </TableCell>
                                    <TableCell>
                                        {products.find((product) => product.id === order.product_id)?.title}
                                        <Link href={`/products/${order.product_id}`} className='text-blue-500 hover:underline ml-4'>
                                            View
                                        </Link>
                                    </TableCell>
                                    <TableCell>{formatRupiah(order.total_price)}</TableCell>
                                    <TableCell>{formattedDate(order.createAt)}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={order.status}
                                            onValueChange={(val) => handleUpdateStatus(order.id, val as StatusOrder)}
                                        >
                                            <SelectTrigger className="w-[140px]">
                                                <SelectValue placeholder="Pilih status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        <span className={clsx(status.color)}>{status.value}</span>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center">
                                    No orders found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default OrderPage

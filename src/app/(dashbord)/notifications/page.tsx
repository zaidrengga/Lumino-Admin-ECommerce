"use client"

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Loading from '@/components/ui/loding'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useCrud } from '@/hooks/use-crud'
import { formattedDate } from '@/lib/utils'
import { NotificationData } from '@/lib/types'
import { Info, Trash2 } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NotificationsPage = () => {
    const { items: notifications, loading: loadingNotifications, remove: removeNotification, update } = useCrud<NotificationData>("notifications")

    if (loadingNotifications) return <Loading />
    return (
        <div className="space-y-4">
            <h1 className='text-2xl font-bold text-primary'>Notifikasi</h1>

            <Card>
                <CardContent className='flex items-center justify-between'>
                    <div className="flex items-center gap-2">
                        <h2 className='text-lg font-semibold'>{notifications.length} Notifikasi</h2>
                        <p className='text-sm text-muted-foreground'>({notifications.filter((n) => !n.isRead).length} belum terbaca)</p>
                    </div>

                    <div className="flex items-center gap-2">
                    </div>
                </CardContent>
            </Card>

            <div className="border bg-card overflow-hidden rounded-lg">
                <Table className='overflow-x-auto'>
                    <TableHeader className='bg-muted'>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {notifications.length > 0 ? notifications.map((notification) => (
                            <TableRow key={notification.id}>
                                <TableCell>{formattedDate(notification.createdAt)}</TableCell>
                                <TableCell>{notification.user.username}</TableCell>
                                <TableCell>{notification.content}</TableCell>
                                <TableCell>
                                    <Badge variant={notification.isRead ? "outline" : "default"}>{notification.isRead ? "Terbaca" : "Belum Terbaca"}</Badge>
                                </TableCell>
                                <TableCell className='text-right space-x-2'>
                                    <Button size="icon" asChild>
                                        <Link href={notification.link || "#"} onClick={() => update(notification)}>
                                            <Info />
                                        </Link>
                                    </Button>
                                    <Button variant='destructive' size="icon" onClick={() => removeNotification(notification.id)}><Trash2 /></Button>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={5} className='text-center'>Tidak ada notifikasi</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default NotificationsPage
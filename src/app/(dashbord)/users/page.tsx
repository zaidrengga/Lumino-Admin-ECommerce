"use client"

import { Button } from '@/components/ui/button'
import Loading from '@/components/ui/loding'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Users } from '@/generated/prisma'
import { useCrud } from '@/hooks/use-crud'
import React from 'react'

const UsersPage = () => {
    const { items: users, loading: loadingUsers, remove: removeUser } = useCrud<Users>("auth/users");

    if (loadingUsers) return <Loading />
    return (
        <div className="space-y-4">
            <h1 className='text-2xl font-bold text-primary'>Users</h1>

            <div className="border bg-card overflow-hidden rounded-lg">
                <Table className='overflow-x-auto'>
                    <TableHeader className='bg-muted'>
                        <TableRow>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.user_email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default UsersPage
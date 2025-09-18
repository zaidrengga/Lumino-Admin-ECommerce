"use client";

import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, BanknoteArrowUp, ListOrdered, Package } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { CardChartArea } from '@/components/template/CardChartArea';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loding';
import { useCrud } from '@/hooks/use-crud';
import { ProductData } from '@/lib/types';
import { Notification, Order } from '@/generated/prisma';
import { formatRupiah, formattedDate } from '@/lib/utils';

const Home = () => {
  const { items: products, loading: loadingProduct } = useCrud<ProductData>("products");
  const { items: orders, loading: loadingOrder } = useCrud<Order>("orders");
  const { items: notification, loading: loadingNotification } = useCrud<Notification>("notifications");

  const data = [
    {
      id: 1,
      title: 'Penjualan',
      value: formatRupiah(orders.filter((order) => order.status === "Finished").reduce((total, order) => total + order.total_price, 0)) || "Rp 0",
      link: '#',
      icon: BanknoteArrowUp,
      color: 'text-green-500',
    },
    {
      id: 2,
      title: 'Produk',
      value: products.length.toString(),
      link: '/products',
      icon: Package,
      color: 'text-blue-500',
    },
    {
      id: 3,
      title: 'Order',
      value: orders.length.toString(),
      link: '/orders',
      icon: ListOrdered,
      color: 'text-yellow-500',
    },
  ];

  const acktivitasTerbaru = notification.slice(0, 4);

  if (loadingProduct || loadingOrder || loadingNotification) return <Loading />

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h1 className="text-2xl font-bold">
              Selamat Datang di <br />
              <span className="text-3xl text-primary">Dashboard Lumino</span>
            </h1>
            <p className="text-muted-foreground">
              Dashboard ini digunakan untuk mengelola penjualan dan produk di Lumino.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4">
          {data.map((item) => (
            <Card key={item.id} className='hover:scale-105 hover:shadow-md transition-all'>
              <CardContent className="flex flex-col items-center justify-center">
                <item.icon className={clsx(item.color, 'w-12 h-12')} />
                <h1 className="text-lg font-bold">{item.title}</h1>
                <p className="text-muted-foreground text-nowrap">{item.value}</p>
                <Link href={item.link} className="text-blue-500 text-sm hover:underline">Lihat Detail</Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <CardChartArea
        orders={orders.map(o => ({
          ...o,
          createAt: o.createAt.toString(),
        }))}
        label='Penjualan'
        title='Grafik Penjualan'
        subtitle='Grafik penjualan Produk Lumino'
      />
      <section className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Aktivitas Terbaru</h2>
            <ul className="space-y-2">
              {acktivitasTerbaru.length > 0 ? (
                acktivitasTerbaru.map((item) => (
                  <li key={item.id} className="flex justify-between border rounded-lg p-2 hover:scale-[1.02] hover:shadow-md transition-all">
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.content}</span>
                      <span className="text-muted-foreground text-sm">{formattedDate(item.createdAt)}</span>
                    </div>
                    <Button variant="link" asChild>
                      <Link href={item.link || "#"}>Lihat Detail <ArrowUpRight /></Link>
                    </Button>
                  </li>
                ))
              ) : (
                <li className="flex items-center justify-center">
                  <span className="text-muted-foreground">Tidak ada aktivitas terbaru</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>


        <Card>
          <CardContent>
            <h2 className='text-lg font-semibold mb-2'>Produk Terbaru</h2>
            <ul className="space-y-2">
              {products.length > 0 ? (
                products.map((item) => (
                  <li key={item.id} className="flex justify-between border rounded-lg p-2 hover:scale-[1.02] hover:shadow-md transition-all">
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-muted-foreground text-sm">{formatRupiah(item.price)}</span>
                    </div>
                    <Button variant="link" asChild>
                      <Link href={`/products/${item.id}`}>Lihat Detail <ArrowUpRight /></Link>
                    </Button>
                  </li>
                ))
              ) : (
                <li className="flex items-center justify-center">
                  <span className="text-muted-foreground">Tidak ada produk terbaru</span>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Home;

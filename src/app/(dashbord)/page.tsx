import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight, BanknoteArrowUp, ListOrdered, Package } from 'lucide-react';
import React from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { CardChartArea } from '@/components/template/CardChartArea';
import { Button } from '@/components/ui/button';

const Home = () => {
  const data = [
    {
      id: 1,
      title: 'Penjualan',
      value: 'Rp 1.000.000',
      link: '#',
      icon: BanknoteArrowUp,
      color: 'text-green-500',
    },
    {
      id: 2,
      title: 'Produk',
      value: '100',
      link: '#',
      icon: Package,
      color: 'text-blue-500',
    },
    {
      id: 3,
      title: 'Order',
      value: '20',
      link: '#',
      icon: ListOrdered,
      color: 'text-yellow-500',
    },
  ];

  const chartData = [
    { date: "Jan", value: 120 },
    { date: "Feb", value: 200 },
    { date: "Mar", value: 150 },
    { date: "Apr", value: 300 },
    { date: "Mei", value: 250 },
  ];

  const acktivitasTerbaru = [
    {
      id: 1,
      title: 'Order #1234 dibuat',
      date: '2023-06-01',
      link: '#',
    },
    {
      id: 2,
      title: 'Produk Laptop ditambahkan',
      date: '2023-06-02',
      link: '#',
    },
    {
      id: 3,
      title: 'Order #5678 dibuat',
      date: '2023-06-03',
      link: '#',
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardContent>
            <h1 className="text-3xl font-bold">
              Selamat Datang di <br />
              <span className="text-primary">Dashboard Lumino</span>
            </h1>
            <p className="text-muted-foreground">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quae.
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

      <section className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
        <CardChartArea
          data={chartData}
          label='Penjualan'
          title='Grafik Penjualan'
          subtitle='Grafik penjualan bulan ini'
        />
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2">Aktivitas Terbaru</h2>
            <ul className="space-y-2">
              {acktivitasTerbaru.map((item) => (
                <li key={item.id} className="flex justify-between border rounded-lg p-2 hover:scale-105 hover:shadow-md transition-all">
                  <div className="flex flex-col">
                    <span className="font-semibold">{item.title}</span>
                    <span className="text-muted-foreground text-sm">{item.date}</span>
                  </div>
                  <Button variant="link" asChild>
                    <Link href={item.link}>Lihat Detail <ArrowUpRight /></Link>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

      </section>
    </div>
  );
};

export default Home;

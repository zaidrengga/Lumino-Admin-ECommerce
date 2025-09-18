"use client"

import { useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Order {
    createAt: string | Date
    total_price: number
    product_id: string
    status: string
}

export interface CardChartAreaProps {
    orders: Order[]
    label: string
    title?: string
    subtitle?: string
}

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"]

function sumOrders(orders: Order[], modeValue: "count" | "price") {
    if (modeValue === "price") {
        return orders.reduce((sum, o) => sum + o.total_price, 0)
    } else {
        return orders.length // count transaksi (per produk)
    }
}

function getSalesPerMonth(orders: Order[], year: number, modeValue: "count" | "price") {
    return Array.from({ length: 12 }, (_, i) => {
        const filtered = orders.filter(
            (o) =>
                o.status === "Finished" &&
                new Date(o.createAt).getFullYear() === year &&
                new Date(o.createAt).getMonth() === i
        )

        return {
            date: monthNames[i],
            value: sumOrders(filtered, modeValue),
        }
    })
}

function getSalesPerDay(orders: Order[], year: number, month: number, modeValue: "count" | "price") {
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    return Array.from({ length: daysInMonth }, (_, i) => {
        const filtered = orders.filter(
            (o) =>
                o.status === "Finished" &&
                new Date(o.createAt).getFullYear() === year &&
                new Date(o.createAt).getMonth() === month &&
                new Date(o.createAt).getDate() === i + 1
        )

        return {
            date: `${i + 1}`,
            value: sumOrders(filtered, modeValue),
        }
    })
}

function getSalesPerYear(orders: Order[], modeValue: "count" | "price") {
    const yearSet = Array.from(new Set(orders.map((o) => new Date(o.createAt).getFullYear()))).sort()
    return yearSet.map((y) => {
        const filtered = orders.filter(
            (o) => o.status === "Finished" && new Date(o.createAt).getFullYear() === y
        )

        return {
            date: `${y}`,
            value: sumOrders(filtered, modeValue),
        }
    })
}

export function CardChartArea({ orders, label, title, subtitle }: CardChartAreaProps) {
    const currentYear = new Date().getFullYear()

    const [mode, setMode] = useState<"year" | "month" | "day">("month")
    const [year, setYear] = useState(currentYear)
    const [month, setMonth] = useState<number | null>(null)
    const [modeValue, setModeValue] = useState<"count" | "price">("price")

    let chartData = [{ date: "", value: 0 }]
    if (mode === "year") {
        chartData = getSalesPerYear(orders, modeValue)
    } else if (mode === "month") {
        chartData = getSalesPerMonth(orders, year, modeValue)
    } else if (mode === "day" && month !== null) {
        chartData = getSalesPerDay(orders, year, month, modeValue)
    }

    const chartConfig = {
        desktop: {
            label: modeValue === "price" ? "Total Harga" : "Jumlah Order",
            color: "var(--primary)",
        },
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                    <CardTitle className="text-lg">{title}</CardTitle>
                    <CardDescription>{subtitle}</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                    {/* Mode Value */}
                    <Select value={modeValue} onValueChange={(val) => setModeValue(val as any)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Jenis Data" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="price">Total Harga</SelectItem>
                            <SelectItem value="count">Jumlah Order</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Mode Waktu */}
                    <Select value={mode} onValueChange={(val) => setMode(val as any)}>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Mode" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="year">Tahunan</SelectItem>
                            <SelectItem value="month">Bulanan</SelectItem>
                            <SelectItem value="day">Harian</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Pilih Tahun */}
                    {(mode === "month" || mode === "day") && (
                        <Select value={String(year)} onValueChange={(val) => setYear(Number(val))}>
                            <SelectTrigger className="w-[100px]">
                                <SelectValue placeholder="Tahun" />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
                                    <SelectItem key={y} value={String(y)}>
                                        {y}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}

                    {/* Pilih Bulan */}
                    {mode === "day" && (
                        <Select
                            value={month !== null ? String(month) : ""}
                            onValueChange={(val) => setMonth(val === "" ? null : Number(val))}
                        >
                            <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Pilih Bulan" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthNames.map((m, idx) => (
                                    <SelectItem key={idx} value={String(idx)}>
                                        {m}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                <ChartContainer className="w-full h-52" config={chartConfig}>
                    <AreaChart accessibilityLayer data={chartData} margin={{ right: 12, left: 0 }}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis axisLine={false} tickLine={false} width={40} domain={[0, "dataMax + 50"]} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Area
                            dataKey="value"
                            type="natural"
                            fill="var(--primary)"
                            fillOpacity={0.4}
                            stroke="var(--primary)"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

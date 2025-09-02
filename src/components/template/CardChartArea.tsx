"use client"

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

export interface CardChartAreaProps {
    data: { date: string; value: number }[];
    label: string;
    title?: string;
    subtitle?: string;
}


export function CardChartArea({ data, label, title, subtitle }: CardChartAreaProps) {

    const chartConfig = {
        desktop: {
            label: label,
            color: "var(--primary)",
        },
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer className="w-full h-52" config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={data}
                        margin={{
                            right: 12,
                            left: 0,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            width={30}
                            domain={[0, 'dataMax + 50']} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
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

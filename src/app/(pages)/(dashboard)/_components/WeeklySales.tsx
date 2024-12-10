'use client';
import React from 'react';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card } from '@/components/ui/card';

const chartData = [
  { month: 'January', amount: 50, Card: 186, Cash: 80 },
  { month: 'February', amount: 100, Card: 305, Cash: 200 },
  { month: 'March', amount: 150, Card: 237, Cash: 120 },
  { month: 'April', amount: 200, Card: 73, Cash: 190 },
  { month: 'May', amount: 250, Card: 209, Cash: 130 },
  { month: 'June', amount: 300, Card: 214, Cash: 140 },
];

const chartConfig = {
  Card: {
    label: 'Card',
    color: 'hsl(var(--chart-1))',
  },
  Cash: {
    label: 'Cash',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const WeeklySales = () => {
  return (
    <div className="w-full">
      <p className="prose prose-xl">Weekly Sales</p>
      <Card className="">
        <ChartContainer config={chartConfig} className="max-h-[20.5rem] bg-white rounded-md pt-6 w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis dataKey="amount" tickLine={true} tickMargin={8} axisLine={true} tickFormatter={(value) => value} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
            <Bar dataKey="Card" fill="var(--color-Card)" radius={4} />
            <Bar dataKey="Cash" fill="var(--color-Cash)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Card>
    </div>
  );
};

export default WeeklySales;

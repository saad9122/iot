'use client';
import React from 'react';
import { LabelList, Pie, PieChart } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Card } from '@/components/ui/card';

const chartConfig = {
  sales: {
    label: 'Sales',
  },
  Cash: {
    label: 'Direct Cash',
    color: 'hsl(var(--chart-1))',
  },
  Wallets: {
    label: 'Wallets',
    color: 'hsl(var(--chart-2))',
  },
  Cheques: {
    label: 'Cheques',
    color: 'hsl(var(--chart-3))',
  },
  Cards: {
    label: 'Cards',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const chartData = [
  { accountType: 'Cash', sales: 25, fill: 'var(--primary)' },
  { accountType: 'Wallets', sales: 15, fill: 'hsl(var(--chart-1))' },
  { accountType: 'Cheques', sales: 25, fill: 'hsl(var(--chart-3))' },
  { accountType: 'Cards', sales: 35, fill: 'hsl(var(--chart-4))' },
];

const SalesStats = () => {
  return (
    <div className="w-full">
      <div className="">
        <p className="prose prose-xl">Daily Sales Stats</p>

        <Card className="flex justify-center items-stretch w-full">
          <ChartContainer config={chartConfig} className="aspect-square h-[20.5rem] min-w-[10] block">
            <PieChart>
              <Pie data={chartData} dataKey="sales" nameKey="accountType" innerRadius={50} />
              <LabelList
                dataKey="accountType"
                className="text-black bg-white"
                stroke="none"
                fontSize={40}
                formatter={(value: keyof typeof chartConfig) => chartConfig[value]?.label}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={<ChartLegendContent nameKey="accountType" />}
                className=" flex-wrap [&>*]:basis-1/4 [&>*]:justify-center text-black text-sm text-nowrap"
              />
            </PieChart>
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
};

export default SalesStats;

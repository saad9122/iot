'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Card } from '@/components/ui/card';
const chartData = [
  { month: 'January', amount: 50, desktop: 186 },
  { month: 'February', amount: 100, desktop: 280 },
  { month: 'March', amount: 150, desktop: 237 },
  { month: 'April', amount: 200, desktop: 73 },
  { month: 'May', amount: 250, desktop: 209 },
  { month: 'June', amount: 300, desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

function BalanceHistory() {
  return (
    <div className="w-full">
      <p className="prose prose-xl">Balance history</p>
      <Card className="w-full h-[20.5rem] flex justify-center">
        <ChartContainer config={chartConfig} className="w-full h-full bg-white rounded-e-lg p-2 pt-6">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis dataKey="amount" tickLine={true} axisLine={true} tickMargin={8} tickFormatter={(value) => value} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="desktop"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </Card>
    </div>
  );
}

export default BalanceHistory;

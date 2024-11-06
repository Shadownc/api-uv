'use client';

import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ApiCallStats } from '@/types/api';

interface LineChartProps {
  data: ApiCallStats[];
}

export default function LineChart({ data }: LineChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#1a56db" />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
} 
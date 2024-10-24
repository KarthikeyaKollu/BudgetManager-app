"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Custom label for displaying values inside bars
const CustomBarLabel = ({ x, y, width, height, value }) => (
  <text
    x={x + width / 2}
    y={height === 0 ? y - 10 : y + height / 2} // Show label above bar if height is 0
    fill="black"
    textAnchor="middle"
    dominantBaseline="central"
    fontSize="12"
    fontWeight="bold"
  >
    ₹{value}
  </text>
);

// Custom label to display total above each bar
const TotalLabel = ({ x, y, total }) => (
  <text
    x={x}
    y={y}
    textAnchor="middle"
    fill="black"
    fontSize="14"
    fontWeight="bold"
  >
    ₹{total}
  </text>
);

// Tooltip for displaying detailed values
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
        <p className="font-bold">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.fill }}>
            {entry.name}: ₹{entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
}

const COLORS = ["#27AE60", "#f2c94c", "#bfc5d4"]; // Colors for the categories

export default function BarChartComponent({ data }) {
  return (
    <Card className="w-[654px] h-[632px] bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
      <CardHeader>
        <p className="font-bold text-lg">Last Week</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={550}>
          <BarChart data={data} margin={{ top: 40, right: 0, left: 0, bottom: 0 }} barSize={53}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              interval={0}
              padding={{ right: 20 }} // Extra space between "Yesterday" and "Today"
            />
            <YAxis
              tickFormatter={(value) => `₹${value}`}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />

            {data.map((entry, index) => {
              const totalHeight = entry.essential + entry.nonEssential + entry.miscellaneous;
              const yPosition = totalHeight > 0 ? 550 - (totalHeight / 10) - 10 : 550 - 10; // Add padding when totalHeight is 0
              return (
                <TotalLabel
                  key={`total-${index}`}
                  x={index * 80 + 55} // Center the label above the bar
                  y={yPosition} // Adjusted Y position based on total height
                  total={totalHeight} // Pass the total height as the label
                />
              );
            })}

            <Bar
              dataKey="essential"
              stackId="a"
              fill={COLORS[0]}
              radius={[0, 0, 0, 0]}
              label={<CustomBarLabel />}
            />
            <Bar
              dataKey="nonEssential"
              stackId="a"
              fill={COLORS[1]}
              radius={[0, 0, 0, 0]}
              label={<CustomBarLabel />}
            />
            <Bar
              dataKey="miscellaneous"
              stackId="a"
              fill={COLORS[2]}
              radius={[4, 4, 0, 0]}
              label={<CustomBarLabel />}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

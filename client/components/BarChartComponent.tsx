"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"



const data = [
  { date: "5th Mar", lower: 550, upper: 300, extra: 480, total: 356 },
  { date: "6th Mar", lower: 300, upper: 199, extra: 320, total: 998 },
  { date: "7th Mar", lower: 580, upper: 800, extra: 1780, total: 3560 },
  { date: "8th Mar", lower: 500, upper: 800, extra: 1780, total: 356 },
  { date: "9th Mar", lower: 980, upper: 800, extra: 1780, total: 356 },
  { date: "Yesterday", lower: 0, upper: 0, extra: 0, total: 10 },
  { date: "Today", lower: 800, upper: 600, extra: 180, total: 356 },
]

// Custom label for displaying values inside bars
const CustomBarLabel = ({ x, y, width, height, value }) => (
  <text
    x={x + width / 2}
    y={y + height / 2}
    fill="black"
    textAnchor="middle"
    dominantBaseline="central"
    fontSize="12"
    fontWeight="bold"
  >
    ₹{value}
  </text>
)

// Custom label to display total above each bar
const TotalLabel = ({ x, y, total }) => (
  <text
    x={x}
    y={y} // Adjust to show the label directly above the bar
    textAnchor="middle"
    fill="black"
    fontSize="14"
    fontWeight="bold"
  >
    ₹{total}
  </text>
)

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
    )
  }
  return null
}
const COLORS = ["#27AE60", "#f2c94c", "#bfc5d4"]

export default function BarChartComponent() {
  return (
    <Card className="w-[654px] h-[632px]  bg-white rounded-[16px] shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
      <CardHeader>
        <p className="font-bold text-lg">Last week</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={550}>

          <BarChart data={data} margin={{ top: 40, right: 0, left: 0, bottom: 0 }} barSize={53}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              // axisLine={{ stroke: '#94A3B8' }}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              // tickMargin={18}
              interval={0}
              padding={{ right: 20 }} // Extra space between "Yesterday" and "Today"

            />
            <YAxis
              tickFormatter={(value) => `₹${value}`}
              // axisLine={{ stroke: '#94A3B8' }}
              tick={{ fill: '#94A3B8', fontSize: 12 }}
              // tickMargin={10}
              interval={0}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }} />

            {data.map((entry, index) => {
              const totalHeight = entry.lower + entry.upper + entry.extra;
              // Calculate the Y position for total labels
              const yPosition = totalHeight > 0 ? 550 - (totalHeight / 10) - 10 : 550 - 10; // Add padding when totalHeight is 0
              return (
                <TotalLabel
                  key={`total-${index}`}
                  x={index * 80 + 55} // Center the label above the bar
                  y={yPosition} // Adjusted Y position based on total height
                  total={entry.total}
                />
              );
            })}

            <Bar
              dataKey="lower"
              stackId="a"
              fill={COLORS[0]}
              radius={[0, 0, 0, 0]}
              label={<CustomBarLabel />}
            />
            <Bar
              dataKey="upper"
              stackId="a"
              fill={COLORS[1]}
              radius={[0, 0, 0, 0]}
              label={<CustomBarLabel />}
            />
            <Bar
              dataKey="extra"
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

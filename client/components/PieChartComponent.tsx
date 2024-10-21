"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"



const COLORS = ["#27AE60", "#f2c94c", "#bfc5d4"]



// Adjust the donut width here
const donutWidth = 60 // in pixels

interface CustomLabelProps {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
  index: number
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={14}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function PieChartComponent({percentages}) {
  const outerRadius = 134 // Adjusted to fit within 269.03px
  const innerRadius = outerRadius - donutWidth
  const data = [
    { name: "Essentials", value: percentages[0] },
    { name: "Non-Essentials", value: percentages[1] },
    { name: "Miscellaneous", value: percentages[2] },
  ]
  return (
    <ChartContainer
      config={{
        categoryA: { label: "Essentials", color: COLORS[0] },
        categoryB: { label: "Non-Essentials", color: COLORS[1] },
        categoryC: { label: "Miscellaneous", color: COLORS[2] },
      }}
      className="w-[269.03px] h-[269.03px]" // Fixed dimensions
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            fill="#8884d8"
            paddingAngle={0}
            dataKey="value"
            labelLine={false}
            label={(props) => <CustomLabel {...props} />}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}

          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

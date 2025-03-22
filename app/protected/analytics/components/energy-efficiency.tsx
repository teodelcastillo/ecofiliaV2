"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { period: "Q1", efficiency: 60 },
  { period: "Q2", efficiency: 75 },
  { period: "Q3", efficiency: 85 },
  { period: "Q4", efficiency: 95 },
]

export function EnergyEfficiency() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Energy Efficiency</CardTitle>
          <p className="text-2xl font-bold text-primary">+25%</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Line type="monotone" dataKey="efficiency" stroke="hsl(var(--primary))" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-2">Increase in renewable energy usage in operations</p>
      </CardContent>
    </Card>
  )
}


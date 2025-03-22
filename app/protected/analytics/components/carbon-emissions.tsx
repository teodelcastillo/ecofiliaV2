"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { period: "Q1", emissions: 120 },
  { period: "Q2", emissions: 100 },
  { period: "Q3", emissions: 85 },
  { period: "Q4", emissions: 75 },
]

export function CarbonEmissions() {
  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Carbon Footprint</CardTitle>
          <p className="text-2xl font-bold text-primary">-15%</p>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="period" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Bar dataKey="emissions" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
        <p className="text-sm text-muted-foreground mt-2">Total CO2 emissions reduced this year</p>
      </CardContent>
    </Card>
  )
}


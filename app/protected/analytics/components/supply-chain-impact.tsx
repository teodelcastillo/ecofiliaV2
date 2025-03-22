"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  { month: "Jan", emissions: 65, cost: 80 },
  { month: "Feb", emissions: 59, cost: 75 },
  { month: "Mar", emissions: 80, cost: 90 },
  { month: "Apr", emissions: 55, cost: 65 },
  { month: "May", emissions: 45, cost: 55 },
  { month: "Jun", emissions: 40, cost: 50 },
]

export function SupplyChainImpact() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Supply Chain Impact</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
            />
            <Legend />
            <Bar dataKey="emissions" name="Emissions" fill="hsl(var(--primary))" />
            <Bar dataKey="cost" name="Cost" fill="hsl(var(--muted))" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


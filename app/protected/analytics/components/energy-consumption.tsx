"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { month: "Jan", consumption: 400 },
  { month: "Feb", consumption: 380 },
  { month: "Mar", consumption: 420 },
  { month: "Apr", consumption: 390 },
  { month: "May", consumption: 370 },
  { month: "Jun", consumption: 360 },
]

export function EnergyConsumption() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Energy Consumption</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="consumption" stroke="#2563eb" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, XAxis, YAxis, Bar, Cell, Line, Pie } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart2, Droplet, Leaf, Zap } from "lucide-react"

// 1️⃣ Type Definitions
type MonthlyDataPoint = {
  month: string
  value: number
}

type EnergyDataPoint = {
  name: string
  value: number
}

// 2️⃣ Sample Data
const carbonData: MonthlyDataPoint[] = [
  { month: "Jan", value: 65 },
  { month: "Feb", value: 59 },
  { month: "Mar", value: 80 },
  { month: "Apr", value: 55 },
  { month: "May", value: 40 },
  { month: "Jun", value: 35 },
]

const waterData: MonthlyDataPoint[] = [
  { month: "Jan", value: 120 },
  { month: "Feb", value: 110 },
  { month: "Mar", value: 130 },
  { month: "Apr", value: 100 },
  { month: "May", value: 90 },
  { month: "Jun", value: 85 },
]

const energyData: EnergyDataPoint[] = [
  { name: "Solar", value: 45 },
  { name: "Wind", value: 30 },
  { name: "Hydro", value: 15 },
  { name: "Biomass", value: 10 },
]

const biodiversityData: MonthlyDataPoint[] = [
  { month: "Jan", value: 75 },
  { month: "Feb", value: 78 },
  { month: "Mar", value: 82 },
  { month: "Apr", value: 80 },
  { month: "May", value: 85 },
  { month: "Jun", value: 88 },
]

// 3️⃣ Reusable Chart Sections

type BarChartSectionProps = {
  title: string
  data: MonthlyDataPoint[]
  colorVar: string
}

function BarChartSection({ title, data, colorVar }: BarChartSectionProps) {
  return (
    <ChartContainer
      config={{
        [title]: { label: title, color: colorVar },
      }}
    >
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <XAxis dataKey="month" />
        <YAxis />
        <Bar
          dataKey="value"
          name={`${title} (tons)`}
          fill={`var(--color-${title.toLowerCase()})`}
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  )
}

type LineChartSectionProps = {
  title: string
  data: MonthlyDataPoint[]
  colorVar: string
}

function LineChartSection({ title, data, colorVar }: LineChartSectionProps) {
  return (
    <ChartContainer
      config={{
        [title]: { label: title, color: colorVar },
      }}
    >
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <ChartTooltip content={<ChartTooltipContent />} />
        <XAxis dataKey="month" />
        <YAxis />
        <Line
          type="monotone"
          dataKey="value"
          name={title}
          stroke={`var(--color-${title.toLowerCase()})`}
          strokeWidth={2}
        />
      </LineChart>
    </ChartContainer>
  )
}

type PieChartSectionProps = {
  data: EnergyDataPoint[]
}

function PieChartSection({ data }: PieChartSectionProps) {
  return (
    <ChartContainer
      config={{
        solar: { label: "Solar", color: "hsl(var(--chart-3))" },
        wind: { label: "Wind", color: "hsl(var(--chart-4))" },
        hydro: { label: "Hydro", color: "hsl(var(--chart-5))" },
        biomass: { label: "Biomass", color: "hsl(var(--chart-6))" },
      }}
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={`var(--color-${entry.name.toLowerCase()})`} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

// 4️⃣ Main Component
export function KpiDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Environmental KPI Dashboard</CardTitle>
        <CardDescription>Key performance indicators used by environmental researchers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="carbon">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="carbon">
              <BarChart2 className="mr-2 h-4 w-4" />
              Carbon Emissions
            </TabsTrigger>
            <TabsTrigger value="water">
              <Droplet className="mr-2 h-4 w-4" />
              Water Usage
            </TabsTrigger>
            <TabsTrigger value="energy">
              <Zap className="mr-2 h-4 w-4" />
              Renewable Energy
            </TabsTrigger>
            <TabsTrigger value="biodiversity">
              <Leaf className="mr-2 h-4 w-4" />
              Biodiversity
            </TabsTrigger>
          </TabsList>

          {/* Carbon */}
          <TabsContent value="carbon" className="h-[300px]">
            <BarChartSection title="Carbon" data={carbonData} colorVar="hsl(var(--chart-1))" />
          </TabsContent>

          {/* Water */}
          <TabsContent value="water" className="h-[300px]">
            <LineChartSection title="Water Usage" data={waterData} colorVar="hsl(var(--chart-2))" />
          </TabsContent>

          {/* Energy */}
          <TabsContent value="energy" className="h-[300px]">
            <PieChartSection data={energyData} />
          </TabsContent>

          {/* Biodiversity */}
          <TabsContent value="biodiversity" className="h-[300px]">
            <LineChartSection title="Biodiversity" data={biodiversityData} colorVar="hsl(var(--chart-7))" />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

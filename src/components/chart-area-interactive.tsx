"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Loader } from "lucide-react"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

type TimeRange = "1" | "3" | "6" | "12"

interface AreaChartData {
  date: string
  [key: string]: number | string
}

interface ReusableAreaChartProps {
  title: string
  description?: string
  data: AreaChartData[]
  loading?: boolean
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  chartConfig: ChartConfig
  areaKeys: { key: string; color: string; fillId: string }[]
}

export function ReusableAreaChart({
  title,
  description,
  data,
  loading = false,
  timeRange,
  setTimeRange,
  chartConfig,
  areaKeys,
}: ReusableAreaChartProps) {
  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={() => {}}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="1" disabled>Last 1 month</ToggleGroupItem>
              <ToggleGroupItem value="3" disabled>Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="6" disabled>Last 6 months</ToggleGroupItem>
              <ToggleGroupItem value="12" disabled>Last 12 months</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={() => {}} disabled>
              <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm" aria-label="Select a value">
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1" className="rounded-lg" disabled>Last 1 month</SelectItem>
                <SelectItem value="3" className="rounded-lg" disabled>Last 3 months</SelectItem>
                <SelectItem value="6" className="rounded-lg" disabled>Last 6 months</SelectItem>
                <SelectItem value="12" className="rounded-lg" disabled>Last 12 months</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          <div className="flex items-center justify-center h-[250px] w-full">
            <Loader className="size-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={(value) => {
              if (value === "1" || value === "3" || value === "6" || value === "12") {
                setTimeRange(value)
              }
            }}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="1">Last 1 month</ToggleGroupItem>
            <ToggleGroupItem value="3">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="6">Last 6 months</ToggleGroupItem>
            <ToggleGroupItem value="12">Last 12 months</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
            <SelectTrigger className="flex w-40 @[767px]/card:hidden" size="sm" aria-label="Select a value">
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1" className="rounded-lg">Last 1 month</SelectItem>
              <SelectItem value="3" className="rounded-lg">Last 3 months</SelectItem>
              <SelectItem value="6" className="rounded-lg">Last 6 months</SelectItem>
              <SelectItem value="12" className="rounded-lg">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              {areaKeys.map(({ fillId, color }, i) => (
                <linearGradient key={fillId} id={fillId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8 - i * 0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {areaKeys.map(({ key, color, fillId }) => (
              <Area
                key={key}
                dataKey={key}
                type="natural"
                fill={`url(#${fillId})`}
                stroke={color}
                stackId="a"
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
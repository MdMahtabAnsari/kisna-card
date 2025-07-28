"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { fetchUserChart } from "@/lib/api/super-admin/user/chart"
import { useState, useEffect } from "react"
import { UserChartDataArray } from "@/lib/schema/api-response/chart"
import { Loader } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
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

export const description = "An interactive area chart"



const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  admin: {
    label: "Admin",
    color: "var(--primary)",
  },
  shop_owner: {
    label: "Shop Owner",
    color: "var(--primary)",
  },
  user: {
    label: "User",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState<"1" | "3" | "6" | "12">("1")
  const [adminData, setAdminData] = useState<UserChartDataArray>([]);
    const [storeOwnerData, setStoreOwnerData] = useState<UserChartDataArray>([]);
    const [userData, setUserData] = useState<UserChartDataArray>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = async () => {
        setLoading(true);
        try {
          const [admin, storeOwner, user] = await Promise.all([
            fetchUserChart({ month: timeRange, groupBy: "week", role: "ADMIN" }),
            fetchUserChart({ month: timeRange, groupBy: "week", role: "SHOP_OWNER" }),
            fetchUserChart({ month: timeRange, groupBy: "week", role: "USER" }),
          ]);
          if (admin.status === 'success') {
            setAdminData(admin.data)
          }
          if (storeOwner.status === 'success') {
            setStoreOwnerData(storeOwner.data)
          }
          if (user.status === 'success') {
            setUserData(user.data)
          }
        } catch (error) {
          console.error("Error fetching chart data:", error);
        } finally {
          setLoading(false);
        }
      };
    
      useEffect(() => {
        fetchData();
      }, [timeRange]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("1")
    }
  }, [isMobile])


  const filteredData = React.useMemo(() => {
    const data = adminData.map((item, index) => ({
      date: item.date,
      admin: item.count,
      shop_owner: storeOwnerData[index]?.count || 0,
      user: userData[index]?.count || 0,
    }))
    return data.filter(item => item.date)
  }, [adminData, storeOwnerData, userData])

  if (loading) {
    return (
      <Card className="@container/card">
        <CardHeader>
          <CardTitle>Total Visitors</CardTitle>
          <CardDescription>
            <span className="hidden @[540px]/card:block">
              Total for the last 3 months
            </span>
            <span className="@[540px]/card:hidden">Last 3 months</span>
          </CardDescription>
          <CardAction>
            <ToggleGroup
              type="single"
              value={timeRange}
              onValueChange={() => {}}
              variant="outline"
              className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
            >
              <ToggleGroupItem value="1" disabled>Last 1 months</ToggleGroupItem>
              <ToggleGroupItem value="3" disabled>Last 3 months</ToggleGroupItem>
              <ToggleGroupItem value="6" disabled>Last 6 months</ToggleGroupItem>
              <ToggleGroupItem value="12" disabled>Last 12 months</ToggleGroupItem>
            </ToggleGroup>
            <Select value={timeRange} onValueChange={() => {}} disabled>
              <SelectTrigger
                className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                size="sm"
                aria-label="Select a value"
              >
                <SelectValue placeholder="Last 3 months" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="1" className="rounded-lg" disabled>
                  Last 1 month
                </SelectItem>
                <SelectItem value="3" className="rounded-lg" disabled>
                  Last 3 months
                </SelectItem>
                <SelectItem value="6" className="rounded-lg" disabled>
                  Last 6 months
                </SelectItem>
                <SelectItem value="12" className="rounded-lg" disabled>
                  Last 12 months
                </SelectItem>
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
    );
  }

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
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
            <ToggleGroupItem value="1">Last 1 months</ToggleGroupItem>
            <ToggleGroupItem value="3">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="6">Last 6 months</ToggleGroupItem>
            <ToggleGroupItem value="12">Last 12 months</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "1" | "3" | "6" | "12")}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="1" className="rounded-lg">
                Last 1 month
              </SelectItem>
              <SelectItem value="3" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="6" className="rounded-lg">
                Last 6 months
              </SelectItem>
              <SelectItem value="12" className="rounded-lg">
                Last 12 months
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillAdmin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={1.0} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillShopOwner" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.7} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillUser" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-3)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--chart-3)" stopOpacity={0.1} />
              </linearGradient>
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
            <Area
              dataKey="admin"
              type="natural"
              fill="url(#fillAdmin)"
              stroke="var(--chart-1)"
              stackId="a"
            />
            <Area
              dataKey="shop_owner"
              type="natural"
              fill="url(#fillShopOwner)"
              stroke="var(--chart-2)"
              stackId="a"
            />
            <Area
              dataKey="user"
              type="natural"
              fill="url(#fillUser)"
              stroke="var(--chart-3)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { fetchUserChart } from "@/lib/api/super-admin/user/chart"
import { useState, useEffect } from "react"
import { UserChartDataArray } from "@/lib/schema/api-response/chart"

import {
  Card,
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

export const description = "An interactive bar chart"



const chartConfig = {
  views: {
    label: "Page Views",
  },
  admin: {
    label: "ADMIN",
    color: "var(--chart-2)",
  },
  store_owner: {
    label: "STORE_OWNER",
    color: "var(--chart-1)",
  },
  user: {
    label: "USER",
    color: "var(--chart-3)",
  }
} satisfies ChartConfig

export function ChartBarInteractive() {
  const [adminData, setAdminData] = useState<UserChartDataArray>([]);
  const [storeOwnerData, setStoreOwnerData] = useState<UserChartDataArray>([]);
  const [userData, setUserData] = useState<UserChartDataArray>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>("admin")

  const fetchData = async () => {
    setLoading(true);
    try {
      const [admin, storeOwner, user] = await Promise.all([
        fetchUserChart({ month: "1", groupBy: "week", role: "ADMIN" }),
        fetchUserChart({ month: "1", groupBy: "week", role: "SHOP_OWNER" }),
        fetchUserChart({ month: "1", groupBy: "week", role: "USER" }),
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
  }, []);


  const total = React.useMemo(
    () => ({
      admin: adminData.reduce((acc, curr) => acc + curr.count, 0),
      store_owner: storeOwnerData.reduce((acc, curr) => acc + curr.count, 0),
      user: userData.reduce((acc, curr) => acc + curr.count, 0),
    }),
    [adminData, storeOwnerData, userData]
  )

  if (loading) {
    return null; // or a loading spinner
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:!py-0">
          <CardTitle>Bar Chart - Interactive</CardTitle>
          <CardDescription>
            Showing total visitors for the last 3 months
          </CardDescription>
        </div>
        <div className="flex">
          {["admin", "store_owner", "user"].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartConfig[activeChart] === chartConfig.admin ? adminData : chartConfig[activeChart] === chartConfig.store_owner ? storeOwnerData : userData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
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
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="count" fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

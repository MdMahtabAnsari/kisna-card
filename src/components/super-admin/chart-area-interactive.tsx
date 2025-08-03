"use client";
import { ReusableAreaChart } from "@/components/chart-area-interactive";
import {fetchUserChart} from "@/lib/api/super-admin/user/chart";
import { mergeRoleDataByDate } from "@/lib/helpers/merge-role-by-date";
import { useState,useEffect } from "react";

export function ChartAreaInteractive() {
  const [data, setData] = useState<{ date: string; admin: number; shop_owner: number; user: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"1" | "3" | "6" | "12">("1");
  
  const areaKeys = [
    { key: "admin", color: "var(--chart-1)", fillId: "fillAdmin" },
    { key: "shop_owner", color: "var(--chart-2)", fillId: "fillShopOwner" },
    { key: "user", color: "var(--chart-3)", fillId: "fillUser" },
  ];

  const chartConfig = {
  admin: {
    label: "Admin",
    color: "var(--chart-1)",
  },
  shop_owner: {
    label: "Shop Owner",
    color: "var(--chart-2)",
  },
  user: {
    label: "User",
    color: "var(--chart-3)",
  },
};

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const fetchData = async () => {
    setLoading(true);
    const admin = await fetchUserChart({
        month: timeRange,
        groupBy:"day",
        role:"ADMIN",
    });
    const shopOwner = await fetchUserChart({
        month: timeRange,
        groupBy:"day",
        role:"SHOP_OWNER",
    });
    const user = await fetchUserChart({
        month: timeRange,
        groupBy:"day",
        role:"USER",
    });
    if(admin.status === "success" && shopOwner.status === "success" && user.status === "success") {
      const mergedData = mergeRoleDataByDate(admin.data, shopOwner.data, user.data);
      setData(mergedData);
    }
    setLoading(false);
  };

  return (
    <ReusableAreaChart
      title="User Registrations"
      description="Monthly user registration statistics"
      data={data}
      loading={loading}
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      chartConfig={chartConfig}
      areaKeys={areaKeys}
    />
  );
}
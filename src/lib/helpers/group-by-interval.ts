import { format, startOfDay, startOfWeek, startOfMonth } from "date-fns";


export function groupByInterval(data: { createdAt: Date; count: number }[], groupBy: string) {
  const grouped: Record<string, number> = {};

  for (const item of data) {
    let key = "";

    if (groupBy === "day") {
      key = format(startOfDay(item.createdAt), "yyyy-MM-dd");
    } else if (groupBy === "week") {
      key = format(startOfWeek(item.createdAt), "yyyy-MM-dd");
    } else if (groupBy === "month") {
      key = format(startOfMonth(item.createdAt), "yyyy-MM");
    }

    grouped[key] = (grouped[key] || 0) + item.count;
  }

  return Object.entries(grouped).map(([date, count]) => ({ date, count }));
}
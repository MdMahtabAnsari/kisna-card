import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { StatCard } from "@/components/stat-card";

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value="$1,250.00"
        description="Total Revenue"
        badgeText="+12.5%"
        badgeIcon={<IconTrendingUp />}
        trendText="Trending up this month"
        trendIcon={<IconTrendingUp className="size-4" />}
        footer="Visitors for the last 6 months"
      />
      {/* Add more StatCard components as needed */}
    </div>
  );
}
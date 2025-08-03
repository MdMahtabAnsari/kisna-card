import { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  badgeText?: string;
  badgeIcon?: ReactNode;
  trendText?: string;
  trendIcon?: ReactNode;
  footer?: string;
}

export function StatCard({
  title,
  value,
  description,
  badgeText,
  badgeIcon,
  trendText,
  trendIcon,
  footer,
}: StatCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        {description && <CardDescription>{description}</CardDescription>}
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        {(badgeText || badgeIcon) && (
          <CardAction>
            <Badge variant="outline">
              {badgeIcon}
              {badgeText}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        {trendText && (
          <div className="line-clamp-1 flex gap-2 font-medium">
            {trendText} {trendIcon}
          </div>
        )}
        {footer && <div className="text-muted-foreground">{footer}</div>}
      </CardFooter>
    </Card>
  );
}
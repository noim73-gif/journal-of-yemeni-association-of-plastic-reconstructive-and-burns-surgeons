import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "success" | "warning" | "info";
}

const variantStyles = {
  default: "bg-primary/10 text-primary",
  success: "bg-[hsl(var(--status-success)/0.12)] text-[hsl(var(--status-success))]",
  warning: "bg-[hsl(var(--status-warning)/0.14)] text-[hsl(var(--status-warning))]",
  info: "bg-[hsl(var(--status-info)/0.12)] text-[hsl(var(--status-info))]",
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatsCardProps) {
  return (
    <div className="bg-card p-6 rounded-xl border border-border shadow-soft hover:shadow-elegant transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-overline mb-1.5">{title}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-stat">{value}</p>
            {trend && (
              <span
                className={cn(
                  "text-xs font-medium px-1.5 py-0.5 rounded",
                  trend.isPositive
                    ? "bg-[hsl(var(--status-success)/0.14)] text-[hsl(var(--status-success))]"
                    : "bg-destructive/12 text-destructive"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-caption mt-1.5">{description}</p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", variantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

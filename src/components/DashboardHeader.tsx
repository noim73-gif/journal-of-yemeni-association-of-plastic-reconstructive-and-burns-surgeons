import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export const DashboardHeader = forwardRef<HTMLDivElement, DashboardHeaderProps>(
  ({ title, description, eyebrow, actions, className }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-5 mb-8 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        {eyebrow && <div className="text-eyebrow mb-2">{eyebrow}</div>}
        <h1 className="text-h1">{title}</h1>
        {description && <p className="text-lead mt-2 max-w-2xl">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
);
DashboardHeader.displayName = "DashboardHeader";

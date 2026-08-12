import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  FileEdit,
  Eye,
  XCircle,
  CircleDashed,
  Send,
  type LucideIcon,
} from "lucide-react";

export type EditorialStatus = string;

type Tone = "success" | "info" | "warning" | "danger" | "neutral";

const toneStyles: Record<Tone, string> = {
  success:
    "bg-[hsl(var(--status-success)/0.12)] text-[hsl(var(--status-success))] border-[hsl(var(--status-success)/0.3)]",
  info: "bg-[hsl(var(--status-info)/0.12)] text-[hsl(var(--status-info))] border-[hsl(var(--status-info)/0.3)]",
  warning:
    "bg-[hsl(var(--status-warning)/0.14)] text-[hsl(var(--status-warning))] border-[hsl(var(--status-warning)/0.35)]",
  danger:
    "bg-destructive/12 text-destructive border-destructive/30",
  neutral:
    "bg-[hsl(var(--status-neutral)/0.12)] text-[hsl(var(--status-neutral))] border-[hsl(var(--status-neutral)/0.3)]",
};

const map: Record<string, { label: string; tone: Tone; icon: LucideIcon }> = {
  // submissions / manuscripts
  draft: { label: "Draft", tone: "neutral", icon: CircleDashed },
  submitted: { label: "Submitted", tone: "info", icon: Send },
  pending: { label: "Pending", tone: "warning", icon: Clock },
  pending_review: { label: "Pending Review", tone: "warning", icon: Clock },
  under_review: { label: "Under Review", tone: "info", icon: Eye },
  in_review: { label: "In Review", tone: "info", icon: Eye },
  revision_requested: { label: "Revision Requested", tone: "warning", icon: FileEdit },
  revisions_requested: { label: "Revisions Requested", tone: "warning", icon: FileEdit },
  resubmitted: { label: "Resubmitted", tone: "info", icon: Send },
  accepted: { label: "Accepted", tone: "success", icon: CheckCircle2 },
  published: { label: "Published", tone: "success", icon: CheckCircle2 },
  rejected: { label: "Rejected", tone: "danger", icon: XCircle },
  declined: { label: "Declined", tone: "danger", icon: XCircle },
  withdrawn: { label: "Withdrawn", tone: "neutral", icon: CircleDashed },
  // review invitations / assignments
  invited: { label: "Invited", tone: "warning", icon: Clock },
  awaiting_response: { label: "Awaiting Response", tone: "warning", icon: Clock },
  assigned: { label: "Assigned", tone: "info", icon: Eye },
  completed: { label: "Completed", tone: "success", icon: CheckCircle2 },
  overdue: { label: "Overdue", tone: "danger", icon: Clock },
  // workflow stages
  submission: { label: "Submission", tone: "info", icon: Send },
  review: { label: "Review", tone: "info", icon: Eye },
  copyediting: { label: "Copyediting", tone: "warning", icon: FileEdit },
  production: { label: "Production", tone: "warning", icon: FileEdit },
  publication: { label: "Publication", tone: "success", icon: CheckCircle2 },
  // account / application states
  approved: { label: "Approved", tone: "success", icon: CheckCircle2 },
  verified: { label: "Verified", tone: "success", icon: CheckCircle2 },
  unverified: { label: "Unverified", tone: "warning", icon: Clock },
  suspended: { label: "Suspended", tone: "danger", icon: XCircle },
};

function humanize(status: string) {
  return status
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

interface EditorialStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: EditorialStatus | null | undefined;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export const EditorialStatusBadge = forwardRef<HTMLSpanElement, EditorialStatusBadgeProps>(
  ({ status, showIcon = true, size = "sm", className, ...props }, ref) => {
    const key = (status ?? "").toLowerCase();
    const entry = map[key];
    const tone: Tone = entry?.tone ?? "neutral";
    const Icon = entry?.icon ?? CircleDashed;
    const label = entry?.label ?? (status ? humanize(status) : "Unknown");

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border font-sans font-semibold whitespace-nowrap",
          size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
          toneStyles[tone],
          className
        )}
        {...props}
      >
        {showIcon && <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />}
        {label}
      </span>
    );
  }
);
EditorialStatusBadge.displayName = "EditorialStatusBadge";

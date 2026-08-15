import { forwardRef, useEffect, useState } from "react";
import { Loader2, History } from "lucide-react";
import { EditorialStatusBadge } from "@/components/EditorialStatusBadge";
import { EmptyState } from "@/components/EmptyState";
import { auditActionLabel } from "@/lib/editorialStages";
import type { AuditEntry } from "@/hooks/useEditorialWorkflow";

interface SubmissionAuditTrailProps {
  submissionId: string;
  fetchAuditLog: (submissionId: string) => Promise<AuditEntry[]>;
}

export const SubmissionAuditTrail = forwardRef<HTMLDivElement, SubmissionAuditTrailProps>(
  ({ submissionId, fetchAuditLog }, ref) => {
    const [entries, setEntries] = useState<AuditEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      let active = true;
      setLoading(true);
      fetchAuditLog(submissionId).then((rows) => {
        if (!active) return;
        setEntries(rows);
        setLoading(false);
      });
      return () => {
        active = false;
      };
    }, [submissionId, fetchAuditLog]);

    if (loading) {
      return (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      );
    }

    if (entries.length === 0) {
      return (
        <EmptyState
          icon={History}
          title="No audit entries yet"
          description="Editorial actions on this manuscript will be recorded here."
        />
      );
    }

    return (
      <div ref={ref} className="relative space-y-4 pl-5">
        <span className="absolute left-1 top-2 bottom-2 w-px bg-border" aria-hidden />
        {entries.map((e) => {
          const comments =
            e.details && typeof e.details === "object" && "comments" in e.details
              ? String((e.details as { comments?: unknown }).comments ?? "")
              : "";
          return (
            <div key={e.id} className="relative">
              <span className="absolute -left-4 top-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden />
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-body-sm font-semibold">{auditActionLabel(e.action)}</span>
                {e.from_value && <EditorialStatusBadge status={e.from_value} showIcon={false} />}
                {e.from_value && e.to_value && <span className="text-caption">→</span>}
                {e.to_value && <EditorialStatusBadge status={e.to_value} />}
              </div>
              <p className="text-caption mt-1">
                {e.actor_name || "System"}
                {e.actor_role ? ` · ${e.actor_role}` : ""} ·{" "}
                {new Date(e.created_at).toLocaleString()}
              </p>
              {comments && <p className="text-body-sm mt-1 text-muted-foreground">{comments}</p>}
            </div>
          );
        })}
      </div>
    );
  }
);
SubmissionAuditTrail.displayName = "SubmissionAuditTrail";
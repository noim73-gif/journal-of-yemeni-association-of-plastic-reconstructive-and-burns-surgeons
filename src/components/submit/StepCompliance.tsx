import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { buildChecklist } from "@/lib/submissionValidation";
import type { DraftState } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
  onJump: (step: number) => void;
}

const FINAL_ITEMS = [
  {
    key: "references",
    label: "The manuscript includes a complete reference list in the journal style",
  },
  {
    key: "format",
    label: "The manuscript is double-spaced with continuous line numbering and page numbers",
  },
  {
    key: "blinding",
    label: "The main manuscript file contains no author names, affiliations or acknowledgments",
  },
];

export function StepCompliance({ draft, update, onJump }: Props) {
  const items = buildChecklist(draft);
  const blockers = items.filter((i) => i.required && !i.passed);
  const warnings = items.filter((i) => !i.required && !i.passed);

  const setConfirm = (key: string, v: boolean) =>
    update({ finalConfirmations: { ...draft.finalConfirmations, [key]: v } });

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Final author confirmations *</Label>
        {FINAL_ITEMS.map((f) => (
          <label
            key={f.key}
            className="flex gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors"
          >
            <Checkbox
              checked={!!draft.finalConfirmations[f.key]}
              onCheckedChange={(v) => setConfirm(f.key, !!v)}
              className="mt-0.5"
            />
            <span className="text-body-sm">{f.label}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Submission checklist</Label>
          <span className="text-caption text-muted-foreground">
            {items.filter((i) => i.passed).length} of {items.length} complete
          </span>
        </div>
        <ul className="divide-y rounded-lg border bg-card">
          {items.map((i) => (
            <li key={i.key} className="flex items-start gap-3 px-3 py-2">
              {i.passed ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              ) : i.required ? (
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-body-sm">{i.label}</div>
                {!i.passed && i.hint && (
                  <div className="text-caption text-muted-foreground">{i.hint}</div>
                )}
              </div>
              {!i.passed && (
                <button
                  type="button"
                  onClick={() => onJump(i.step)}
                  className="text-caption text-primary hover:underline shrink-0"
                >
                  Fix in step {i.step}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {blockers.length > 0 ? (
        <p className="text-body-sm text-destructive">
          {blockers.length} required item{blockers.length > 1 ? "s" : ""} must be completed before
          you can submit.
        </p>
      ) : (
        <p className="text-body-sm text-primary">
          All mandatory requirements are satisfied. You may submit this manuscript.
          {warnings.length > 0 && " Optional recommendations remain outstanding."}
        </p>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Loader2, AlertTriangle, Save, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONFIDENCE_SCALE,
  EMPTY_REPORT,
  RATING_CRITERIA,
  RATING_SCALE,
  RECOMMENDATIONS,
  ReviewReport,
  reviewStageLabel,
  validateReport,
} from "@/lib/reviewForm";
import { cn } from "@/lib/utils";

interface ReviewReportFormProps {
  initial?: Partial<ReviewReport>;
  round?: number;
  stage?: string | null;
  readOnly?: boolean;
  onSaveDraft?: (report: ReviewReport) => Promise<boolean | void>;
  onSubmit?: (report: ReviewReport) => Promise<boolean | void>;
  onCancel?: () => void;
}

export function ReviewReportForm({
  initial,
  round = 1,
  stage = "peer_review",
  readOnly = false,
  onSaveDraft,
  onSubmit,
  onCancel,
}: ReviewReportFormProps) {
  const [report, setReport] = useState<ReviewReport>({ ...EMPTY_REPORT, ...initial });
  const [errors, setErrors] = useState<string[]>([]);
  const [busy, setBusy] = useState<"draft" | "submit" | null>(null);

  function set<K extends keyof ReviewReport>(key: K, value: ReviewReport[K]) {
    setReport((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    const found = validateReport(report);
    setErrors(found);
    if (found.length || !onSubmit) return;
    setBusy("submit");
    await onSubmit(report);
    setBusy(null);
  }

  async function handleDraft() {
    if (!onSaveDraft) return;
    setBusy("draft");
    await onSaveDraft(report);
    setBusy(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{reviewStageLabel(stage)}</Badge>
        <Badge variant="outline">Round {round}</Badge>
        <span className="text-caption">
          Your ratings and confidential comments are visible to editors only.
        </span>
      </div>

      {/* Ratings */}
      <div className="space-y-3">
        <Label className="text-overline">Quality assessment</Label>
        <div className="space-y-3">
          {RATING_CRITERIA.map((criterion) => (
            <div key={criterion.key} className="rounded-lg border border-border p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{criterion.label}</p>
                  <p className="text-caption">{criterion.help}</p>
                </div>
                <div className="flex gap-1">
                  {RATING_SCALE.map((option) => {
                    const active = report[criterion.key] === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        disabled={readOnly}
                        title={option.label}
                        aria-label={`${criterion.label}: ${option.label}`}
                        aria-pressed={active}
                        onClick={() => set(criterion.key, option.value)}
                        className={cn(
                          "h-9 w-9 rounded-md border text-sm font-semibold transition-colors",
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:bg-muted",
                          readOnly && "cursor-default opacity-80"
                        )}
                      >
                        {option.value}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-caption">1 = Poor · 3 = Good · 5 = Excellent</p>
      </div>

      <Separator />

      {/* Confidence + recommendation */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-overline">Reviewer confidence *</Label>
          <Select
            disabled={readOnly}
            value={report.confidence ? String(report.confidence) : ""}
            onValueChange={(v) => set("confidence", Number(v))}
          >
            <SelectTrigger>
              <SelectValue placeholder="How confident are you?" />
            </SelectTrigger>
            <SelectContent>
              {CONFIDENCE_SCALE.map((c) => (
                <SelectItem key={c.value} value={String(c.value)}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-overline">Overall recommendation *</Label>
          <Select
            disabled={readOnly}
            value={report.recommendation}
            onValueChange={(v) => set("recommendation", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select your recommendation" />
            </SelectTrigger>
            <SelectContent>
              {RECOMMENDATIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label} — {r.help}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Narrative */}
      <div className="space-y-2">
        <Label className="text-overline">Comments to the author *</Label>
        <Textarea
          readOnly={readOnly}
          rows={7}
          value={report.feedback}
          onChange={(e) => set("feedback", e.target.value)}
          placeholder="Structured, constructive comments: general assessment, then specific points by section (abstract, methods, results, discussion, references)."
        />
        <p className="text-caption">
          {report.feedback.trim().length} characters · shared with the author, minimum 50.
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-overline">Confidential comments to the editor</Label>
        <Textarea
          readOnly={readOnly}
          rows={4}
          value={report.comments_to_editor}
          onChange={(e) => set("comments_to_editor", e.target.value)}
          placeholder="Concerns you would not put to the author: suspected duplication, statistical doubts, ethics questions."
        />
      </div>

      <div className="space-y-2">
        <Label className="text-overline">Private notes</Label>
        <Textarea
          readOnly={readOnly}
          rows={3}
          value={report.private_notes}
          onChange={(e) => set("private_notes", e.target.value)}
          placeholder="Working notes kept with your report."
          className="bg-[hsl(var(--status-warning)/0.08)] border-[hsl(var(--status-warning)/0.3)]"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-overline">Competing interests</Label>
        <Textarea
          readOnly={readOnly}
          rows={2}
          value={report.competing_interests}
          onChange={(e) => set("competing_interests", e.target.value)}
          placeholder="Declare any competing interest, or state 'None declared'."
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-destructive">
            <AlertTriangle className="h-4 w-4" />
            Complete your report before filing
          </div>
          <ul className="list-disc pl-6 text-body-sm text-destructive">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {!readOnly && (
        <div className="flex flex-wrap justify-end gap-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={!!busy}>
              Cancel
            </Button>
          )}
          {onSaveDraft && (
            <Button variant="outline" onClick={handleDraft} disabled={!!busy} className="gap-2">
              {busy === "draft" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save progress
            </Button>
          )}
          <Button onClick={handleSubmit} disabled={!!busy} className="gap-2">
            {busy === "submit" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            File review
          </Button>
        </div>
      )}
    </div>
  );
}
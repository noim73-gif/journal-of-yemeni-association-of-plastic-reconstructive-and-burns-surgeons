import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useArticleTypes } from "@/hooks/useArticleTypes";
import { STUDY_DESIGNS, recommendGuideline } from "@/lib/reportingGuidelines";
import type { DraftState } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
}

const DESIGN_TYPES = ["original_research", "short_communication"];

export function StepArticleType({ draft, update }: Props) {
  const { types, loading } = useArticleTypes();

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-10 text-body-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading article types…
      </div>
    );
  }

  const selectType = (id: string) => {
    const t = types.find((x) => x.id === id);
    if (!t) return;
    const guideline = recommendGuideline(t.code, draft.studyDesign).code;
    update({
      articleTypeId: t.id,
      articleTypeCode: t.code,
      reportingGuideline: guideline,
      guidelineAcknowledged: false,
      studyDesign: DESIGN_TYPES.includes(t.code) ? draft.studyDesign : null,
    });
  };

  const showDesign = DESIGN_TYPES.includes(draft.articleTypeCode ?? "");

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Article type *</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          {types.map((t) => {
            const selected = draft.articleTypeId === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectType(t.id)}
                aria-pressed={selected}
                className={cn(
                  "text-left rounded-lg border p-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "border-primary bg-primary/5"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-body-sm font-semibold">{t.label}</span>
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
                {t.description && (
                  <p className="mt-1 text-caption text-muted-foreground">{t.description}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1">
                  {t.max_word_count ? (
                    <Badge variant="secondary" className="text-caption">
                      ≤ {t.max_word_count.toLocaleString()} words
                    </Badge>
                  ) : null}
                  {t.reporting_guideline ? (
                    <Badge variant="outline" className="text-caption">
                      {t.reporting_guideline}
                    </Badge>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {showDesign && (
        <div className="space-y-2">
          <Label htmlFor="design" className="text-overline">
            Study design
          </Label>
          <Select
            value={draft.studyDesign ?? ""}
            onValueChange={(v) =>
              update({
                studyDesign: v,
                reportingGuideline: recommendGuideline(draft.articleTypeCode, v).code,
                guidelineAcknowledged: false,
              })
            }
          >
            <SelectTrigger id="design">
              <SelectValue placeholder="Select the design of your study" />
            </SelectTrigger>
            <SelectContent>
              {STUDY_DESIGNS.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-caption text-muted-foreground">
            We use this to recommend the correct reporting guideline in step 6.
          </p>
        </div>
      )}
    </div>
  );
}

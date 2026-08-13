import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, ClipboardCheck } from "lucide-react";
import { recommendGuideline, REPORTING_GUIDELINES } from "@/lib/reportingGuidelines";
import type { DraftState } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
}

export function StepGuideline({ draft, update }: Props) {
  const recommended = recommendGuideline(draft.articleTypeCode, draft.studyDesign);
  const g = REPORTING_GUIDELINES[draft.reportingGuideline ?? recommended.code] ?? recommended;
  const uploaded = draft.files.reporting_checklist ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4 space-y-2">
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-primary" />
          <span className="text-overline text-muted-foreground">Recommended reporting guideline</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-h4">{g.name}</h3>
          <Badge variant="secondary" className="text-caption">EQUATOR Network</Badge>
        </div>
        <p className="text-body-sm text-muted-foreground">{g.scope}</p>
        <a
          href={g.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-body-sm text-primary hover:underline"
        >
          Open the guideline and checklist
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {g.code !== "NONE" ? (
        <div className="space-y-2">
          <Label className="text-overline">Completed checklist</Label>
          {uploaded.length ? (
            <ul className="space-y-1 text-body-sm">
              {uploaded.map((f) => (
                <li key={f.path} className="rounded-md border bg-card px-3 py-2 truncate">
                  {f.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-caption text-muted-foreground">
              No checklist uploaded yet. Return to step 4 to add it under “Reporting guideline
              checklist”. This is strongly recommended and may be requested during technical check.
            </p>
          )}
        </div>
      ) : (
        <p className="text-body-sm text-muted-foreground">
          No specific reporting guideline applies to this article type.
        </p>
      )}

      <label className="flex gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
        <Checkbox
          checked={draft.guidelineAcknowledged}
          onCheckedChange={(v) => update({ guidelineAcknowledged: !!v })}
          className="mt-0.5"
        />
        <div className="space-y-0.5">
          <div className="text-body-sm font-medium">
            {g.code === "NONE"
              ? "I have reviewed the reporting requirements for this article type"
              : `I have followed ${g.name} when preparing this manuscript`}
          </div>
          <div className="text-caption text-muted-foreground">
            Required before submission.
          </div>
        </div>
      </label>
    </div>
  );
}

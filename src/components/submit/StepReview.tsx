import { Badge } from "@/components/ui/badge";
import { CheckCircle2, FileText, AlertCircle } from "lucide-react";
import type { DraftState } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 gap-2 py-2 border-b last:border-b-0">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="col-span-2 text-sm">{value}</div>
    </div>
  );
}

export function StepReview({ draft }: Props) {
  const allDeclared = Object.values(draft.declarations).every(Boolean);
  const corresponding = draft.authors.find((a) => a.corresponding);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-serif text-lg mb-2">Title & authors</h3>
        <Row label="Title" value={draft.title || <em className="text-muted-foreground">Missing</em>} />
        <Row
          label="Authors"
          value={
            <ul className="space-y-1">
              {draft.authors.map((a, i) => (
                <li key={i}>
                  {a.name || <em className="text-muted-foreground">Unnamed</em>}
                  {a.affiliation && (
                    <span className="text-muted-foreground"> — {a.affiliation}</span>
                  )}
                  {a.corresponding && (
                    <Badge variant="secondary" className="ml-2">
                      Corresponding
                    </Badge>
                  )}
                </li>
              ))}
            </ul>
          }
        />
        {corresponding?.email && (
          <Row label="Contact" value={corresponding.email} />
        )}
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-serif text-lg mb-2">Files</h3>
        <Row
          label="Manuscript"
          value={
            draft.manuscript_name ? (
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {draft.manuscript_name}
              </span>
            ) : (
              <em className="text-destructive">Missing</em>
            )
          }
        />
        <Row
          label="Supplementary"
          value={
            draft.supplementary_name ? (
              <span className="inline-flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {draft.supplementary_name}
              </span>
            ) : (
              <span className="text-muted-foreground">None</span>
            )
          }
        />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-serif text-lg mb-2">Metadata</h3>
        <Row
          label="Category"
          value={draft.category || <em className="text-muted-foreground">Missing</em>}
        />
        <Row label="Keywords" value={draft.keywords || <span className="text-muted-foreground">—</span>} />
        <Row
          label="Abstract"
          value={
            draft.abstract ? (
              <p className="whitespace-pre-wrap line-clamp-6">{draft.abstract}</p>
            ) : (
              <em className="text-muted-foreground">Missing</em>
            )
          }
        />
      </div>

      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-serif text-lg mb-2 flex items-center gap-2">
          Declarations
          {allDeclared ? (
            <CheckCircle2 className="h-4 w-4 text-primary" />
          ) : (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
        </h3>
        <p className="text-sm text-muted-foreground">
          {allDeclared
            ? "All required declarations have been confirmed."
            : "Please return to the Declarations step to confirm all items."}
        </p>
      </div>
    </div>
  );
}
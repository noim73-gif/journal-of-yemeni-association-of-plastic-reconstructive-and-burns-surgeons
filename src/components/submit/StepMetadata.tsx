import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DraftState } from "@/hooks/useSubmissionDraft";

const CATEGORIES = [
  "Aesthetic Surgery",
  "Breast Surgery",
  "Craniofacial Surgery",
  "Hand Surgery",
  "Microsurgery",
  "Pediatric Plastic Surgery",
  "Reconstructive Surgery",
  "Wound Healing",
  "Basic Science",
  "Clinical Study",
  "Case Report",
  "Review Article",
];

const ABSTRACT_MAX_WORDS = 300;

function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).filter(Boolean).length : 0;
}

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
}

export function StepMetadata({ draft, update }: Props) {
  const wc = wordCount(draft.abstract);
  const over = wc > ABSTRACT_MAX_WORDS;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={draft.category}
          onValueChange={(v) => update({ category: v })}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">Keywords</Label>
        <Input
          id="keywords"
          value={draft.keywords}
          onChange={(e) => update({ keywords: e.target.value })}
          placeholder="e.g., breast reconstruction, microsurgery, outcomes"
        />
        <p className="text-xs text-muted-foreground">
          Separate keywords with commas.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="abstract">Abstract *</Label>
          <span
            className={`text-xs ${over ? "text-destructive" : "text-muted-foreground"}`}
          >
            {wc} / {ABSTRACT_MAX_WORDS} words
          </span>
        </div>
        <Textarea
          id="abstract"
          value={draft.abstract}
          onChange={(e) => update({ abstract: e.target.value })}
          placeholder="Structured abstract: Background, Methods, Results, Conclusions."
          rows={10}
        />
      </div>
    </div>
  );
}
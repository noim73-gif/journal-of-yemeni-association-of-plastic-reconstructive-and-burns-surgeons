import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { AuthorRow, DraftState } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState> | ((p: DraftState) => DraftState)) => void;
}

const blankAuthor: AuthorRow = {
  name: "",
  affiliation: "",
  email: "",
  orcid: "",
  corresponding: false,
};

export function StepAuthors({ draft, update }: Props) {
  const updateAuthor = (idx: number, patch: Partial<AuthorRow>) => {
    update((prev) => {
      const authors = prev.authors.map((a, i) => (i === idx ? { ...a, ...patch } : a));
      // Ensure only one corresponding author
      if (patch.corresponding) {
        for (let i = 0; i < authors.length; i++) {
          if (i !== idx) authors[i] = { ...authors[i], corresponding: false };
        }
      }
      return { ...prev, authors };
    });
  };

  const addAuthor = () => {
    update((prev) => ({ ...prev, authors: [...prev.authors, { ...blankAuthor }] }));
  };

  const removeAuthor = (idx: number) => {
    update((prev) => {
      const authors = prev.authors.filter((_, i) => i !== idx);
      if (!authors.some((a) => a.corresponding) && authors[0]) {
        authors[0] = { ...authors[0], corresponding: true };
      }
      return { ...prev, authors: authors.length ? authors : [{ ...blankAuthor, corresponding: true }] };
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Manuscript title *</Label>
        <Input
          id="title"
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Enter the full title of your manuscript"
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Authors *</Label>
          <span className="text-xs text-muted-foreground">
            Order matters. Mark one as corresponding author.
          </span>
        </div>
        <div className="space-y-3">
          {draft.authors.map((author, idx) => (
            <div
              key={idx}
              className="rounded-lg border bg-card p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <GripVertical className="h-4 w-4 text-muted-foreground" />
                  Author {idx + 1}
                </div>
                {draft.authors.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAuthor(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-xs">Full name *</Label>
                  <Input
                    value={author.name}
                    onChange={(e) => updateAuthor(idx, { name: e.target.value })}
                    placeholder="Dr. Jane Doe"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Affiliation</Label>
                  <Input
                    value={author.affiliation ?? ""}
                    onChange={(e) => updateAuthor(idx, { affiliation: e.target.value })}
                    placeholder="Institution, City, Country"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input
                    type="email"
                    value={author.email ?? ""}
                    onChange={(e) => updateAuthor(idx, { email: e.target.value })}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">ORCID iD</Label>
                  <Input
                    value={author.orcid ?? ""}
                    onChange={(e) => updateAuthor(idx, { orcid: e.target.value })}
                    placeholder="0000-0000-0000-0000"
                  />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox
                  checked={author.corresponding ?? false}
                  onCheckedChange={(v) => updateAuthor(idx, { corresponding: !!v })}
                />
                Corresponding author
              </label>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" onClick={addAuthor} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add author
        </Button>
      </div>
    </div>
  );
}
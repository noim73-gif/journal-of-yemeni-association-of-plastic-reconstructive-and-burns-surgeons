import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { CREDIT_ROLES, AUTHOR_ROLES } from "@/lib/creditRoles";
import type { AuthorRow, DraftState } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState> | ((p: DraftState) => DraftState)) => void;
}

const blankAuthor: AuthorRow = {
  name: "",
  degree: "",
  orcid: "",
  department: "",
  institution: "",
  country: "",
  email: "",
  role: "Author",
  creditRoles: [],
  corresponding: false,
};

export function StepAuthors({ draft, update }: Props) {
  const updateAuthor = (idx: number, patch: Partial<AuthorRow>) => {
    update((prev) => {
      const authors = prev.authors.map((a, i) => (i === idx ? { ...a, ...patch } : a));
      if (patch.corresponding) {
        for (let i = 0; i < authors.length; i++) {
          if (i !== idx) authors[i] = { ...authors[i], corresponding: false };
        }
      }
      return { ...prev, authors };
    });
  };

  const toggleCredit = (idx: number, role: string) => {
    update((prev) => {
      const authors = prev.authors.map((a, i) => {
        if (i !== idx) return a;
        const roles = a.creditRoles ?? [];
        return {
          ...a,
          creditRoles: roles.includes(role) ? roles.filter((r) => r !== role) : [...roles, role],
        };
      });
      return { ...prev, authors };
    });
  };

  const addAuthor = () =>
    update((prev) => ({ ...prev, authors: [...prev.authors, { ...blankAuthor }] }));

  const removeAuthor = (idx: number) => {
    update((prev) => {
      const authors = prev.authors.filter((_, i) => i !== idx);
      if (!authors.some((a) => a.corresponding) && authors[0]) {
        authors[0] = { ...authors[0], corresponding: true };
      }
      return {
        ...prev,
        authors: authors.length ? authors : [{ ...blankAuthor, corresponding: true }],
      };
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    update((prev) => {
      const target = idx + dir;
      if (target < 0 || target >= prev.authors.length) return prev;
      const authors = [...prev.authors];
      [authors[idx], authors[target]] = [authors[target], authors[idx]];
      return { ...prev, authors };
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-2 flex-wrap">
        <Label>Authors *</Label>
        <span className="text-caption text-muted-foreground">
          Order is the published byline order. Assign CRediT roles to each author.
        </span>
      </div>

      {draft.authors.map((author, idx) => (
        <div key={idx} className="rounded-lg border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-body-sm font-semibold">
              Author {idx + 1}
              {author.corresponding && (
                <Badge variant="secondary" className="text-caption">Corresponding</Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button" variant="ghost" size="icon"
                aria-label="Move author up"
                disabled={idx === 0}
                onClick={() => move(idx, -1)}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                type="button" variant="ghost" size="icon"
                aria-label="Move author down"
                disabled={idx === draft.authors.length - 1}
                onClick={() => move(idx, 1)}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
              {draft.authors.length > 1 && (
                <Button
                  type="button" variant="ghost" size="icon"
                  aria-label="Remove author"
                  onClick={() => removeAuthor(idx)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1">
              <Label className="text-overline">Full name *</Label>
              <Input
                value={author.name}
                onChange={(e) => updateAuthor(idx, { name: e.target.value })}
                placeholder="Jane Doe"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-overline">Degree</Label>
              <Input
                value={author.degree ?? ""}
                onChange={(e) => updateAuthor(idx, { degree: e.target.value })}
                placeholder="MD, PhD, FRCS"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-overline">Department</Label>
              <Input
                value={author.department ?? ""}
                onChange={(e) => updateAuthor(idx, { department: e.target.value })}
                placeholder="Department of Plastic Surgery"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-overline">Institution / affiliation *</Label>
              <Input
                value={author.institution ?? author.affiliation ?? ""}
                onChange={(e) => updateAuthor(idx, { institution: e.target.value })}
                placeholder="Sana'a University"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-overline">Country *</Label>
              <Input
                value={author.country ?? ""}
                onChange={(e) => updateAuthor(idx, { country: e.target.value })}
                placeholder="Yemen"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-overline">Email *</Label>
              <Input
                type="email"
                value={author.email ?? ""}
                onChange={(e) => updateAuthor(idx, { email: e.target.value })}
                placeholder="jane@example.com"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-overline">ORCID iD</Label>
              <Input
                value={author.orcid ?? ""}
                onChange={(e) => updateAuthor(idx, { orcid: e.target.value })}
                placeholder="0000-0000-0000-0000"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-overline">Author role</Label>
              <Select
                value={author.role ?? "Author"}
                onValueChange={(v) => updateAuthor(idx, { role: v })}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUTHOR_ROLES.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-overline">CRediT contribution roles *</Label>
            <div className="flex flex-wrap gap-2">
              {CREDIT_ROLES.map((role) => {
                const active = (author.creditRoles ?? []).includes(role);
                return (
                  <button
                    key={role}
                    type="button"
                    aria-pressed={active}
                    onClick={() => toggleCredit(idx, role)}
                    className={`rounded-full border px-3 py-1 text-caption transition-colors ${
                      active
                        ? "border-primary bg-primary/10 text-foreground"
                        : "text-muted-foreground hover:bg-muted/50"
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 text-body-sm cursor-pointer">
            <Checkbox
              checked={author.corresponding ?? false}
              onCheckedChange={(v) => updateAuthor(idx, { corresponding: !!v })}
            />
            Corresponding author
          </label>
        </div>
      ))}

      <Button type="button" variant="outline" onClick={addAuthor} className="w-full">
        <Plus className="h-4 w-4 mr-2" />
        Add author
      </Button>
    </div>
  );
}

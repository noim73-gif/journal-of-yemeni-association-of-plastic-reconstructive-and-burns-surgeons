import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Declarations, DraftState } from "@/hooks/useSubmissionDraft";

const DECLARATIONS: { key: keyof Declarations; label: string; help: string }[] = [
  {
    key: "notPublishedElsewhere",
    label: "Original work — not published or under review elsewhere",
    help:
      "This manuscript has not been published and is not under consideration by any other journal.",
  },
  {
    key: "authorshipContributions",
    label: "All listed authors contributed substantially",
    help:
      "Each author meets the ICMJE criteria for authorship and approves this submission.",
  },
  {
    key: "conflictOfInterest",
    label: "Conflict of interest disclosed",
    help:
      "All financial and non-financial conflicts of interest have been disclosed in the manuscript.",
  },
  {
    key: "ethicsApproval",
    label: "Ethics approval obtained (if applicable)",
    help:
      "Studies involving humans or animals received approval from the relevant ethics committee.",
  },
  {
    key: "patientConsent",
    label: "Patient consent obtained (if applicable)",
    help:
      "Informed consent was obtained for any identifiable patient information or images.",
  },
];

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
}

export function StepDeclarations({ draft, update }: Props) {
  const setDecl = (key: keyof Declarations, value: boolean) => {
    update({ declarations: { ...draft.declarations, [key]: value } });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cover">Cover letter</Label>
        <Textarea
          id="cover"
          value={draft.cover_letter}
          onChange={(e) => update({ cover_letter: e.target.value })}
          placeholder="Address the editor, explain the significance of your work, and any prior correspondence."
          rows={8}
        />
      </div>

      <div className="space-y-3">
        <Label>Author declarations *</Label>
        <div className="space-y-3">
          {DECLARATIONS.map((d) => (
            <label
              key={d.key}
              className="flex gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors"
            >
              <Checkbox
                checked={draft.declarations[d.key]}
                onCheckedChange={(v) => setDecl(d.key, !!v)}
                className="mt-0.5"
              />
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.help}</div>
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
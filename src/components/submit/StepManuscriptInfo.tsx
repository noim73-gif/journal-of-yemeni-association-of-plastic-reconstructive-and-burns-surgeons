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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useArticleTypes } from "@/hooks/useArticleTypes";
import { MANUSCRIPT_LANGUAGES } from "@/lib/creditRoles";
import { wordCount, requiresEthics, requiresTrialRegistration } from "@/lib/submissionValidation";
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
  "Burns",
  "Basic Science",
];

const TRIAL_REGISTRIES = [
  "ClinicalTrials.gov",
  "ISRCTN",
  "ANZCTR",
  "Chinese Clinical Trial Registry",
  "Clinical Trials Registry – India",
  "EU Clinical Trials Register",
  "Other WHO primary registry",
];

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
}

export function StepManuscriptInfo({ draft, update }: Props) {
  const { types } = useArticleTypes();
  const type = types.find((t) => t.id === draft.articleTypeId);
  const abstractMax = type?.max_abstract_words ?? 300;
  const wc = wordCount(draft.abstract);
  const over = abstractMax > 0 && wc > abstractMax;
  const needsEthics = requiresEthics(draft.articleTypeCode);
  const needsTrial = requiresTrialRegistration(draft);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-overline">Manuscript title *</Label>
        <Input
          id="title"
          value={draft.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Full title of your manuscript"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="abstract" className="text-overline">
            Abstract {abstractMax > 0 && "*"}
          </Label>
          {abstractMax > 0 && (
            <span className={`text-caption ${over ? "text-destructive" : "text-muted-foreground"}`}>
              {wc} / {abstractMax} words
            </span>
          )}
        </div>
        <Textarea
          id="abstract"
          value={draft.abstract}
          onChange={(e) => update({ abstract: e.target.value })}
          placeholder="Structured abstract: Background, Methods, Results, Conclusions."
          rows={9}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="keywords" className="text-overline">Keywords *</Label>
          <Input
            id="keywords"
            value={draft.keywords}
            onChange={(e) => update({ keywords: e.target.value })}
            placeholder="breast reconstruction, microsurgery, outcomes"
          />
          <p className="text-caption text-muted-foreground">Comma separated, minimum three.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="category" className="text-overline">Subject area</Label>
          <Select value={draft.category} onValueChange={(v) => update({ category: v })}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Select a subject area" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="wordcount" className="text-overline">Manuscript word count *</Label>
          <Input
            id="wordcount"
            type="number"
            min={0}
            value={draft.wordCount}
            onChange={(e) => update({ wordCount: e.target.value })}
            placeholder="e.g. 3200"
          />
          {type?.max_word_count && Number(draft.wordCount) > type.max_word_count ? (
            <p className="text-caption text-destructive">
              Exceeds the {type.max_word_count.toLocaleString()}-word limit for {type.label}.
            </p>
          ) : (
            <p className="text-caption text-muted-foreground">Excluding abstract, tables and references.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="language" className="text-overline">Manuscript language *</Label>
          <Select value={draft.language} onValueChange={(v) => update({ language: v })}>
            <SelectTrigger id="language">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {MANUSCRIPT_LANGUAGES.map((l) => (
                <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="funding" className="text-overline">Funding information *</Label>
        <Textarea
          id="funding"
          value={draft.fundingStatement}
          onChange={(e) => update({ fundingStatement: e.target.value })}
          placeholder="Name funders and grant numbers, or state: This research received no specific funding."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="coi" className="text-overline">Conflict of interest *</Label>
        <Textarea
          id="coi"
          value={draft.conflictOfInterestStatement}
          onChange={(e) => update({ conflictOfInterestStatement: e.target.value })}
          placeholder="Disclose all financial and non-financial interests, or state: The authors declare no conflicts of interest."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data" className="text-overline">Data availability *</Label>
        <Textarea
          id="data"
          value={draft.dataAvailabilityStatement}
          onChange={(e) => update({ dataAvailabilityStatement: e.target.value })}
          placeholder="Describe where the data supporting this study can be found, or explain any access restrictions."
          rows={3}
        />
      </div>

      {needsEthics && (
        <div className="grid gap-4 md:grid-cols-2 rounded-lg border p-4">
          <div className="md:col-span-2 text-body-sm font-semibold">Research ethics</div>
          <div className="space-y-2">
            <Label htmlFor="ethicsCommittee" className="text-overline">Ethics committee / IRB</Label>
            <Input
              id="ethicsCommittee"
              value={draft.ethicsCommittee}
              onChange={(e) => update({ ethicsCommittee: e.target.value })}
              placeholder="Name of the approving committee"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ethicsNumber" className="text-overline">Approval reference number</Label>
            <Input
              id="ethicsNumber"
              value={draft.ethicsApprovalNumber}
              onChange={(e) => update({ ethicsApprovalNumber: e.target.value })}
              placeholder="e.g. IRB-2026-014"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label className="text-overline">Patient consent obtained</Label>
            <RadioGroup
              value={
                draft.patientConsentObtained === null
                  ? ""
                  : draft.patientConsentObtained
                    ? "yes"
                    : "na"
              }
              onValueChange={(v) => update({ patientConsentObtained: v === "yes" })}
              className="flex flex-wrap gap-4"
            >
              <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                <RadioGroupItem value="yes" /> Yes, written consent obtained
              </label>
              <label className="flex items-center gap-2 text-body-sm cursor-pointer">
                <RadioGroupItem value="na" /> Not applicable
              </label>
            </RadioGroup>
          </div>
        </div>
      )}

      {needsTrial && (
        <div className="grid gap-4 md:grid-cols-2 rounded-lg border p-4">
          <div className="md:col-span-2 text-body-sm font-semibold">
            Clinical trial registration *
          </div>
          <div className="space-y-2">
            <Label htmlFor="registry" className="text-overline">Registry</Label>
            <Select value={draft.trialRegistry} onValueChange={(v) => update({ trialRegistry: v })}>
              <SelectTrigger id="registry">
                <SelectValue placeholder="Select registry" />
              </SelectTrigger>
              <SelectContent>
                {TRIAL_REGISTRIES.map((r) => (
                  <SelectItem key={r} value={r}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="trialId" className="text-overline">Registration number</Label>
            <Input
              id="trialId"
              value={draft.trialRegistrationId}
              onChange={(e) => update({ trialRegistrationId: e.target.value })}
              placeholder="e.g. NCT01234567"
            />
          </div>
          <p className="md:col-span-2 text-caption text-muted-foreground">
            Prospective registration in a WHO primary registry is required for clinical trials.
          </p>
        </div>
      )}
    </div>
  );
}

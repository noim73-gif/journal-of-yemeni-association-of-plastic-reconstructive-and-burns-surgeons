import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { requiresEthics, requiresTrialRegistration } from "@/lib/submissionValidation";
import type { Declarations, DraftState } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
}

export function StepDeclarations({ draft, update }: Props) {
  const d = draft.declarations;
  const setDecl = (patch: Partial<Declarations>) =>
    update({ declarations: { ...d, ...patch } });

  const Item = ({
    checked,
    onChange,
    label,
    help,
  }: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    help: string;
  }) => (
    <label className="flex gap-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/40 transition-colors">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} className="mt-0.5" />
      <div className="space-y-0.5">
        <div className="text-body-sm font-medium">{label}</div>
        <div className="text-caption text-muted-foreground">{help}</div>
      </div>
    </label>
  );

  return (
    <div className="space-y-5">
      <p className="text-caption text-muted-foreground">
        These declarations follow ICMJE and COPE guidance. All required items must be confirmed
        before submission.
      </p>

      {requiresEthics(draft.articleTypeCode) && (
        <div className="space-y-3">
          <Label>Research ethics *</Label>
          <Item
            checked={d.ethicsApproval}
            onChange={(v) => setDecl({ ethicsApproval: v, ethicsNotApplicable: v ? false : d.ethicsNotApplicable })}
            label="Ethics approval was obtained"
            help="An ethics committee or institutional review board approved this study."
          />
          <Item
            checked={d.ethicsNotApplicable}
            onChange={(v) => setDecl({ ethicsNotApplicable: v, ethicsApproval: v ? false : d.ethicsApproval })}
            label="Ethics approval is not applicable"
            help="The work does not involve human participants, human data or animals."
          />
          <Item
            checked={d.informedConsent}
            onChange={(v) => setDecl({ informedConsent: v, consentNotApplicable: v ? false : d.consentNotApplicable })}
            label="Informed consent was obtained"
            help="Written consent was obtained for participation and for any identifiable images."
          />
          <Item
            checked={d.consentNotApplicable}
            onChange={(v) => setDecl({ consentNotApplicable: v, informedConsent: v ? false : d.informedConsent })}
            label="Informed consent is not applicable"
            help="No identifiable patient data or images are included."
          />
        </div>
      )}

      <div className="space-y-3">
        <Label>Integrity and disclosure *</Label>
        <Item
          checked={d.conflictOfInterest}
          onChange={(v) => setDecl({ conflictOfInterest: v })}
          label="Conflicts of interest are fully disclosed"
          help="The statement entered in step 2 is complete for all authors."
        />
        <Item
          checked={d.fundingDisclosed}
          onChange={(v) => setDecl({ fundingDisclosed: v })}
          label="All funding sources are disclosed"
          help="Funders and grant numbers are listed, or absence of funding is stated."
        />
        <Item
          checked={d.dataAvailability}
          onChange={(v) => setDecl({ dataAvailability: v })}
          label="A data availability statement is provided"
          help="Readers are told how to access the data supporting the findings."
        />
        <Item
          checked={d.authorContributions}
          onChange={(v) => setDecl({ authorContributions: v })}
          label="All listed authors meet the ICMJE authorship criteria"
          help="Each author contributed substantially and approves this submission."
        />
        <Item
          checked={d.notPublishedElsewhere}
          onChange={(v) => setDecl({ notPublishedElsewhere: v })}
          label="Not published or under review elsewhere"
          help="The manuscript is not under consideration by any other journal."
        />
        <Item
          checked={d.noPlagiarism}
          onChange={(v) => setDecl({ noPlagiarism: v })}
          label="The work is original and free of plagiarism"
          help="All sources are cited and no text is reproduced without attribution."
        />
        <Item
          checked={d.acknowledgmentsConfirmed}
          onChange={(v) => setDecl({ acknowledgmentsConfirmed: v })}
          label="Everyone acknowledged has agreed to be named"
          help="Non-author contributors have consented to the acknowledgment."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ack" className="text-overline">Acknowledgments</Label>
        <Textarea
          id="ack"
          value={draft.acknowledgments}
          onChange={(e) => update({ acknowledgments: e.target.value })}
          placeholder="Recognise non-author contributions such as statistical or language support."
          rows={3}
        />
      </div>

      <div className="space-y-3">
        <Label>AI-assisted writing and analysis *</Label>
        <Item
          checked={d.aiAssistanceUsed}
          onChange={(v) => setDecl({ aiAssistanceUsed: v })}
          label="Generative AI tools were used in preparing this manuscript"
          help="Leave unchecked if no AI tool was used. AI tools cannot be listed as authors."
        />
        {d.aiAssistanceUsed && (
          <div className="space-y-2">
            <Textarea
              value={draft.aiDisclosure}
              onChange={(e) => update({ aiDisclosure: e.target.value })}
              placeholder="Name each tool and describe exactly how it was used (e.g. language editing of the discussion)."
              rows={3}
            />
            <Item
              checked={d.aiAssistanceDeclared}
              onChange={(v) => setDecl({ aiAssistanceDeclared: v })}
              label="I confirm the AI use above is fully disclosed and the authors take responsibility for the content"
              help="Authors remain fully accountable for the accuracy and integrity of the work."
            />
          </div>
        )}
      </div>

      {requiresTrialRegistration(draft) && (
        <div className="space-y-3">
          <Label>Clinical trial registration *</Label>
          <Item
            checked={d.trialRegistrationConfirmed}
            onChange={(v) => setDecl({ trialRegistrationConfirmed: v })}
            label="The trial is registered in a WHO primary registry"
            help="The registry and registration number are entered in step 2."
          />
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ArrowLeft, ArrowRight, Loader2, Save, Send, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { useSubmissionDraft, type DraftState } from "@/hooks/useSubmissionDraft";
import { Stepper, type StepDef } from "./Stepper";
import { StepAuthors } from "./StepAuthors";
import { StepFiles } from "./StepFiles";
import { StepMetadata } from "./StepMetadata";
import { StepDeclarations } from "./StepDeclarations";
import { StepReview } from "./StepReview";

const STEPS: StepDef[] = [
  { id: 1, label: "Authors & Title" },
  { id: 2, label: "Files" },
  { id: 3, label: "Metadata" },
  { id: 4, label: "Declarations" },
  { id: 5, label: "Review & Submit" },
];

function validateStep(step: number, d: DraftState): string | null {
  switch (step) {
    case 1:
      if (!d.title.trim()) return "Please enter a title.";
      if (!d.authors.some((a) => a.name.trim()))
        return "Add at least one author with a name.";
      return null;
    case 2:
      if (!d.manuscript_url) return "Upload a manuscript file to continue.";
      return null;
    case 3:
      if (!d.category) return "Choose a category.";
      if (!d.abstract.trim()) return "Please enter an abstract.";
      return null;
    case 4:
      if (!Object.values(d.declarations).every(Boolean))
        return "Confirm all author declarations to continue.";
      return null;
    default:
      return null;
  }
}

function formatTimeAgo(date: Date | null): string {
  if (!date) return "Not saved yet";
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 5) return "Saved just now";
  if (diff < 60) return `Saved ${diff}s ago`;
  if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
  return `Saved ${date.toLocaleTimeString()}`;
}

export function SubmissionWizard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
    draft,
    update,
    draftId,
    loading,
    saving,
    lastSavedAt,
    saveNow,
    discard,
    clearLocalOnly,
  } = useSubmissionDraft();

  const [maxReached, setMaxReached] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [, setTick] = useState(0);

  // Tick to refresh "saved Xs ago"
  useEffect(() => {
    const i = setInterval(() => setTick((n) => n + 1), 15000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    setMaxReached((prev) => Math.max(prev, draft.step));
  }, [draft.step]);

  const stepError = useMemo(
    () => validateStep(draft.step, draft),
    [draft]
  );

  const goToStep = async (target: number) => {
    if (target === draft.step) return;
    if (target > draft.step) {
      const err = validateStep(draft.step, draft);
      if (err) {
        toast({ title: "Please complete this step", description: err, variant: "destructive" });
        return;
      }
    }
    update({ step: target });
    setMaxReached((prev) => Math.max(prev, target));
    await saveNow();
  };

  const handleSubmit = async () => {
    for (let i = 1; i <= 4; i++) {
      const err = validateStep(i, draft);
      if (err) {
        update({ step: i });
        toast({ title: `Step ${i} is incomplete`, description: err, variant: "destructive" });
        return;
      }
    }
    if (!user) return;
    setSubmitting(true);
    // Ensure a row exists, then flip to pending
    const id = await saveNow();
    if (!id) {
      setSubmitting(false);
      toast({
        title: "Could not save draft",
        description: "Please try again.",
        variant: "destructive",
      });
      return;
    }
    const { error } = await supabase
      .from("submissions")
      .update({ status: "pending" })
      .eq("id", id);

    if (error) {
      setSubmitting(false);
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    try {
      await supabase.functions.invoke("send-submission-notification", {
        body: { submissionId: id },
      });
    } catch (e) {
      logger.error("Submission notification failed", e);
    }

    clearLocalOnly();
    toast({
      title: "Submission received",
      description: "Thank you. You can track its status in your dashboard.",
    });
    setSubmitting(false);
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading draft…
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-4">
        <Stepper
          steps={STEPS}
          current={draft.step}
          maxReached={maxReached}
          onJump={(s) => goToStep(s)}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            {saving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving draft…
              </>
            ) : (
              <>
                <Save className="h-3 w-3" />
                {formatTimeAgo(lastSavedAt)}
                {draftId && <span className="hidden sm:inline">· stored in your account</span>}
              </>
            )}
          </span>
          {(draftId || lastSavedAt) && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Discard draft
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard this draft?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your draft and any uploaded files reference will be removed. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      await discard();
                      toast({ title: "Draft discarded" });
                    }}
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {draft.step === 1 && <StepAuthors draft={draft} update={update} />}
        {draft.step === 2 && <StepFiles draft={draft} update={update} />}
        {draft.step === 3 && <StepMetadata draft={draft} update={update} />}
        {draft.step === 4 && <StepDeclarations draft={draft} update={update} />}
        {draft.step === 5 && <StepReview draft={draft} />}

        <div className="flex flex-col sm:flex-row gap-2 sm:justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            disabled={draft.step === 1}
            onClick={() => goToStep(draft.step - 1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2 sm:ml-auto">
            <Button
              type="button"
              variant="ghost"
              onClick={async () => {
                await saveNow();
                toast({ title: "Draft saved", description: "You can resume from any device." });
              }}
            >
              <Save className="h-4 w-4 mr-2" />
              Save & exit
            </Button>
            {draft.step < STEPS.length ? (
              <Button
                type="button"
                onClick={() => goToStep(draft.step + 1)}
                disabled={!!stepError}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit manuscript
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
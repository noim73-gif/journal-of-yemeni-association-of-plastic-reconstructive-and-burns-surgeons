import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useToast } from "@/hooks/use-toast";
import { FILE_SLOTS, MAX_FILE_SIZE, type FileSlotDef } from "@/lib/submissionFiles";
import type { DraftState, FileSlot } from "@/hooks/useSubmissionDraft";

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState> | ((p: DraftState) => DraftState)) => void;
}

export function StepFiles({ draft, update }: Props) {
  const { uploadManuscript } = useSubmissions();
  const { toast } = useToast();
  const [busy, setBusy] = useState<FileSlot | null>(null);

  const handleUpload = async (slot: FileSlotDef, files: FileList) => {
    setBusy(slot.slot);
    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 20MB limit.`,
          variant: "destructive",
        });
        continue;
      }
      const path = await uploadManuscript(file, "manuscript");
      if (!path) continue;
      update((prev) => {
        const existing = prev.files[slot.slot] ?? [];
        const next = slot.multiple
          ? [...existing, { path, name: file.name, size: file.size }]
          : [{ path, name: file.name, size: file.size }];
        return { ...prev, files: { ...prev.files, [slot.slot]: next } };
      });
    }
    setBusy(null);
  };

  const removeFile = (slot: FileSlot, path: string) =>
    update((prev) => ({
      ...prev,
      files: { ...prev.files, [slot]: (prev.files[slot] ?? []).filter((f) => f.path !== path) },
    }));

  return (
    <div className="space-y-5">
      <p className="text-caption text-muted-foreground">
        Upload each component separately. Files are stored privately and are visible only to
        you and the editorial office. Maximum 20MB per file.
      </p>

      {FILE_SLOTS.map((slot) => {
        const files = draft.files[slot.slot] ?? [];
        const uploading = busy === slot.slot;
        return (
          <div key={slot.slot} className="space-y-2">
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <Label className="text-overline">
                {slot.label} {slot.required && "*"}
              </Label>
              <span className="text-caption text-muted-foreground">{slot.hint}</span>
            </div>

            {files.length > 0 && (
              <ul className="space-y-1">
                {files.map((f) => (
                  <li
                    key={f.path}
                    className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-body-sm"
                  >
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="truncate">{f.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="ml-auto h-7 w-7"
                      aria-label={`Remove ${f.name}`}
                      onClick={() => removeFile(slot.slot, f.path)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}

            {(slot.multiple || files.length === 0) && (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-4 text-body-sm text-muted-foreground hover:bg-muted/40 transition-colors">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading…
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    {files.length ? `Add another ${slot.label.toLowerCase()}` : `Upload ${slot.label.toLowerCase()}`}
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept={slot.accept}
                  multiple={slot.multiple}
                  onChange={(e) => {
                    if (e.target.files?.length) void handleUpload(slot, e.target.files);
                    e.target.value = "";
                  }}
                />
              </label>
            )}
          </div>
        );
      })}
    </div>
  );
}

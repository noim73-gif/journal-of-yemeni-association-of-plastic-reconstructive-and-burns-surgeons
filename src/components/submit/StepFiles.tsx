import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useToast } from "@/hooks/use-toast";
import type { DraftState } from "@/hooks/useSubmissionDraft";

const MAX_FILE_SIZE = 20 * 1024 * 1024;

interface Props {
  draft: DraftState;
  update: (patch: Partial<DraftState>) => void;
}

export function StepFiles({ draft, update }: Props) {
  const { uploadManuscript } = useSubmissions();
  const { toast } = useToast();
  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingSupp, setUploadingSupp] = useState(false);

  const handleUpload = async (
    file: File,
    type: "manuscript" | "supplementary"
  ) => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 20MB",
        variant: "destructive",
      });
      return;
    }
    if (type === "manuscript") setUploadingMain(true);
    else setUploadingSupp(true);
    const path = await uploadManuscript(file, type);
    if (type === "manuscript") setUploadingMain(false);
    else setUploadingSupp(false);
    if (!path) return;
    if (type === "manuscript") {
      update({ manuscript_url: path, manuscript_name: file.name });
    } else {
      update({ supplementary_url: path, supplementary_name: file.name });
    }
    toast({ title: "Uploaded", description: file.name });
  };

  const Dropzone = ({
    label,
    hint,
    accept,
    fileName,
    uploading,
    onFile,
    onClear,
    required,
  }: {
    label: string;
    hint: string;
    accept: string;
    fileName: string | null;
    uploading: boolean;
    onFile: (f: File) => void;
    onClear: () => void;
    required?: boolean;
  }) => (
    <div className="space-y-2">
      <Label>
        {label} {required && "*"}
      </Label>
      <div className="border-2 border-dashed rounded-lg p-6 text-center bg-card/50">
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            Uploading...
          </div>
        ) : fileName ? (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{fileName}</span>
            <Button type="button" variant="ghost" size="sm" onClick={onClear}>
              Replace
            </Button>
          </div>
        ) : (
          <label className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-muted-foreground">{hint}</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept={accept}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Dropzone
        label="Manuscript file"
        hint="PDF, DOC, DOCX (max 20MB)"
        accept=".pdf,.doc,.docx"
        fileName={draft.manuscript_name}
        uploading={uploadingMain}
        onFile={(f) => handleUpload(f, "manuscript")}
        onClear={() => update({ manuscript_url: null, manuscript_name: null })}
        required
      />
      <Dropzone
        label="Supplementary materials (optional)"
        hint="ZIP, PDF, or images (max 20MB)"
        accept=".pdf,.zip,.png,.jpg,.jpeg"
        fileName={draft.supplementary_name}
        uploading={uploadingSupp}
        onFile={(f) => handleUpload(f, "supplementary")}
        onClear={() => update({ supplementary_url: null, supplementary_name: null })}
      />
      <p className="text-xs text-muted-foreground">
        Files are uploaded immediately and attached to your draft. You can replace
        them at any time before submitting.
      </p>
    </div>
  );
}
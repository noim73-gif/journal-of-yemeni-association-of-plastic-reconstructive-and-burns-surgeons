import { useState } from "react";
import { Submission } from "@/hooks/useSubmissions";
import { useArticles, ArticleInput } from "@/hooks/useArticles";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";

interface ConvertToArticleDialogProps {
  submission: Submission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function ConvertToArticleDialog({
  submission,
  open,
  onOpenChange,
  onSuccess,
}: ConvertToArticleDialogProps) {
  const { createArticle } = useArticles();
  const { toast } = useToast();
  const [isConverting, setIsConverting] = useState(false);
  const [step, setStep] = useState<"review" | "customize" | "success">("review");

  // Article customization fields
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [methods, setMethods] = useState("");
  const [results, setResults] = useState("");
  const [discussion, setDiscussion] = useState("");
  const [references, setReferences] = useState("");
  const [keywords, setKeywords] = useState("");
  const [category, setCategory] = useState("");
  const [volume, setVolume] = useState("");
  const [issue, setIssue] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [publishImmediately, setPublishImmediately] = useState(false);

  const initializeForm = () => {
    if (submission) {
      setTitle(submission.title);
      setAuthors(submission.authors);
      setAbstract(submission.abstract);
      setKeywords(submission.keywords || "");
      setCategory(submission.category || "");
      setIntroduction("");
      setMethods("");
      setResults("");
      setDiscussion("");
      setReferences("");
      setVolume("");
      setIssue("");
      setImageUrl("");
      setIsFeatured(false);
      setPublishImmediately(false);
    }
    setStep("review");
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) initializeForm();
    onOpenChange(newOpen);
  };

  const handleConvert = async () => {
    if (!submission) return;
    setIsConverting(true);

    const keywordsArray = keywords
      ? keywords.split(",").map((k) => k.trim()).filter(Boolean)
      : undefined;

    const articleData: ArticleInput = {
      title,
      abstract,
      authors,
      introduction: introduction || undefined,
      methods: methods || undefined,
      results: results || undefined,
      discussion: discussion || undefined,
      references: references || undefined,
      keywords: keywordsArray,
      category: category || undefined,
      volume: volume || undefined,
      issue: issue || undefined,
      image_url: imageUrl || undefined,
      is_featured: isFeatured,
      submission_id: submission.id,
      published_at: publishImmediately ? new Date().toISOString() : null,
    };

    const result = await createArticle(articleData);

    if (result) {
      setStep("success");
      toast({
        title: "Article Created",
        description: publishImmediately
          ? "The submission has been converted and published."
          : "The submission has been converted to a draft article.",
      });
      setTimeout(() => {
        onOpenChange(false);
        onSuccess?.();
      }, 1500);
    }
    setIsConverting(false);
  };

  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {step === "review" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif flex items-center gap-2">
                Convert Submission to Article
              </DialogTitle>
              <DialogDescription>
                Review the accepted submission before converting it to a published article.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-medium mb-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Submission Accepted
                </div>
                <p className="text-sm text-green-600 dark:text-green-500">
                  This submission has completed the review process and is ready to be converted.
                </p>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Title</Label>
                  <p className="text-sm font-medium">{submission.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Authors</Label>
                  <p className="text-sm">{submission.authors}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Keywords</Label>
                  <p className="text-sm">{submission.keywords || "Not specified"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Abstract</Label>
                  <p className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">{submission.abstract}</p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={() => setStep("customize")}>
                Proceed to Customize <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "customize" && (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif">Customize Article</DialogTitle>
              <DialogDescription>
                Edit article details, add structured content, and set publication options.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authors">Authors</Label>
                <Input id="authors" value={authors} onChange={(e) => setAuthors(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Research, Review" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input id="keywords" value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="e.g., burns, surgery, grafts" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="volume">Volume</Label>
                  <Input id="volume" value={volume} onChange={(e) => setVolume(e.target.value)} placeholder="e.g., 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue">Issue</Label>
                  <Input id="issue" value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g., 1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Abstract</Label>
                <Textarea value={abstract} onChange={(e) => setAbstract(e.target.value)} rows={3} />
              </div>

              {/* Structured Academic Sections */}
              <div className="border-t pt-4 space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Structured Content Sections</h3>
                <div className="space-y-2">
                  <Label>1. Introduction</Label>
                  <RichTextEditor value={introduction} onChange={setIntroduction} />
                </div>
                <div className="space-y-2">
                  <Label>2. Methods</Label>
                  <RichTextEditor value={methods} onChange={setMethods} />
                </div>
                <div className="space-y-2">
                  <Label>3. Results</Label>
                  <RichTextEditor value={results} onChange={setResults} />
                </div>
                <div className="space-y-2">
                  <Label>4. Discussion</Label>
                  <RichTextEditor value={discussion} onChange={setDiscussion} />
                </div>
                <div className="space-y-2">
                  <Label>5. References</Label>
                  <RichTextEditor value={references} onChange={setReferences} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUpload value={imageUrl} onChange={setImageUrl} />
              </div>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Featured Article</Label>
                    <p className="text-sm text-muted-foreground">Display in featured sections</p>
                  </div>
                  <Switch checked={isFeatured} onCheckedChange={setIsFeatured} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Publish Immediately</Label>
                    <p className="text-sm text-muted-foreground">Make live right away</p>
                  </div>
                  <Switch checked={publishImmediately} onCheckedChange={setPublishImmediately} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("review")}>Back</Button>
              <Button onClick={handleConvert} disabled={isConverting || !title}>
                {isConverting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating Article...</>
                ) : (
                  <><CheckCircle2 className="mr-2 h-4 w-4" />Create Article</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "success" && (
          <div className="py-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-serif text-xl font-semibold mb-2">Article Created!</h3>
            <p className="text-muted-foreground">
              {publishImmediately
                ? "The article has been published and is now live."
                : "The article has been saved as a draft."}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

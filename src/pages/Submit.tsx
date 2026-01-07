import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Upload, FileText, Loader2, CheckCircle } from "lucide-react";

const categories = [
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

export default function Submit() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createSubmission, uploadManuscript } = useSubmissions();
  
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    authors: "",
    keywords: "",
    category: "",
    cover_letter: "",
  });
  
  const [manuscriptFile, setManuscriptFile] = useState<File | null>(null);
  const [supplementaryFile, setSupplementaryFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl">Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to submit a manuscript
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <CardTitle className="font-serif text-2xl">Submission Successful!</CardTitle>
              <CardDescription>
                Your manuscript has been submitted for review. You can track its status in your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => {
                setSubmitted(false);
                setFormData({
                  title: "",
                  abstract: "",
                  authors: "",
                  keywords: "",
                  category: "",
                  cover_letter: "",
                });
                setManuscriptFile(null);
                setSupplementaryFile(null);
              }}>
                Submit Another
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let manuscriptUrl = null;
    let supplementaryUrl = null;

    if (manuscriptFile) {
      manuscriptUrl = await uploadManuscript(manuscriptFile, 'manuscript');
    }

    if (supplementaryFile) {
      supplementaryUrl = await uploadManuscript(supplementaryFile, 'supplementary');
    }

    const result = await createSubmission({
      ...formData,
      manuscript_url: manuscriptUrl || undefined,
      supplementary_url: supplementaryUrl || undefined,
    });

    setIsSubmitting(false);

    if (result) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold mb-2">Submit Manuscript</h1>
            <p className="text-muted-foreground">
              Submit your research for peer review and publication consideration
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Manuscript Details */}
            <Card>
              <CardHeader>
                <CardTitle>Manuscript Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter the full title of your manuscript"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authors">Authors *</Label>
                  <Input
                    id="authors"
                    value={formData.authors}
                    onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                    placeholder="e.g., John Smith, MD; Jane Doe, PhD"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    List all authors in order, separated by semicolons
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    placeholder="e.g., breast reconstruction, microsurgery, outcomes"
                  />
                  <p className="text-xs text-muted-foreground">
                    Enter keywords separated by commas
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract *</Label>
                  <Textarea
                    id="abstract"
                    value={formData.abstract}
                    onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                    placeholder="Enter the abstract (max 300 words)"
                    rows={6}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Upload */}
            <Card>
              <CardHeader>
                <CardTitle>File Upload</CardTitle>
                <CardDescription>
                  Upload your manuscript and any supplementary materials
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Manuscript File *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {manuscriptFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span>{manuscriptFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setManuscriptFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </span>
                          <span className="text-xs text-muted-foreground">
                            PDF, DOC, DOCX (max 20MB)
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => setManuscriptFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Supplementary Materials (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {supplementaryFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span>{supplementaryFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setSupplementaryFile(null)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Upload figures, tables, or additional files
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ZIP, PDF, or image files (max 20MB)
                          </span>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.zip,.png,.jpg,.jpeg"
                          onChange={(e) => setSupplementaryFile(e.target.files?.[0] || null)}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cover Letter */}
            <Card>
              <CardHeader>
                <CardTitle>Cover Letter</CardTitle>
                <CardDescription>
                  Optional but recommended for original research submissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={formData.cover_letter}
                  onChange={(e) => setFormData({ ...formData, cover_letter: e.target.value })}
                  placeholder="Address the editor, explain the significance of your work, and confirm that the manuscript has not been published elsewhere..."
                  rows={6}
                />
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || !manuscriptFile}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Manuscript"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

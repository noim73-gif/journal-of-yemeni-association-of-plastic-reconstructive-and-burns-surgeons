import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Article, ArticleInput } from "@/hooks/useArticles";
import { ImageUpload } from "./ImageUpload";
import { RichTextEditor } from "./RichTextEditor";
import { X } from "lucide-react";

interface ArticleFormProps {
  article?: Article | null;
  onSubmit: (article: ArticleInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function ArticleForm({ article, onSubmit, onCancel, isSubmitting }: ArticleFormProps) {
  const [formData, setFormData] = useState<ArticleInput>({
    title: "",
    abstract: "",
    content: "",
    introduction: "",
    methods: "",
    results: "",
    discussion: "",
    references: "",
    authors: "",
    category: "",
    image_url: "",
    is_featured: false,
    is_main_featured: false,
    volume: "",
    issue: "",
  });

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title,
        abstract: article.abstract || "",
        content: article.content || "",
        introduction: article.introduction || "",
        methods: article.methods || "",
        results: article.results || "",
        discussion: article.discussion || "",
        references: article.references || "",
        authors: article.authors || "",
        category: article.category || "",
        image_url: article.image_url || "",
        is_featured: article.is_featured,
        is_main_featured: article.is_main_featured,
        volume: article.volume || "",
        issue: article.issue || "",
      });
    }
  }, [article]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-xl shadow-elegant max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-serif font-semibold">
            {article ? "Edit Article" : "New Article"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              placeholder="Enter article title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Original Article"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="authors">Authors</Label>
              <Input
                id="authors"
                value={formData.authors}
                onChange={(e) => setFormData({ ...formData, authors: e.target.value })}
                placeholder="e.g., Smith J, et al."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="volume">Volume</Label>
              <Input
                id="volume"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                placeholder="e.g., 153"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue">Issue</Label>
              <Input
                id="issue"
                value={formData.issue}
                onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                placeholder="e.g., 1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Cover Image</Label>
            <ImageUpload
              value={formData.image_url || ""}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>

          {/* Academic Sections */}
          <div className="space-y-6 border-t border-border pt-6">
            <h3 className="font-serif text-lg font-semibold text-foreground">Article Sections</h3>

            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                placeholder="Provide a structured summary of the study objectives, methods, results, and conclusions..."
                rows={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Introduction</Label>
              <RichTextEditor
                value={formData.introduction || ""}
                onChange={(introduction) => setFormData({ ...formData, introduction })}
                placeholder="Background, rationale, and objectives of the study..."
              />
            </div>

            <div className="space-y-2">
              <Label>Methods</Label>
              <RichTextEditor
                value={formData.methods || ""}
                onChange={(methods) => setFormData({ ...formData, methods })}
                placeholder="Study design, participants, interventions, data collection, and statistical analysis..."
              />
            </div>

            <div className="space-y-2">
              <Label>Results</Label>
              <RichTextEditor
                value={formData.results || ""}
                onChange={(results) => setFormData({ ...formData, results })}
                placeholder="Main findings, data, tables, and figures..."
              />
            </div>

            <div className="space-y-2">
              <Label>Discussion</Label>
              <RichTextEditor
                value={formData.discussion || ""}
                onChange={(discussion) => setFormData({ ...formData, discussion })}
                placeholder="Interpretation of results, comparison with literature, limitations, and implications..."
              />
            </div>

            <div className="space-y-2">
              <Label>References</Label>
              <RichTextEditor
                value={formData.references || ""}
                onChange={(references) => setFormData({ ...formData, references })}
                placeholder="List references in Vancouver style (numbered sequentially)..."
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Switch
                id="is_featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
              />
              <Label htmlFor="is_featured">Featured</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="is_main_featured"
                checked={formData.is_main_featured}
                onCheckedChange={(checked) => setFormData({ ...formData, is_main_featured: checked })}
              />
              <Label htmlFor="is_main_featured">Main Featured</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : article ? "Update Article" : "Create Article"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

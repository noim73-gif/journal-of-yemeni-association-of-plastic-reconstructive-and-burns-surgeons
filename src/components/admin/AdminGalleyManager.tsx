import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Trash2, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface Galley {
  id: string;
  article_id: string;
  label: string;
  file_type: string;
  file_url: string;
  is_primary: boolean | null;
  created_at: string;
}

interface AdminGalleyManagerProps {
  articleId: string;
  articleTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminGalleyManager({ articleId, articleTitle, open, onOpenChange }: AdminGalleyManagerProps) {
  const { toast } = useToast();
  const [galleys, setGalleys] = useState<Galley[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [label, setLabel] = useState("PDF");
  const [fileType, setFileType] = useState("pdf");
  const [file, setFile] = useState<File | null>(null);

  const fetchGalleys = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("article_galleys")
      .select("*")
      .eq("article_id", articleId)
      .order("created_at", { ascending: true });
    setGalleys(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (open) fetchGalleys();
  }, [open, articleId]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const ext = file.name.split(".").pop();
    const path = `galleys/${articleId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("manuscripts")
      .upload(path, file);

    if (uploadError) {
      logger.error("Galley upload error:", uploadError);
      toast({ variant: "destructive", title: "Upload failed", description: uploadError.message });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("manuscripts").getPublicUrl(path);

    const { error: insertError } = await supabase.from("article_galleys").insert({
      article_id: articleId,
      label,
      file_type: fileType,
      file_url: urlData.publicUrl,
      is_primary: galleys.length === 0,
    });

    if (insertError) {
      logger.error("Galley insert error:", insertError);
      toast({ variant: "destructive", title: "Error", description: "Failed to save galley record" });
    } else {
      toast({ title: "Success", description: `${label} galley uploaded` });
      setFile(null);
      fetchGalleys();
    }
    setUploading(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("article_galleys").delete().eq("id", id);
    if (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete galley" });
    } else {
      toast({ title: "Deleted", description: "Galley removed" });
      fetchGalleys();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif flex items-center gap-2">
            <FileText className="h-5 w-5" /> Manage Galleys
          </DialogTitle>
          <p className="text-sm text-muted-foreground truncate">{articleTitle}</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Form */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Upload New Galley</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., PDF, HTML" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">File Type</Label>
                  <Select value={fileType} onValueChange={setFileType}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="epub">EPUB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Input type="file" accept=".pdf,.html,.xml,.epub" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              <Button onClick={handleUpload} disabled={!file || uploading} className="w-full">
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                Upload Galley
              </Button>
            </CardContent>
          </Card>

          {/* Existing Galleys */}
          {loading ? (
            <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
          ) : galleys.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No galleys uploaded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Primary</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {galleys.map((g) => (
                  <TableRow key={g.id}>
                    <TableCell className="font-medium">{g.label}</TableCell>
                    <TableCell>{g.file_type.toUpperCase()}</TableCell>
                    <TableCell>{g.is_primary ? "Yes" : "No"}</TableCell>
                    <TableCell className="text-right">
                      <a href={g.file_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm">View</Button>
                      </a>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(g.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

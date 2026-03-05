import { useState } from "react";
import { useJournalIssues, JournalIssueInput } from "@/hooks/useJournalIssues";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, BookOpen, Trash2, Send, Edit, Loader2 } from "lucide-react";

export default function AdminIssues() {
  const { issues, loading, createIssue, updateIssue, publishIssue, deleteIssue } = useJournalIssues();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JournalIssueInput>({
    volume: 1,
    number: 1,
    year: new Date().getFullYear(),
    title: "",
    description: "",
  });

  const resetForm = () => {
    setForm({ volume: 1, number: 1, year: new Date().getFullYear(), title: "", description: "" });
    setEditingId(null);
  };

  const handleSubmit = async () => {
    if (editingId) {
      const ok = await updateIssue(editingId, form);
      if (ok) { setDialogOpen(false); resetForm(); }
    } else {
      const ok = await createIssue(form);
      if (ok) { setDialogOpen(false); resetForm(); }
    }
  };

  const openEdit = (issue: typeof issues[0]) => {
    setEditingId(issue.id);
    setForm({
      volume: issue.volume,
      number: issue.number,
      year: issue.year,
      title: issue.title || "",
      description: issue.description || "",
      status: issue.status,
    });
    setDialogOpen(true);
  };

  const statusColor = (s: string) => {
    if (s === "published") return "default";
    if (s === "archived") return "secondary";
    return "outline";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Issue Management</h1>
          <p className="text-muted-foreground">Manage journal volumes and issues (OJS-compliant)</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={(o) => { setDialogOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />New Issue</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Issue" : "Create New Issue"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Volume</Label>
                  <Input type="number" min={1} value={form.volume} onChange={(e) => setForm({ ...form, volume: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <Label>Number</Label>
                  <Input type="number" min={1} value={form.number} onChange={(e) => setForm({ ...form, number: parseInt(e.target.value) || 1 })} />
                </div>
                <div>
                  <Label>Year</Label>
                  <Input type="number" min={2000} value={form.year} onChange={(e) => setForm({ ...form, year: parseInt(e.target.value) || new Date().getFullYear() })} />
                </div>
              </div>
              <div>
                <Label>Title (optional)</Label>
                <Input value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Special Issue on Burns Surgery" />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              {editingId && (
                <div>
                  <Label>Status</Label>
                  <Select value={form.status || "draft"} onValueChange={(v) => setForm({ ...form, status: v as "draft" | "published" | "archived" })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <Button onClick={handleSubmit} className="w-full">{editingId ? "Update" : "Create"} Issue</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><BookOpen className="h-5 w-5" />Journal Issues</CardTitle>
        </CardHeader>
        <CardContent>
          {issues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No issues created yet. Create your first issue to start organizing articles.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volume / Issue</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Articles</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {issues.map((issue) => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">Vol. {issue.volume}, No. {issue.number}</TableCell>
                    <TableCell>{issue.year}</TableCell>
                    <TableCell>{issue.title || "—"}</TableCell>
                    <TableCell>{issue.article_count}</TableCell>
                    <TableCell>
                      <Badge variant={statusColor(issue.status)}>
                        {issue.status}
                        {issue.is_current && " (Current)"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(issue)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {issue.status === "draft" && (
                        <Button variant="ghost" size="icon" onClick={() => publishIssue(issue.id)}>
                          <Send className="h-4 w-4" />
                        </Button>
                      )}
                      {issue.article_count === 0 && (
                        <Button variant="ghost" size="icon" onClick={() => deleteIssue(issue.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

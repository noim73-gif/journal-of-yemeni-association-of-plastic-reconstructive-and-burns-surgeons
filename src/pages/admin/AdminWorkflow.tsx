import { useState } from "react";
import { useEditorialWorkflow, WorkflowStage, WorkflowSubmission, Decision } from "@/hooks/useEditorialWorkflow";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, FileText, Users, Eye, Pencil, Printer, BookOpen } from "lucide-react";

const STAGES: { key: WorkflowStage; label: string; icon: React.ReactNode }[] = [
  { key: "submission", label: "Submission", icon: <FileText className="h-4 w-4" /> },
  { key: "review", label: "Review", icon: <Eye className="h-4 w-4" /> },
  { key: "copyediting", label: "Copyediting", icon: <Pencil className="h-4 w-4" /> },
  { key: "production", label: "Production", icon: <Printer className="h-4 w-4" /> },
  { key: "publication", label: "Publication", icon: <BookOpen className="h-4 w-4" /> },
];

const stageOrder: WorkflowStage[] = ["submission", "review", "copyediting", "production", "publication"];

function WorkflowProgress({ current }: { current: WorkflowStage }) {
  const idx = stageOrder.indexOf(current);
  return (
    <div className="flex items-center gap-1">
      {STAGES.map((s, i) => (
        <div key={s.key} className="flex items-center gap-1">
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
            i < idx ? "bg-primary/20 text-primary" : i === idx ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            {s.icon}
            <span className="hidden md:inline">{s.label}</span>
          </div>
          {i < STAGES.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );
}

export default function AdminWorkflow() {
  const { submissions, loading, advanceStage, makeDecision, setReviewType, fetchSubmissions } = useEditorialWorkflow();
  const [selectedSubmission, setSelectedSubmission] = useState<WorkflowSubmission | null>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"advance" | "decide">("advance");
  const [decision, setDecision] = useState<Decision>("accept");
  const [comments, setComments] = useState("");
  const [activeTab, setActiveTab] = useState<WorkflowStage | "all">("all");

  const filtered = activeTab === "all" ? submissions : submissions.filter((s) => s.workflow_stage === activeTab);

  const getNextStage = (current: WorkflowStage): WorkflowStage | null => {
    const idx = stageOrder.indexOf(current);
    return idx < stageOrder.length - 1 ? stageOrder[idx + 1] : null;
  };

  const handleAdvance = async () => {
    if (!selectedSubmission) return;
    const next = getNextStage(selectedSubmission.workflow_stage);
    if (next) {
      await advanceStage(selectedSubmission.id, next, decision, comments);
    }
    setActionDialogOpen(false);
    setComments("");
  };

  const handleDecision = async () => {
    if (!selectedSubmission) return;
    await makeDecision(selectedSubmission.id, decision, comments);
    setActionDialogOpen(false);
    setComments("");
  };

  const openAction = (sub: WorkflowSubmission, type: "advance" | "decide") => {
    setSelectedSubmission(sub);
    setActionType(type);
    setActionDialogOpen(true);
  };

  const stageBadge = (stage: WorkflowStage) => {
    const colors: Record<string, string> = {
      submission: "outline",
      review: "secondary",
      copyediting: "default",
      production: "default",
      publication: "default",
    };
    return <Badge variant={colors[stage] as "outline" | "secondary" | "default"}>{stage}</Badge>;
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
      <div>
        <h1 className="text-2xl font-bold">Editorial Workflow</h1>
        <p className="text-muted-foreground">OJS 5-stage editorial workflow: Submission → Review → Copyediting → Production → Publication</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {STAGES.map((s) => {
          const count = submissions.filter((sub) => sub.workflow_stage === s.key).length;
          return (
            <Card key={s.key} className="cursor-pointer hover:border-primary transition-colors" onClick={() => setActiveTab(s.key)}>
              <CardContent className="p-4 text-center">
                <div className="flex justify-center mb-2">{s.icon}</div>
                <p className="text-2xl font-bold">{count}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as WorkflowStage | "all")}>
            <TabsList className="mb-4">
              <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
              {STAGES.map((s) => (
                <TabsTrigger key={s.key} value={s.key}>
                  {s.label} ({submissions.filter((sub) => sub.workflow_stage === s.key).length})
                </TabsTrigger>
              ))}
            </TabsList>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Review Type</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Reviews</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No submissions in this stage</TableCell>
                  </TableRow>
                ) : filtered.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium max-w-[200px] truncate">{sub.title}</TableCell>
                    <TableCell>{sub.author_name}</TableCell>
                    <TableCell><WorkflowProgress current={sub.workflow_stage} /></TableCell>
                    <TableCell>
                      <Select value={sub.review_type} onValueChange={(v) => setReviewType(sub.id, v as "single_blind" | "double_blind" | "open")}>
                        <SelectTrigger className="w-[140px] h-8"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single_blind">Single Blind</SelectItem>
                          <SelectItem value="double_blind">Double Blind</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {sub.decision ? (
                        <Badge variant={sub.decision === "accept" ? "default" : sub.decision === "reject" ? "destructive" : "secondary"}>
                          {sub.decision.replace("_", " ")}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell>{sub.review_count}</TableCell>
                    <TableCell className="text-right space-x-1">
                      {sub.workflow_stage === "review" && (
                        <Button variant="outline" size="sm" onClick={() => openAction(sub, "decide")}>Decision</Button>
                      )}
                      {getNextStage(sub.workflow_stage) && (
                        <Button size="sm" onClick={() => openAction(sub, "advance")}>
                          <ArrowRight className="h-4 w-4 mr-1" />
                          Next
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "advance"
                ? `Advance to ${selectedSubmission ? getNextStage(selectedSubmission.workflow_stage) : ""}`
                : "Record Editorial Decision"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-medium">{selectedSubmission?.title}</p>
            <div>
              <Label>Decision</Label>
              <Select value={decision} onValueChange={(v) => setDecision(v as Decision)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="accept">Accept</SelectItem>
                  <SelectItem value="minor_revisions">Minor Revisions</SelectItem>
                  <SelectItem value="major_revisions">Major Revisions</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Comments</Label>
              <Textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Add editorial comments..." />
            </div>
            <Button className="w-full" onClick={actionType === "advance" ? handleAdvance : handleDecision}>
              {actionType === "advance" ? "Advance Stage" : "Submit Decision"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

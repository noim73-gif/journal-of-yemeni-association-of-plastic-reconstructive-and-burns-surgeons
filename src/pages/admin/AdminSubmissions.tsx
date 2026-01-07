import { useState } from "react";
import { useSubmissions, Submission } from "@/hooks/useSubmissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, FileText, Download } from "lucide-react";
import { format } from "date-fns";

const statusOptions = [
  { value: "pending", label: "Pending Review" },
  { value: "under_review", label: "Under Review" },
  { value: "revision_requested", label: "Revision Requested" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
];

const getStatusBadge = (status: string) => {
  const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    pending: "secondary",
    under_review: "default",
    revision_requested: "outline",
    accepted: "default",
    rejected: "destructive",
  };

  const labels: Record<string, string> = {
    pending: "Pending",
    under_review: "Under Review",
    revision_requested: "Revision Requested",
    accepted: "Accepted",
    rejected: "Rejected",
  };

  return (
    <Badge variant={variants[status] || "secondary"}>
      {labels[status] || status}
    </Badge>
  );
};

export default function AdminSubmissions() {
  const { submissions, loading, updateSubmissionStatus, getManuscriptUrl } = useSubmissions();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleViewDetails = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowDetails(true);
  };

  const handleUpdateStatus = (submission: Submission) => {
    setSelectedSubmission(submission);
    setNewStatus(submission.status);
    setAdminNotes(submission.admin_notes || "");
    setShowStatusDialog(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedSubmission) return;
    setIsUpdating(true);
    await updateSubmissionStatus(selectedSubmission.id, newStatus, adminNotes);
    setIsUpdating(false);
    setShowStatusDialog(false);
    setSelectedSubmission(null);
  };

  const handleDownloadManuscript = async (path: string) => {
    const url = await getManuscriptUrl(path);
    if (url) {
      window.open(url, '_blank');
    }
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
        <h1 className="font-serif text-3xl font-bold mb-2">Submissions</h1>
        <p className="text-muted-foreground">
          Manage manuscript submissions
        </p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Authors</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No submissions yet
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {submission.title}
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">
                    {submission.authors}
                  </TableCell>
                  <TableCell>{submission.category || "-"}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>
                    {format(new Date(submission.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStatus(submission)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{selectedSubmission?.title}</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && format(new Date(selectedSubmission.created_at), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Status</Label>
                <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
              </div>

              <div>
                <Label className="text-sm font-medium">Authors</Label>
                <p className="mt-1 text-sm">{selectedSubmission.authors}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="mt-1 text-sm">{selectedSubmission.category || "Not specified"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Keywords</Label>
                <p className="mt-1 text-sm">{selectedSubmission.keywords || "None provided"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Abstract</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap">{selectedSubmission.abstract}</p>
              </div>

              {selectedSubmission.cover_letter && (
                <div>
                  <Label className="text-sm font-medium">Cover Letter</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">{selectedSubmission.cover_letter}</p>
                </div>
              )}

              <div className="flex gap-4">
                {selectedSubmission.manuscript_url && (
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadManuscript(selectedSubmission.manuscript_url!)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Manuscript
                  </Button>
                )}
                {selectedSubmission.supplementary_url && (
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadManuscript(selectedSubmission.supplementary_url!)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Supplementary Files
                  </Button>
                )}
              </div>

              {selectedSubmission.admin_notes && (
                <div>
                  <Label className="text-sm font-medium">Admin Notes</Label>
                  <p className="mt-1 text-sm bg-muted p-3 rounded-md">{selectedSubmission.admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Submission Status</DialogTitle>
            <DialogDescription>
              Change the status and add notes for this submission
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Admin Notes</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this submission..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

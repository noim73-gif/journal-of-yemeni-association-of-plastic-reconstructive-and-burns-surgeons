import { useState, useEffect } from "react";
import { useSubmissions, Submission } from "@/hooks/useSubmissions";
import { useSubmissionReviews, SubmissionReview } from "@/hooks/useSubmissionReviews";
import { useUsers } from "@/hooks/useUsers";
import { SubmissionReviewPanel } from "@/components/admin/SubmissionReviewPanel";
import { ConvertToArticleDialog } from "@/components/admin/ConvertToArticleDialog";
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
import { Loader2, Eye, FileText, Download, UserPlus, Users, BookOpen } from "lucide-react";
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

const getReviewStatusBadge = (status: string) => {
  const colors: Record<string, string> = {
    pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  };

  return (
    <Badge variant="secondary" className={colors[status] || ""}>
      {status.replace("_", " ")}
    </Badge>
  );
};

export default function AdminSubmissions() {
  const { submissions, loading, updateSubmissionStatus, getManuscriptUrl } = useSubmissions();
  const { reviews, assignReviewer, removeReviewer, getReviewsForSubmission, refetch: refetchReviews } = useSubmissionReviews();
  const { users } = useUsers();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showReviewersDialog, setShowReviewersDialog] = useState(false);
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [submissionReviews, setSubmissionReviews] = useState<SubmissionReview[]>([]);
  const [newStatus, setNewStatus] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [selectedReviewer, setSelectedReviewer] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConvertToArticle = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowConvertDialog(true);
  };

  const reviewers = users.filter((u) => u.roles.includes("reviewer"));

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

  const handleAssignReviewer = (submission: Submission) => {
    setSelectedSubmission(submission);
    setSelectedReviewer("");
    setShowAssignDialog(true);
  };

  const handleConfirmAssign = async () => {
    if (!selectedSubmission || !selectedReviewer) return;
    setIsUpdating(true);
    await assignReviewer(selectedSubmission.id, selectedReviewer);
    setIsUpdating(false);
    setShowAssignDialog(false);
    setSelectedSubmission(null);
    setSelectedReviewer("");
  };

  const handleViewReviewers = async (submission: Submission) => {
    setSelectedSubmission(submission);
    const reviews = await getReviewsForSubmission(submission.id);
    setSubmissionReviews(reviews);
    setShowReviewersDialog(true);
  };

  const handleRemoveReviewer = async (reviewId: string) => {
    await removeReviewer(reviewId);
    if (selectedSubmission) {
      const reviews = await getReviewsForSubmission(selectedSubmission.id);
      setSubmissionReviews(reviews);
    }
  };

  const getReviewerCount = (submissionId: string) => {
    return reviews.filter((r) => r.submission_id === submissionId).length;
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
          Manage manuscript submissions and assign reviewers
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
              <TableHead>Reviewers</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1"
                      onClick={() => handleViewReviewers(submission)}
                    >
                      <Users className="h-4 w-4" />
                      {getReviewerCount(submission.id)}
                    </Button>
                  </TableCell>
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
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAssignReviewer(submission)}
                      >
                        <UserPlus className="h-4 w-4" />
                      </Button>
                      {submission.status === "accepted" && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleConvertToArticle(submission)}
                          className="gap-1"
                        >
                          <BookOpen className="h-4 w-4" />
                          Publish
                        </Button>
                      )}
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
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif">{selectedSubmission?.title}</DialogTitle>
            <DialogDescription>
              Submitted on {selectedSubmission && format(new Date(selectedSubmission.created_at), "MMMM d, yyyy")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSubmission && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <div className="mt-1">{getStatusBadge(selectedSubmission.status)}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="mt-1 text-sm">{selectedSubmission.category || "Not specified"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Authors</Label>
                <p className="mt-1 text-sm">{selectedSubmission.authors}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Keywords</Label>
                <p className="mt-1 text-sm">{selectedSubmission.keywords || "None provided"}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Abstract</Label>
                <p className="mt-1 text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{selectedSubmission.abstract}</p>
              </div>

              {selectedSubmission.cover_letter && (
                <div>
                  <Label className="text-sm font-medium">Cover Letter</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap bg-muted p-3 rounded-md">{selectedSubmission.cover_letter}</p>
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

              {/* Peer Review Summary Section */}
              <SubmissionReviewPanel submissionId={selectedSubmission.id} />

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

      {/* Assign Reviewer Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Reviewer</DialogTitle>
            <DialogDescription>
              Select a reviewer for: {selectedSubmission?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reviewer</Label>
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {reviewers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No reviewers available
                    </SelectItem>
                  ) : (
                    reviewers.map((reviewer) => (
                      <SelectItem key={reviewer.user_id} value={reviewer.user_id}>
                        {reviewer.full_name || "Unnamed Reviewer"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            {reviewers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No users have the reviewer role. Go to Users to assign the reviewer role.
              </p>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmAssign} disabled={!selectedReviewer || isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                "Assign Reviewer"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Reviewers Dialog */}
      <Dialog open={showReviewersDialog} onOpenChange={setShowReviewersDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigned Reviewers</DialogTitle>
            <DialogDescription>
              Reviewers for: {selectedSubmission?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {submissionReviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No reviewers assigned yet
              </p>
            ) : (
              <div className="space-y-3">
                {submissionReviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{review.reviewer_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {getReviewStatusBadge(review.status)}
                        {review.recommendation && (
                          <Badge variant="outline" className="text-xs">
                            {review.recommendation.replace("_", " ")}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveReviewer(review.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReviewersDialog(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setShowReviewersDialog(false);
              if (selectedSubmission) handleAssignReviewer(selectedSubmission);
            }}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Reviewer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert to Article Dialog */}
      <ConvertToArticleDialog
        submission={selectedSubmission}
        open={showConvertDialog}
        onOpenChange={setShowConvertDialog}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { useReviews, Review } from "@/hooks/useReviews";
import { useArticles } from "@/hooks/useArticles";
import { useUsers } from "@/hooks/useUsers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import {
  Loader2,
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Users,
  ClipboardCheck,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  in_progress: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  completed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  declined: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const recommendationColors: Record<string, string> = {
  accept: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  minor_revisions: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  major_revisions: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  reject: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function AdminReviews() {
  const { reviews, loading, assignReviewer, removeReviewer } = useReviews();
  const { articles } = useArticles();
  const { users } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<string>("");
  const [selectedReviewer, setSelectedReviewer] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  // Get reviewers (users with reviewer role)
  const reviewers = users.filter((u) => u.roles.includes("reviewer"));

  // Get all articles for review assignment (both drafts and published)
  // Admins can assign reviewers to any article
  const reviewableArticles = articles;

  const filteredReviews = reviews.filter((review) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      review.article_title?.toLowerCase().includes(searchLower) ||
      review.reviewer_name?.toLowerCase().includes(searchLower)
    );
  });

  const handleAssignReviewer = async () => {
    if (!selectedArticle || !selectedReviewer) return;

    setIsSubmitting(true);
    await assignReviewer(selectedArticle, selectedReviewer);
    setIsSubmitting(false);
    setIsAssignDialogOpen(false);
    setSelectedArticle("");
    setSelectedReviewer("");
  };

  const handleRemoveReviewer = async (reviewId: string) => {
    await removeReviewer(reviewId);
  };

  // Stats
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const completedCount = reviews.filter((r) => r.status === "completed").length;
  const activeCount = reviews.filter((r) => r.status === "in_progress").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Peer Review Management</h1>
          <p className="text-muted-foreground">
            Assign reviewers and track single-blind peer review progress
          </p>
        </div>
        <Button onClick={() => setIsAssignDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Reviewer
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
            <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{pendingCount}</p>
            <p className="text-sm text-muted-foreground">Pending Reviews</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{activeCount}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
        </div>
        <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <ClipboardCheck className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by article or reviewer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Article</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recommendation</TableHead>
                <TableHead>Assigned</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No reviews found. Assign a reviewer to get started.
                  </TableCell>
                </TableRow>
              ) : (
                filteredReviews.map((review) => (
                  <TableRow key={review.id}>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="font-medium truncate">{review.article_title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{review.reviewer_name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[review.status]}>
                        {review.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {review.recommendation ? (
                        <Badge variant="secondary" className={recommendationColors[review.recommendation]}>
                          {review.recommendation.replace("_", " ")}
                        </Badge>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(parseISO(review.assigned_at), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setSelectedReview(review)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleRemoveReviewer(review.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Reviewer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Assign Reviewer Dialog */}
      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Reviewer</DialogTitle>
            <DialogDescription>
              Select an article and assign a reviewer for single-blind peer review
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Article</label>
              <Select value={selectedArticle} onValueChange={setSelectedArticle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an article" />
                </SelectTrigger>
                <SelectContent>
                  {reviewableArticles.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No articles available
                    </SelectItem>
                  ) : (
                    reviewableArticles.map((article) => (
                      <SelectItem key={article.id} value={article.id}>
                        {article.title}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Reviewer</label>
              <Select value={selectedReviewer} onValueChange={setSelectedReviewer}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {reviewers.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No reviewers available. Assign reviewer role first.
                    </SelectItem>
                  ) : (
                    reviewers.map((user) => (
                      <SelectItem key={user.user_id} value={user.user_id}>
                        {user.full_name || "Unnamed User"}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignReviewer}
              disabled={!selectedArticle || !selectedReviewer || isSubmitting}
            >
              {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Assign Reviewer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Review Details Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={() => setSelectedReview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Review feedback for: {selectedReview?.article_title}
            </DialogDescription>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Reviewer</label>
                  <p className="font-medium">{selectedReview.reviewer_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className={statusColors[selectedReview.status]}>
                      {selectedReview.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              </div>
              {selectedReview.recommendation && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Recommendation</label>
                  <div className="mt-1">
                    <Badge variant="secondary" className={recommendationColors[selectedReview.recommendation]}>
                      {selectedReview.recommendation.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
              )}
              {selectedReview.feedback && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Feedback to Author</label>
                  <p className="mt-1 p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                    {selectedReview.feedback}
                  </p>
                </div>
              )}
              {selectedReview.private_notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Private Notes (Editor Only)</label>
                  <p className="mt-1 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm whitespace-pre-wrap">
                    {selectedReview.private_notes}
                  </p>
                </div>
              )}
              {selectedReview.completed_at && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Completed</label>
                  <p>{format(parseISO(selectedReview.completed_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedReview(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

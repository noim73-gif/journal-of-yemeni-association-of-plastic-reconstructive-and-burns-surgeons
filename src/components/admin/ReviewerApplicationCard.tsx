import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronDown,
  ChevronUp,
  Mail,
  Building,
  GraduationCap,
  BookOpen,
  Check,
  X,
  Clock,
  Trash2,
  ExternalLink,
} from "lucide-react";
import {
  ReviewerApplication,
  ApplicationStatus,
  useUpdateApplicationStatus,
  useDeleteApplication,
} from "@/hooks/useReviewerApplications";

interface ReviewerApplicationCardProps {
  application: ReviewerApplication;
}

const statusConfig: Record<
  ApplicationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending", variant: "secondary" },
  under_review: { label: "Under Review", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function ReviewerApplicationCard({ application }: ReviewerApplicationCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState(application.admin_notes || "");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const updateStatus = useUpdateApplicationStatus();
  const deleteApplication = useDeleteApplication();

  const handleStatusChange = async (status: ApplicationStatus) => {
    await updateStatus.mutateAsync({
      id: application.id,
      status,
      admin_notes: adminNotes,
    });
  };

  const handleDelete = async () => {
    await deleteApplication.mutateAsync(application.id);
    setShowDeleteDialog(false);
  };

  const status = statusConfig[application.status];

  return (
    <>
      <Card>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{application.full_name}</CardTitle>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </div>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {application.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="h-4 w-4" />
                    {application.institution}
                  </span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {application.academic_title}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {application.publications_count} publications
                  </span>
                </div>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>

          <CollapsibleContent>
            <CardContent className="pt-0 space-y-6">
              {/* Details Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Department
                    </h4>
                    <p>{application.department || "Not specified"}</p>
                  </div>

                  {application.orcid_id && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        ORCID ID
                      </h4>
                      <a
                        href={`https://orcid.org/${application.orcid_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        {application.orcid_id}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {application.google_scholar_id && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Google Scholar
                      </h4>
                      <a
                        href={application.google_scholar_id}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-1"
                      >
                        View Profile
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Areas of Expertise
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {application.expertise_areas.map((area, idx) => (
                        <Badge key={idx} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {application.previous_review_experience && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Previous Review Experience
                      </h4>
                      <p className="text-sm">{application.previous_review_experience}</p>
                    </div>
                  )}

                  {application.motivation && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Motivation
                      </h4>
                      <p className="text-sm">{application.motivation}</p>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">
                      Submitted
                    </h4>
                    <p className="text-sm">
                      {format(new Date(application.created_at), "PPP 'at' p")}
                    </p>
                  </div>

                  {application.reviewed_at && (
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        Reviewed
                      </h4>
                      <p className="text-sm">
                        {format(new Date(application.reviewed_at), "PPP 'at' p")}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Admin Notes */}
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  Admin Notes
                </h4>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this application..."
                  className="min-h-[80px]"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                {application.status !== "approved" && (
                  <Button
                    onClick={() => handleStatusChange("approved")}
                    disabled={updateStatus.isPending}
                    className="gap-2"
                  >
                    <Check className="h-4 w-4" />
                    Approve
                  </Button>
                )}

                {application.status !== "under_review" && application.status === "pending" && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange("under_review")}
                    disabled={updateStatus.isPending}
                    className="gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    Mark Under Review
                  </Button>
                )}

                {application.status !== "rejected" && (
                  <Button
                    variant="outline"
                    onClick={() => handleStatusChange("rejected")}
                    disabled={updateStatus.isPending}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Reject
                  </Button>
                )}

                <Button
                  variant="ghost"
                  onClick={() => setShowDeleteDialog(true)}
                  className="gap-2 text-destructive hover:text-destructive ml-auto"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the application from {application.full_name}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

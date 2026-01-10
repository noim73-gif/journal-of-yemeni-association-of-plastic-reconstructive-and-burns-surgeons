import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Profile, DoctorProfile } from "@/hooks/useProfile";
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  Award, 
  BookOpen,
  ClipboardCheck,
  ArrowRight,
  Stethoscope,
  GraduationCap,
  Building2,
  Languages,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSubmissions } from "@/hooks/useSubmissions";
import { useSubmissionReviews } from "@/hooks/useSubmissionReviews";

interface ProfileOverviewProps {
  profile: Profile | null;
  doctorProfile: DoctorProfile | null;
  userRoles: string[];
}

export function ProfileOverview({ profile, doctorProfile, userRoles }: ProfileOverviewProps) {
  const { submissions } = useSubmissions();
  const { reviews } = useSubmissionReviews();
  
  const isReviewer = userRoles.includes("reviewer") || userRoles.includes("editor");

  // Calculate statistics
  const totalSubmissions = submissions?.length || 0;
  const pendingSubmissions = submissions?.filter(s => s.status === "pending" || s.status === "under_review").length || 0;
  const acceptedSubmissions = submissions?.filter(s => s.status === "accepted" || s.status === "published").length || 0;
  const completedReviews = reviews?.filter(r => r.status === "completed").length || 0;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Submissions</p>
                <p className="text-3xl font-bold font-serif">{totalSubmissions}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Under Review</p>
                <p className="text-3xl font-bold font-serif">{pendingSubmissions}</p>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Published</p>
                <p className="text-3xl font-bold font-serif">{acceptedSubmissions}</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-full">
                <Award className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {isReviewer && (
          <Card className="shadow-soft">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Reviews Completed</p>
                  <p className="text-3xl font-bold font-serif">{completedReviews}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-full">
                  <ClipboardCheck className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Professional Summary */}
      {doctorProfile && (
        <Card className="shadow-elegant">
          <CardHeader className="border-b">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Stethoscope className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-serif">Professional Summary</CardTitle>
                <CardDescription>Your medical credentials and expertise</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {doctorProfile.specialty && (
                <div className="flex items-start gap-3">
                  <Stethoscope className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Specialty</p>
                    <p className="font-medium">{doctorProfile.specialty}</p>
                  </div>
                </div>
              )}

              {doctorProfile.academic_degree && (
                <div className="flex items-start gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Degree</p>
                    <p className="font-medium">{doctorProfile.academic_degree}</p>
                  </div>
                </div>
              )}

              {doctorProfile.hospital && (
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Workplace</p>
                    <p className="font-medium">{doctorProfile.hospital}</p>
                  </div>
                </div>
              )}

              {doctorProfile.years_of_experience && (
                <div className="flex items-start gap-3">
                  <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Experience</p>
                    <p className="font-medium">{doctorProfile.years_of_experience} years</p>
                  </div>
                </div>
              )}

              {doctorProfile.spoken_languages && doctorProfile.spoken_languages.length > 0 && (
                <div className="flex items-start gap-3">
                  <Languages className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Languages</p>
                    <p className="font-medium">{doctorProfile.spoken_languages.join(", ")}</p>
                  </div>
                </div>
              )}

              {doctorProfile.research_interests && doctorProfile.research_interests.length > 0 && (
                <div className="flex items-start gap-3 md:col-span-2 lg:col-span-3">
                  <Search className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Research Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {doctorProfile.research_interests.map((interest) => (
                        <Badge key={interest} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!doctorProfile.specialty && (
              <div className="text-center py-6 text-muted-foreground">
                <p>Complete your professional profile to showcase your expertise</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/profile/professional">
                    Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Submissions */}
        <Card className="shadow-elegant">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="font-serif text-lg">Recent Submissions</CardTitle>
              </div>
              <Button asChild variant="ghost" size="sm">
                <Link to="/profile/submissions">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {submissions && submissions.length > 0 ? (
              <div className="space-y-3">
                {submissions.slice(0, 3).map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{submission.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(submission.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={
                      submission.status === "published" ? "default" :
                      submission.status === "accepted" ? "secondary" :
                      submission.status === "pending" ? "outline" : "destructive"
                    }>
                      {submission.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No submissions yet</p>
                <Button asChild variant="outline" className="mt-4">
                  <Link to="/submit">Submit Manuscript</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Reviews (for reviewers) */}
        {isReviewer && (
          <Card className="shadow-elegant">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <ClipboardCheck className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-lg">Recent Reviews</CardTitle>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/profile/reviews">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              {reviews && reviews.length > 0 ? (
                <div className="space-y-3">
                  {reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">Review #{review.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(review.assigned_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={review.status === "completed" ? "default" : "outline"}>
                        {review.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <ClipboardCheck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No reviews assigned yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

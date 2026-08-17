import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { useSubmissions } from "@/hooks/useSubmissions";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bookmark, History, Loader2, Trash2, Send, Plus } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DashboardHeader } from "@/components/DashboardHeader";
import { EmptyState } from "@/components/EmptyState";
import { EditorialStatusBadge } from "@/components/EditorialStatusBadge";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { ManuscriptCitation } from "@/components/manuscript/ManuscriptCitation";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { savedArticles, loading: savedLoading, unsaveArticle } = useSavedArticles();
  const { history, loading: historyLoading } = useReadingHistory();
  const { submissions, loading: submissionsLoading } = useSubmissions();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <DashboardHeader
            eyebrow="Your account"
            title="My Library"
            description="Manage your saved articles, reading history, and manuscript submissions."
            actions={
              <Button onClick={() => navigate("/submit")}>
                <Plus className="mr-2 h-4 w-4" />
                New Submission
              </Button>
            }
          />

          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="saved" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Saved Articles
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="h-4 w-4" />
                Reading History
              </TabsTrigger>
              <TabsTrigger value="submissions" className="gap-2">
                <Send className="h-4 w-4" />
                My Submissions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="saved">
              {savedLoading ? (
                <TableSkeleton rows={4} />
              ) : savedArticles.length === 0 ? (
                <EmptyState
                  icon={Bookmark}
                  title="No saved articles"
                  description="Bookmark articles while you read and they will be collected here for later."
                  action={<Button onClick={() => navigate("/articles")}>Browse Articles</Button>}
                />
              ) : (
                <div className="space-y-4">
                  {savedArticles.map((article) => (
                    <Link
                      to={`/article/${article.article_id}`}
                      key={article.id}
                      className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors block"
                    >
                      {article.article_image && (
                        <img
                          src={article.article_image}
                          alt=""
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-h5 line-clamp-2 mb-1">
                          {article.article_title}
                        </h3>
                        {article.article_authors && (
                          <p className="text-meta mb-2">
                            {article.article_authors}
                          </p>
                        )}
                        <p className="text-caption">
                          Saved {formatDistanceToNow(new Date(article.saved_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.preventDefault(); unsaveArticle(article.article_id); }}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {historyLoading ? (
                <TableSkeleton rows={4} />
              ) : history.length === 0 ? (
                <EmptyState
                  icon={History}
                  title="No reading history"
                  description="Articles you open will appear here so you can pick up where you left off."
                  action={<Button onClick={() => navigate("/articles")}>Browse Articles</Button>}
                />
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <Link
                      to={`/article/${item.article_id}`}
                      key={item.id}
                      className="flex gap-4 p-4 bg-card rounded-lg border border-border hover:border-primary/50 transition-colors block"
                    >
                      {item.article_image && (
                        <img
                          src={item.article_image}
                          alt=""
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-h5 line-clamp-2 mb-1">
                          {item.article_title}
                        </h3>
                        {item.article_authors && (
                          <p className="text-meta mb-2">
                            {item.article_authors}
                          </p>
                        )}
                        <p className="text-caption">
                          Read {formatDistanceToNow(new Date(item.read_at), { addSuffix: true })}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="submissions">
              {submissionsLoading ? (
                <TableSkeleton rows={4} />
              ) : submissions.length === 0 ? (
                <EmptyState
                  icon={Send}
                  title="No submissions yet"
                  description="Start a submission to send your manuscript through YJPRBS peer review."
                  action={
                    <Button onClick={() => navigate("/submit")}>
                      <Plus className="mr-2 h-4 w-4" />
                      Submit Manuscript
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div
                      key={submission.id}
                      className="p-4 bg-card rounded-lg border border-border"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-h5 line-clamp-2 pr-3">
                          {submission.title}
                        </h3>
                        <EditorialStatusBadge status={submission.status} />
                      </div>
                      <p className="text-meta mb-2">
                        {submission.authors}
                      </p>
                      <p className="text-caption">
                        Submitted {formatDistanceToNow(new Date(submission.created_at), { addSuffix: true })}
                      </p>
                      <ManuscriptCitation compact manuscript={submission} />
                      {submission.admin_notes && (
                        <div className="mt-3 p-3 bg-muted rounded-md">
                          <p className="text-overline mb-1">Editorial feedback</p>
                          <p className="text-body-sm">{submission.admin_notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}

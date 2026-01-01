import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSavedArticles } from "@/hooks/useSavedArticles";
import { useReadingHistory } from "@/hooks/useReadingHistory";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bookmark, History, Loader2, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { savedArticles, loading: savedLoading, unsaveArticle } = useSavedArticles();
  const { history, loading: historyLoading } = useReadingHistory();

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
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            My Library
          </h1>
          <p className="text-muted-foreground mb-8">
            Manage your saved articles and reading history
          </p>

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
            </TabsList>

            <TabsContent value="saved">
              {savedLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : savedArticles.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No saved articles</h3>
                  <p className="text-muted-foreground mb-4">
                    Start saving articles to read later
                  </p>
                  <Button onClick={() => navigate("/")}>Browse Articles</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedArticles.map((article) => (
                    <div
                      key={article.id}
                      className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                    >
                      {article.article_image && (
                        <img
                          src={article.article_image}
                          alt=""
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                          {article.article_title}
                        </h3>
                        {article.article_authors && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {article.article_authors}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Saved {formatDistanceToNow(new Date(article.saved_at), { addSuffix: true })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => unsaveArticle(article.article_id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="history">
              {historyLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">No reading history</h3>
                  <p className="text-muted-foreground mb-4">
                    Articles you read will appear here
                  </p>
                  <Button onClick={() => navigate("/")}>Browse Articles</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 bg-card rounded-lg border border-border"
                    >
                      {item.article_image && (
                        <img
                          src={item.article_image}
                          alt=""
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                          {item.article_title}
                        </h3>
                        {item.article_authors && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.article_authors}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Read {formatDistanceToNow(new Date(item.read_at), { addSuffix: true })}
                        </p>
                      </div>
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

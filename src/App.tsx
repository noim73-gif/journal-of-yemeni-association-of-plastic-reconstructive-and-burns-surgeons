import { useEffect, lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/admin/AdminLayout";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

// Lazy-loaded pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Archive = lazy(() => import("./pages/Archive"));
const PublicProfile = lazy(() => import("./pages/PublicProfile"));
const ReviewerDashboard = lazy(() => import("./pages/ReviewerDashboard"));
const Submit = lazy(() => import("./pages/Submit"));
const AuthorGuidelines = lazy(() => import("./pages/AuthorGuidelines"));
const About = lazy(() => import("./pages/About"));
const PeerReview = lazy(() => import("./pages/PeerReview"));
const PublicationEthics = lazy(() => import("./pages/PublicationEthics"));
const OpenAccess = lazy(() => import("./pages/OpenAccess"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const BecomeReviewer = lazy(() => import("./pages/BecomeReviewer"));
const EditorialBoard = lazy(() => import("./pages/EditorialBoard"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminArticles = lazy(() => import("./pages/admin/AdminArticles"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSubmissions = lazy(() => import("./pages/admin/AdminSubmissions"));
const AdminEditorialBoard = lazy(() => import("./pages/admin/AdminEditorialBoard"));
const AdminReviewerApplications = lazy(() => import("./pages/admin/AdminReviewerApplications"));
const AdminWorkflow = lazy(() => import("./pages/admin/AdminWorkflow"));
const AdminIssues = lazy(() => import("./pages/admin/AdminIssues"));

const LazyFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function AppContent() {
  // Global handler for unhandled promise rejections
  useEffect(() => {
    const handleRejection = (event: PromiseRejectionEvent) => {
      logger.error("Unhandled rejection:", event.reason);
      toast.error("An error occurred. Please try again.");
      event.preventDefault();
    };

    window.addEventListener("unhandledrejection", handleRejection);
    return () => window.removeEventListener("unhandledrejection", handleRejection);
  }, []);

  return (
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={<LazyFallback />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/reviewer" element={<ReviewerDashboard />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="workflow" element={<AdminWorkflow />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="submissions" element={<AdminSubmissions />} />
              <Route path="issues" element={<AdminIssues />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviewer-applications" element={<AdminReviewerApplications />} />
              <Route path="editorial-board" element={<AdminEditorialBoard />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="/articles" element={<Articles />} />
            <Route path="/archive" element={<Archive />} />
            <Route path="/article/:id" element={<Article />} />
            <Route path="/u/:username" element={<PublicProfile />} />
            <Route path="/author-guidelines" element={<AuthorGuidelines />} />
            <Route path="/about" element={<About />} />
            <Route path="/peer-review" element={<PeerReview />} />
            <Route path="/publication-ethics" element={<PublicationEthics />} />
            <Route path="/open-access" element={<OpenAccess />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/become-reviewer" element={<BecomeReviewer />} />
            <Route path="/editorial-board" element={<EditorialBoard />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <AppContent />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

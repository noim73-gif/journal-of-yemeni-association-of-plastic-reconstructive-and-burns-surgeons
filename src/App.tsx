import { Toaster } from "@/components/ui/toaster";
import EditorialBoard from "./pages/EditorialBoard";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Article from "./pages/Article";
import Articles from "./pages/Articles";
import Archive from "./pages/Archive";
import NotFound from "./pages/NotFound";
import PublicProfile from "./pages/PublicProfile";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminArticles from "./pages/admin/AdminArticles";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReviews from "./pages/admin/AdminReviews";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSubmissions from "./pages/admin/AdminSubmissions";
import AdminEditorialBoard from "./pages/admin/AdminEditorialBoard";
import AdminReviewerApplications from "./pages/admin/AdminReviewerApplications";
import ReviewerDashboard from "./pages/ReviewerDashboard";
import Submit from "./pages/Submit";
import AuthorGuidelines from "./pages/AuthorGuidelines";
import About from "./pages/About";
import PeerReview from "./pages/PeerReview";
import PublicationEthics from "./pages/PublicationEthics";
import OpenAccess from "./pages/OpenAccess";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import BecomeReviewer from "./pages/BecomeReviewer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/reviewer" element={<ReviewerDashboard />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="articles" element={<AdminArticles />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="submissions" element={<AdminSubmissions />} />
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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

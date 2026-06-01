import { usePageTitle } from "@/hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { SubmissionWizard } from "@/components/submit/SubmissionWizard";

export default function Submit() {
  usePageTitle("Submit Manuscript");
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
      <Breadcrumbs items={[{ label: "Submit Manuscript" }]} />
        <main className="container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="font-serif text-2xl">Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to submit a manuscript
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate("/auth")}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Breadcrumbs items={[{ label: "Submit Manuscript" }]} />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="font-serif text-3xl font-bold mb-2">Submit Manuscript</h1>
            <p className="text-muted-foreground">
              A guided five-step submission. Your progress is saved automatically — you
              can pause and return at any time.
            </p>
          </div>
          <SubmissionWizard />
        </div>
      </main>
      <Footer />
    </div>
  );
}

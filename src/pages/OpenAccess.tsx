import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Unlock, 
  FileCheck, 
  CreditCard, 
  Users, 
  Globe, 
  BookOpen,
  CheckCircle,
  XCircle
} from "lucide-react";

const OpenAccess = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Unlock className="h-5 w-5" />
            <span className="font-medium">Open Access Journal</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Open Access Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The Journal of Yemeni Medical Sciences is committed to making research freely available 
            to readers worldwide, removing barriers to scientific knowledge.
          </p>
        </div>

        {/* What is Open Access */}
        <Card className="mb-12 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <Globe className="h-12 w-12 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-3">What is Open Access?</h2>
                <p className="text-muted-foreground mb-4">
                  Open Access (OA) means that research articles are freely available online to anyone, 
                  anywhere in the world. There are no subscription fees or paywalls—readers can access, 
                  download, share, and reuse published content immediately upon publication.
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Free to read</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Free to download</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm">Free to share</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Licensing */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Licensing</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">CC BY 4.0</CardTitle>
                  <Badge className="bg-primary">Default License</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Creative Commons Attribution 4.0 International License allows others to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Share:</strong> Copy and redistribute in any medium or format</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Adapt:</strong> Remix, transform, and build upon the material</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Commercial use:</strong> Use for commercial purposes</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  With proper attribution to the original author(s) and source.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">CC BY-NC 4.0</CardTitle>
                  <Badge variant="secondary">Available on Request</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Creative Commons Attribution-NonCommercial 4.0 allows others to:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Share:</strong> Copy and redistribute in any medium or format</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Adapt:</strong> Remix, transform, and build upon the material</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span><strong>No commercial use:</strong> For non-commercial purposes only</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground italic">
                  Authors may request this license during submission if needed.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">Attribution Requirements</h3>
              <p className="text-muted-foreground mb-3">
                When reusing content, you must provide appropriate credit by including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Author names and article title</li>
                <li>Journal name (Journal of Yemeni Medical Sciences)</li>
                <li>DOI or link to the original article</li>
                <li>License type (e.g., CC BY 4.0)</li>
                <li>Indication of any modifications made</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Article Processing Charges */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Article Processing Charges (APC)</h2>
          </div>

          <Card className="mb-6 border-green-500/30 bg-green-50/50 dark:bg-green-950/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-foreground mb-2">No Publication Fees</h3>
                <p className="text-lg text-muted-foreground">
                  As a service to the medical community, the Journal of Yemeni Medical Sciences 
                  currently does not charge any article processing charges.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  No Submission Fee
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Submitting your manuscript for consideration is completely free. 
                There are no charges for initial review or processing.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  No Review Fee
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                The peer review process is provided at no cost to authors. 
                Our reviewers volunteer their expertise for free.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  No Publication Fee
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                Accepted articles are published without any charges. 
                Open access is provided at no cost to authors.
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6 bg-muted/50">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">Sustainability Note</h3>
              <p className="text-muted-foreground">
                The journal is supported by the Yemeni Association of Plastic, Reconstructive 
                and Burn Surgeons and institutional sponsors. This model allows us to remove 
                financial barriers for authors while maintaining high publication standards. 
                Should our funding model change in the future, authors will be notified in advance, 
                and any new fee structure will be clearly communicated with waiver options available.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Author Rights */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Author Rights</h2>
          </div>

          <p className="text-muted-foreground mb-6">
            Under our open access model, authors retain significant rights to their work. 
            Here's what you can do with your published article:
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-700">Rights You Retain</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Copyright ownership of your work</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Right to share on personal websites and repositories</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Right to use in teaching and presentations</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Right to include in theses and dissertations</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Right to create derivative works</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Right to share preprints and postprints</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Acknowledge the journal as the original publisher</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Include the DOI link to the published version</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Display the license terms when sharing</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Not grant exclusive rights to third parties</span>
                  </li>
                  <li className="flex items-start gap-2 text-muted-foreground">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span>Ensure co-authors agree to the chosen license</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-foreground mb-2">Self-Archiving Policy</h3>
              <div className="grid md:grid-cols-3 gap-4 text-muted-foreground">
                <div>
                  <h4 className="font-medium text-foreground mb-1">Preprints</h4>
                  <p className="text-sm">
                    Authors may share preprints (submitted version) on any platform at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Accepted Manuscript</h4>
                  <p className="text-sm">
                    The accepted version may be shared immediately upon acceptance.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">Published Version</h4>
                  <p className="text-sm">
                    The final published PDF can be shared anywhere with proper attribution.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Benefits of Open Access */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            Benefits of Open Access Publishing
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Globe className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Global Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Your research is accessible to readers worldwide without subscription barriers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Increased Citations</h3>
                <p className="text-sm text-muted-foreground">
                  Open access articles receive more citations and higher visibility.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <CheckCircle className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Funder Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Meets open access requirements of major research funders.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-2">Public Benefit</h3>
                <p className="text-sm text-muted-foreground">
                  Enables practitioners and patients to access latest research.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">Questions About Open Access?</h3>
            <p className="text-muted-foreground mb-4">
              If you have questions about our open access policy, licensing options, or author rights, 
              please contact our editorial office.
            </p>
            <a 
              href="mailto:YemeniAPRBSurgeons@gmail.com" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              YemeniAPRBSurgeons@gmail.com
            </a>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default OpenAccess;

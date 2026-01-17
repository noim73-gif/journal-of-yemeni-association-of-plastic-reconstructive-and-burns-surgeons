import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Send,
  Clock,
  FileCheck,
  Users,
  Mail,
  Download,
  ListChecks,
  PenTool,
  Image as ImageIcon,
  Table,
  Quote,
  FileWarning,
} from "lucide-react";

export default function AuthorGuidelines() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16">
          <div className="container max-w-4xl">
            <div className="text-center space-y-4">
              <Badge variant="secondary" className="mb-2">
                <BookOpen className="h-3 w-3 mr-1" />
                Author Resources
              </Badge>
              <h1 className="text-4xl font-serif font-bold">Author Guidelines</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about preparing and submitting your manuscript
                to the Journal of Yemeni Medical Research.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <Button asChild>
                  <Link to="/submit">
                    <Send className="mr-2 h-4 w-4" />
                    Submit Manuscript
                  </Link>
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Overview */}
        <section className="container max-w-4xl py-12">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold">Review Time</h3>
                <p className="text-sm text-muted-foreground mt-1">4-6 weeks average</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <FileCheck className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold">Acceptance Rate</h3>
                <p className="text-sm text-muted-foreground mt-1">~35% of submissions</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                <h3 className="font-semibold">Peer Review</h3>
                <p className="text-sm text-muted-foreground mt-1">Double-blind process</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Content */}
        <section className="container max-w-4xl pb-16">
          <div className="space-y-8">
            {/* Scope Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Scope & Focus
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none">
                <p>
                  The Journal of Yemeni Medical Research publishes original research,
                  reviews, case reports, and clinical studies across all areas of medicine
                  with a focus on:
                </p>
                <ul className="space-y-2 mt-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Clinical and translational research relevant to the Yemeni and Middle Eastern population</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Public health studies addressing regional health challenges</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Basic science research with clinical implications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Case reports of rare or novel conditions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                    <span>Systematic reviews and meta-analyses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Manuscript Types */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <FileText className="h-5 w-5 text-primary" />
                  Types of Manuscripts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Original Research</h4>
                    <p className="text-sm text-muted-foreground">
                      Up to 4,000 words excluding abstract and references. Maximum 6 tables/figures.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Review Articles</h4>
                    <p className="text-sm text-muted-foreground">
                      Up to 5,000 words. Comprehensive reviews on topics of current interest.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Case Reports</h4>
                    <p className="text-sm text-muted-foreground">
                      Up to 2,000 words with up to 4 figures. Novel or instructive cases only.
                    </p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">Short Communications</h4>
                    <p className="text-sm text-muted-foreground">
                      Up to 1,500 words. Preliminary findings or brief technical notes.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Formatting Guidelines */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <ListChecks className="h-5 w-5 text-primary" />
                  Manuscript Preparation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="general">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        General Formatting
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-3">
                      <ul className="space-y-2">
                        <li>• Use Microsoft Word (.doc, .docx) format</li>
                        <li>• Double-spaced text with 2.5 cm margins</li>
                        <li>• Times New Roman, 12-point font</li>
                        <li>• Number all pages consecutively</li>
                        <li>• Include line numbers for review purposes</li>
                        <li>• Use SI units for all measurements</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="title">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Title Page
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-3">
                      <p>The title page should include:</p>
                      <ul className="space-y-2">
                        <li>• Concise title (max 150 characters)</li>
                        <li>• Full names of all authors with affiliations</li>
                        <li>• Corresponding author's contact details</li>
                        <li>• Running title (max 50 characters)</li>
                        <li>• Word count for abstract and main text</li>
                        <li>• Number of tables and figures</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="abstract">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Quote className="h-4 w-4" />
                        Abstract & Keywords
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-3">
                      <p>
                        Structured abstract (max 300 words) with the following sections:
                      </p>
                      <ul className="space-y-2">
                        <li>• <strong>Background:</strong> Context and objectives</li>
                        <li>• <strong>Methods:</strong> Study design and procedures</li>
                        <li>• <strong>Results:</strong> Key findings with data</li>
                        <li>• <strong>Conclusion:</strong> Main implications</li>
                      </ul>
                      <p className="mt-3">
                        Include 3-6 keywords from MeSH terms for indexing purposes.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="figures">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <ImageIcon className="h-4 w-4" />
                        Figures & Images
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-3">
                      <ul className="space-y-2">
                        <li>• Minimum resolution of 300 DPI</li>
                        <li>• Accepted formats: TIFF, JPEG, PNG, EPS</li>
                        <li>• Figure legends on separate page</li>
                        <li>• Number figures consecutively (Figure 1, Figure 2, etc.)</li>
                        <li>• Patient photos require written consent</li>
                        <li>• Color figures are accepted at no additional cost</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="tables">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <Table className="h-4 w-4" />
                        Tables
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-3">
                      <ul className="space-y-2">
                        <li>• Create tables using Word's table function</li>
                        <li>• Number tables consecutively</li>
                        <li>• Include descriptive title above each table</li>
                        <li>• Use footnotes for abbreviations and symbols</li>
                        <li>• Avoid vertical lines; use horizontal lines sparingly</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="references">
                    <AccordionTrigger>
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        References
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground space-y-3">
                      <p>
                        Use Vancouver style for references. Number references consecutively
                        in the order they appear in the text.
                      </p>
                      <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                        <p className="font-medium mb-2">Example:</p>
                        <p>
                          1. Al-Sharqi A, Mohammed H. Prevalence of diabetes in Sana'a.
                          Yemen Med J. 2024;12(3):45-52. doi:10.1234/ymj.2024.001
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            {/* Submission Checklist */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Submission Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {[
                    "Manuscript file in Word format",
                    "Title page with all author information",
                    "Structured abstract (max 300 words)",
                    "All figures as separate high-resolution files",
                    "Cover letter addressed to the Editor",
                    "Conflicts of interest statement",
                    "Ethics approval documentation (if applicable)",
                    "Patient consent forms (if applicable)",
                    "ORCID iDs for all authors",
                    "Completed authorship agreement form",
                  ].map((item, index) => (
                    <label
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <div className="h-5 w-5 border-2 rounded flex items-center justify-center text-primary">
                        <CheckCircle2 className="h-4 w-4 opacity-0 hover:opacity-100" />
                      </div>
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Ethics & Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Ethics & Policies
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2">Research Ethics</h4>
                  <p className="text-sm text-muted-foreground">
                    All research involving human subjects must have ethics committee approval.
                    Include the approval number and committee name in your methods section.
                    Studies involving animals must comply with institutional guidelines.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Plagiarism Policy</h4>
                  <p className="text-sm text-muted-foreground">
                    All submissions are screened using plagiarism detection software.
                    Manuscripts with significant overlap with published work will be rejected.
                    Self-plagiarism is also not permitted.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Authorship Criteria</h4>
                  <p className="text-sm text-muted-foreground">
                    Authorship should be based on ICMJE criteria: (1) substantial contributions
                    to conception or design, (2) drafting or revising the work critically,
                    (3) final approval of the version to be published, and (4) accountability
                    for all aspects of the work.
                  </p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-semibold mb-2">Conflicts of Interest</h4>
                  <p className="text-sm text-muted-foreground">
                    All authors must disclose any financial or personal relationships that
                    could influence their work. Funding sources must be acknowledged.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Review Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-serif">
                  <FileWarning className="h-5 w-5 text-primary" />
                  Review Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
                  <div className="space-y-6">
                    {[
                      {
                        step: "1",
                        title: "Initial Screening",
                        description: "Editorial office checks manuscript for completeness and scope fit (1-2 days)",
                      },
                      {
                        step: "2",
                        title: "Editor Assignment",
                        description: "Associate editor evaluates scientific merit and assigns reviewers (3-5 days)",
                      },
                      {
                        step: "3",
                        title: "Peer Review",
                        description: "Double-blind review by 2-3 experts in the field (3-4 weeks)",
                      },
                      {
                        step: "4",
                        title: "Decision",
                        description: "Editor makes decision: Accept, Minor Revisions, Major Revisions, or Reject",
                      },
                      {
                        step: "5",
                        title: "Revision",
                        description: "Authors address reviewer comments and resubmit (if applicable)",
                      },
                      {
                        step: "6",
                        title: "Publication",
                        description: "Accepted manuscripts undergo copyediting and production",
                      },
                    ].map((item) => (
                      <div key={item.step} className="relative pl-10">
                        <div className="absolute left-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                          {item.step}
                        </div>
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Section */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Mail className="h-8 w-8 text-primary" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h3 className="font-serif font-semibold text-lg">Need Help?</h3>
                    <p className="text-muted-foreground">
                      Contact our editorial office for any questions about manuscript preparation or submission.
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <a href="mailto:editorial@jymr.org">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Editorial Office
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

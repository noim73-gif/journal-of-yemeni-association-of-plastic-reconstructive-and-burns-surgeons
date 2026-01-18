import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Search, 
  Users, 
  ClipboardCheck, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Shield,
  Eye,
  MessageSquare,
  Award,
  BookOpen,
  AlertCircle,
  Lightbulb
} from "lucide-react";

const reviewSteps = [
  {
    step: 1,
    title: "Manuscript Submission",
    description: "Author submits manuscript through online portal with all required documents",
    duration: "Day 0",
    icon: FileText,
  },
  {
    step: 2,
    title: "Editorial Assessment",
    description: "Editor-in-Chief performs initial screening for scope, quality, and completeness",
    duration: "1-3 days",
    icon: Search,
  },
  {
    step: 3,
    title: "Reviewer Assignment",
    description: "Suitable peer reviewers are identified and invited based on expertise",
    duration: "3-7 days",
    icon: Users,
  },
  {
    step: 4,
    title: "Peer Review",
    description: "Reviewers evaluate the manuscript and provide detailed feedback",
    duration: "2-4 weeks",
    icon: ClipboardCheck,
  },
  {
    step: 5,
    title: "Editorial Decision",
    description: "Editor makes decision based on reviewer recommendations",
    duration: "1-2 weeks",
    icon: MessageSquare,
  },
  {
    step: 6,
    title: "Revision (if required)",
    description: "Authors address reviewer comments and resubmit revised manuscript",
    duration: "2-4 weeks",
    icon: FileText,
  },
  {
    step: 7,
    title: "Final Decision",
    description: "Accept, reject, or request further revisions",
    duration: "1 week",
    icon: CheckCircle,
  },
];

const reviewerCriteria = [
  {
    title: "Academic Qualifications",
    items: [
      "MD, PhD, or equivalent degree in relevant field",
      "Active researcher with peer-reviewed publications",
      "Minimum 5 years of clinical or research experience",
    ],
  },
  {
    title: "Expertise Requirements",
    items: [
      "Demonstrated expertise in plastic, reconstructive, or burn surgery",
      "Publication record in the specific manuscript topic area",
      "Familiarity with current research methodologies",
    ],
  },
  {
    title: "Professional Standards",
    items: [
      "No conflicts of interest with authors or institutions",
      "Commitment to timely and constructive reviews",
      "Adherence to ethical guidelines and confidentiality",
    ],
  },
];

const evaluationCriteria = [
  {
    icon: Lightbulb,
    title: "Originality",
    description: "Novel contribution to the field with new insights or findings",
  },
  {
    icon: BookOpen,
    title: "Scientific Rigor",
    description: "Sound methodology, appropriate statistical analysis, valid conclusions",
  },
  {
    icon: Eye,
    title: "Clarity",
    description: "Well-written, organized, and clearly presented content",
  },
  {
    icon: Award,
    title: "Significance",
    description: "Clinical relevance and potential impact on practice",
  },
  {
    icon: Shield,
    title: "Ethics",
    description: "Compliance with ethical standards and proper approvals",
  },
  {
    icon: FileText,
    title: "References",
    description: "Comprehensive and current literature citations",
  },
];

export default function PeerReview() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">Publication Process</Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
                Peer Review Process
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                YJPRBS employs a rigorous double-blind peer review process to ensure the highest 
                quality of published research. Learn about our review workflow, timelines, and criteria.
              </p>
            </div>
          </div>
        </section>

        {/* Review Type */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-primary/20">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif">Double-Blind Review</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Both authors and reviewers remain anonymous throughout the review process. 
                      This ensures unbiased evaluation based solely on the scientific merit of 
                      the work, free from personal or institutional influence.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-accent/20">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-2">
                      <Users className="h-6 w-6 text-accent" />
                    </div>
                    <CardTitle className="font-serif">Multiple Reviewers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Each manuscript is evaluated by at least two independent reviewers with 
                      expertise in the relevant field. In cases of conflicting opinions, 
                      a third reviewer or editorial board member may be consulted.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Review Workflow */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Review Workflow</h2>
                <p className="text-muted-foreground">From submission to publication decision</p>
              </div>

              <div className="relative">
                {/* Timeline line - hidden on mobile */}
                <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-border -translate-x-1/2" />

                <div className="space-y-8">
                  {reviewSteps.map((item, index) => {
                    const Icon = item.icon;
                    const isLeft = index % 2 === 0;
                    
                    return (
                      <div key={item.step} className="relative">
                        {/* Desktop layout */}
                        <div className="hidden lg:grid lg:grid-cols-2 lg:gap-8 items-center">
                          {isLeft ? (
                            <>
                              <Card className="ml-auto max-w-md">
                                <CardContent className="pt-6">
                                  <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">Step {item.step}</Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {item.duration}
                                        </span>
                                      </div>
                                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                      <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <div />
                            </>
                          ) : (
                            <>
                              <div />
                              <Card className="mr-auto max-w-md">
                                <CardContent className="pt-6">
                                  <div className="flex items-start gap-4">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                      <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge variant="outline" className="text-xs">Step {item.step}</Badge>
                                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {item.duration}
                                        </span>
                                      </div>
                                      <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                      <p className="text-sm text-muted-foreground">{item.description}</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </>
                          )}
                        </div>

                        {/* Center dot for desktop */}
                        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-primary border-4 border-background" />

                        {/* Mobile layout */}
                        <Card className="lg:hidden">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <Badge variant="outline" className="text-xs">Step {item.step}</Badge>
                                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {item.duration}
                                  </span>
                                </div>
                                <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Timeline summary */}
              <Card className="mt-12 border-primary/20 bg-primary/5">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Expected Timeline</h3>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    The typical time from initial submission to first decision is <strong>6-8 weeks</strong>. 
                    This timeline may vary depending on reviewer availability and the complexity of revisions required. 
                    Authors are encouraged to respond to revision requests within <strong>4 weeks</strong> to 
                    expedite the publication process.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Evaluation Criteria */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Evaluation Criteria</h2>
                <p className="text-muted-foreground">What reviewers assess in each manuscript</p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {evaluationCriteria.map((criterion) => {
                  const Icon = criterion.icon;
                  return (
                    <Card key={criterion.title} className="text-center hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2">{criterion.title}</h3>
                        <p className="text-sm text-muted-foreground">{criterion.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Reviewer Criteria */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Reviewer Criteria</h2>
                <p className="text-muted-foreground">Qualifications required to serve as a peer reviewer</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                {reviewerCriteria.map((category, index) => (
                  <Card key={category.title}>
                    <CardHeader>
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-2">
                        {index + 1}
                      </div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="mt-10 border-accent/20">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Become a Reviewer</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        If you meet the above criteria and are interested in serving as a peer reviewer 
                        for YJPRBS, please contact our editorial office at{" "}
                        <a href="mailto:YemeniAPRBSurgeons@gmail.com" className="text-primary hover:underline">
                          YemeniAPRBSurgeons@gmail.com
                        </a>{" "}
                        with your CV and areas of expertise. We value the contributions of our reviewers 
                        and provide certificates of recognition for their service.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator />

        {/* Decision Types */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="font-serif text-3xl font-bold text-foreground mb-4">Decision Types</h2>
                <p className="text-muted-foreground">Possible outcomes of the review process</p>
              </div>

              <div className="space-y-4">
                <Card className="border-l-4 border-l-green-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Accept</h3>
                        <p className="text-sm text-muted-foreground">
                          The manuscript is accepted for publication with no or only minor editorial changes required.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <FileText className="h-6 w-6 text-blue-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Minor Revisions</h3>
                        <p className="text-sm text-muted-foreground">
                          The manuscript requires small changes that can be completed quickly. Revised version 
                          may not require additional peer review.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <AlertCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Major Revisions</h3>
                        <p className="text-sm text-muted-foreground">
                          Significant changes are needed to address methodological concerns, clarify findings, 
                          or strengthen conclusions. Revised version will undergo additional review.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <ArrowRight className="h-6 w-6 text-red-500 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Reject</h3>
                        <p className="text-sm text-muted-foreground">
                          The manuscript is not suitable for publication due to fundamental flaws, lack of 
                          originality, or being outside the journal's scope. Authors may submit to other journals.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, FileX, Users, Scale, BookOpen } from "lucide-react";

const PublicationEthics = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Publication Ethics</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The Journal of Yemeni Medical Sciences is committed to maintaining the highest standards 
            of publication ethics and preventing misconduct at every stage of the publication process.
          </p>
        </div>

        {/* Ethics Statement */}
        <Card className="mb-12 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Shield className="h-8 w-8 text-primary flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Our Commitment</h2>
                <p className="text-muted-foreground">
                  We adhere to the guidelines established by the Committee on Publication Ethics (COPE) 
                  and expect all authors, reviewers, and editors to uphold these standards. Our policies 
                  ensure the integrity, transparency, and reliability of published research.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plagiarism Policy */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <FileX className="h-7 w-7 text-destructive" />
            <h2 className="text-2xl font-bold text-foreground">Plagiarism Policy</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Definition & Detection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  Plagiarism includes copying text, ideas, images, or data from another source without 
                  proper attribution, including self-plagiarism from previously published work.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>All submissions are screened using plagiarism detection software</li>
                  <li>Similarity index above 15% triggers detailed review</li>
                  <li>Properly cited quotations are excluded from analysis</li>
                  <li>Common phrases and methodology descriptions are evaluated contextually</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Consequences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>
                  Plagiarism is a serious breach of publication ethics. Depending on severity:
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Minor:</strong> Request for revision with proper citations</li>
                  <li><strong>Moderate:</strong> Manuscript rejection and warning to authors</li>
                  <li><strong>Severe:</strong> Rejection, institutional notification, and potential ban</li>
                  <li><strong>Post-publication:</strong> Article retraction and public notice</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Conflicts of Interest */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-7 w-7 text-amber-600" />
            <h2 className="text-2xl font-bold text-foreground">Conflicts of Interest</h2>
          </div>

          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                A conflict of interest exists when professional judgment concerning a primary interest 
                (such as research validity) may be influenced by a secondary interest (such as financial 
                gain or personal relationships).
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">For Authors</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <ul className="list-disc list-inside space-y-2">
                  <li>Disclose all funding sources</li>
                  <li>Report financial relationships with industry</li>
                  <li>Declare personal or professional relationships</li>
                  <li>Report patents or intellectual property interests</li>
                  <li>Complete COI form during submission</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">For Reviewers</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <ul className="list-disc list-inside space-y-2">
                  <li>Decline reviews with potential conflicts</li>
                  <li>Report any discovered conflicts immediately</li>
                  <li>Avoid reviewing colleagues' or competitors' work</li>
                  <li>Maintain objectivity in all evaluations</li>
                  <li>Do not use unpublished information</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">For Editors</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-2">
                <ul className="list-disc list-inside space-y-2">
                  <li>Recuse from handling conflicted submissions</li>
                  <li>Assign alternative editors when needed</li>
                  <li>Ensure fair and unbiased peer review</li>
                  <li>Maintain confidentiality of submissions</li>
                  <li>Make decisions based solely on merit</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Retraction Guidelines */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="h-7 w-7 text-destructive" />
            <h2 className="text-2xl font-bold text-foreground">Retraction Guidelines</h2>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Grounds for Retraction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 text-muted-foreground">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Clear evidence of data fabrication or falsification</li>
                    <li>Significant plagiarism discovered post-publication</li>
                    <li>Duplicate publication without disclosure</li>
                    <li>Research conducted without ethical approval</li>
                  </ul>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Fraudulent authorship or attribution</li>
                    <li>Fundamental errors affecting conclusions</li>
                    <li>Copyright infringement</li>
                    <li>Failure to disclose major conflicts of interest</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Retraction Process</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <ol className="list-decimal list-inside space-y-3">
                  <li>
                    <strong>Investigation:</strong> Concerns are reviewed by the Editor-in-Chief and 
                    Ethics Committee. Authors are contacted for explanation.
                  </li>
                  <li>
                    <strong>Decision:</strong> Based on evidence, the editorial board decides on 
                    retraction, correction, or expression of concern.
                  </li>
                  <li>
                    <strong>Notification:</strong> Authors and their institutions are formally notified 
                    of the decision with detailed reasoning.
                  </li>
                  <li>
                    <strong>Publication:</strong> A retraction notice is published, linked to the 
                    original article, and the article is watermarked as "RETRACTED."
                  </li>
                  <li>
                    <strong>Indexing:</strong> Major databases and indexing services are notified of 
                    the retraction for proper record updates.
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Scale className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Expression of Concern</h3>
                    <p className="text-muted-foreground">
                      When concerns arise but evidence is inconclusive, we may publish an Expression 
                      of Concern while investigation continues. This alerts readers to potential issues 
                      while protecting authors from premature judgment.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Ethics Policies */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-7 w-7 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Additional Policies</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Authorship Criteria</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>We follow ICMJE authorship criteria. Authors must:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Make substantial contributions to conception, design, or analysis</li>
                  <li>Draft or critically revise the manuscript</li>
                  <li>Approve the final version for publication</li>
                  <li>Agree to be accountable for all aspects of the work</li>
                </ul>
                <p className="text-sm italic">
                  All contributors who do not meet authorship criteria should be acknowledged.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Data Integrity</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>Authors are expected to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Maintain accurate research records</li>
                  <li>Provide raw data upon reasonable request</li>
                  <li>Ensure reproducibility of results</li>
                  <li>Report methods accurately and completely</li>
                </ul>
                <p className="text-sm italic">
                  Data fabrication or falsification will result in retraction and reporting.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Human & Animal Research</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>Research involving human or animal subjects must:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Obtain appropriate ethics committee approval</li>
                  <li>Follow Declaration of Helsinki guidelines</li>
                  <li>Include informed consent documentation</li>
                  <li>Adhere to ARRIVE guidelines for animal studies</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Reporting Misconduct</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>To report suspected misconduct:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Email: ethics@jyms.edu.ye</li>
                  <li>All reports are treated confidentially</li>
                  <li>Anonymous reports are accepted</li>
                  <li>Whistleblower protection is guaranteed</li>
                </ul>
                <p className="text-sm italic">
                  We investigate all credible allegations thoroughly and fairly.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* COPE Membership */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Committed to Ethical Publishing
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Journal of Yemeni Medical Sciences follows the guidelines of the Committee on 
                Publication Ethics (COPE) and is committed to investigating and addressing any 
                allegations of misconduct. For more information about publication ethics standards, 
                visit <a href="https://publicationethics.org" target="_blank" rel="noopener noreferrer" 
                className="text-primary hover:underline">publicationethics.org</a>.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default PublicationEthics;

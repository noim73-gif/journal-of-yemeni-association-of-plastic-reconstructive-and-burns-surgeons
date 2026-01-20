import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FileText, ClipboardCheck, BookOpen, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const submissionFAQs = [
  {
    question: "How do I submit a manuscript?",
    answer: "To submit a manuscript, you must first create an account and log in. Then, navigate to the 'Submit' page from your dashboard. Fill out the submission form with your manuscript details, upload your files, and submit. You will receive a confirmation email once your submission is received."
  },
  {
    question: "What file formats are accepted?",
    answer: "We accept manuscripts in Microsoft Word (.doc, .docx) and PDF formats. For figures and images, we accept JPEG, PNG, and TIFF formats with a minimum resolution of 300 DPI. Supplementary materials can be submitted in various formats including Excel, CSV, and video files."
  },
  {
    question: "Is there a word limit for manuscripts?",
    answer: "Word limits vary by article type: Original Research articles should be 3,000-5,000 words; Review articles up to 6,000 words; Case Reports 1,500-2,500 words; Short Communications up to 2,000 words. These limits exclude the abstract, references, tables, and figure legends."
  },
  {
    question: "What should be included in a cover letter?",
    answer: "Your cover letter should include: a brief summary of your research and its significance, a statement confirming the work is original and not under consideration elsewhere, disclosure of any conflicts of interest, suggested reviewers (optional), and any additional information relevant to your submission."
  },
  {
    question: "Can I submit a manuscript that has been posted as a preprint?",
    answer: "Yes, we accept manuscripts that have been posted on recognized preprint servers. Please disclose this information in your cover letter and include the preprint DOI. Upon acceptance, the preprint should be updated to link to the published version."
  },
  {
    question: "How do I format references?",
    answer: "References should follow the Vancouver style (numbered citations in order of appearance). Each reference should include all authors (up to 6, then 'et al.'), article title, journal name (abbreviated), year, volume, and page numbers. For online sources, include the DOI or URL with access date."
  },
  {
    question: "What are the requirements for figures and tables?",
    answer: "Figures should be high-resolution (300 DPI minimum), with clear labels and legends. Tables should be editable (not images) with descriptive titles. Each figure and table must be cited in the text. Color figures are accepted at no additional charge."
  }
];

const reviewFAQs = [
  {
    question: "How long does the review process take?",
    answer: "The initial editorial assessment typically takes 1-2 weeks. If sent for peer review, the process usually takes 4-8 weeks. Authors are notified of decisions within 2 weeks after reviews are received. Total time from submission to first decision is typically 6-10 weeks."
  },
  {
    question: "What type of peer review does the journal use?",
    answer: "We use a single-blind peer review process where reviewers know the authors' identities, but authors do not know the reviewers' identities. This approach balances accountability with honest, constructive feedback."
  },
  {
    question: "How are reviewers selected?",
    answer: "Reviewers are selected based on their expertise in the relevant field, publication record, and availability. We aim to assign at least two independent reviewers per manuscript. Authors may suggest preferred or non-preferred reviewers, though final selection rests with the editors."
  },
  {
    question: "What are the possible review outcomes?",
    answer: "Possible decisions include: Accept (no changes required), Minor Revisions (small changes needed, may not require re-review), Major Revisions (significant changes required, will be re-reviewed), or Reject (manuscript not suitable for publication). Most accepted papers require at least one round of revision."
  },
  {
    question: "How do I respond to reviewer comments?",
    answer: "Submit a point-by-point response letter addressing each reviewer comment. Clearly indicate what changes were made and where in the manuscript. If you disagree with a comment, provide a reasoned explanation. Submit the revised manuscript with changes tracked or highlighted."
  },
  {
    question: "Can I appeal a rejection decision?",
    answer: "Yes, you may appeal if you believe the decision was based on a misunderstanding or factual error. Submit a detailed appeal letter to the Editor-in-Chief within 30 days of the decision. Appeals are reviewed carefully, but overturning decisions is rare."
  },
  {
    question: "What happens if reviewers disagree?",
    answer: "If reviewers provide conflicting recommendations, the handling editor may seek an additional opinion or make a decision based on their own assessment. The editor weighs all feedback and makes the final decision, which will be communicated with clear reasoning."
  }
];

const publicationFAQs = [
  {
    question: "Are there any publication fees?",
    answer: "Currently, the Journal of Yemeni Medical Sciences does not charge any article processing charges (APCs) or submission fees. Publication is free for all accepted manuscripts. This policy may be reviewed in the future with advance notice to authors."
  },
  {
    question: "How long does it take from acceptance to publication?",
    answer: "Once accepted, articles undergo copyediting and typesetting within 2-3 weeks. Authors receive proofs for review within 1 week. After proof approval, articles are published online within 5-7 business days. Print publication follows the journal's quarterly schedule."
  },
  {
    question: "What license will my article be published under?",
    answer: "All articles are published under the Creative Commons Attribution (CC BY 4.0) license by default. This allows others to share and adapt your work with proper attribution. Authors may request the CC BY-NC 4.0 license (non-commercial) if needed."
  },
  {
    question: "Will my article receive a DOI?",
    answer: "Yes, all published articles receive a Digital Object Identifier (DOI), providing a permanent link to your work. The DOI is assigned during the production process and included in the final published article."
  },
  {
    question: "Can I share my published article?",
    answer: "Yes! Under our open access model, you can freely share your published article on your personal website, institutional repository, social media, and with colleagues. We encourage authors to promote their work widely."
  },
  {
    question: "How do I order reprints or print copies?",
    answer: "Authors can order print reprints through our production department. Contact the editorial office after your article is accepted for pricing and ordering information. PDF versions are always freely available for download."
  },
  {
    question: "How will my article be indexed?",
    answer: "We are working to index the journal in major databases including PubMed, Scopus, and Web of Science. Currently published articles are indexed in Google Scholar and other open access directories. Check our About page for the latest indexing status."
  },
  {
    question: "Can I make corrections after publication?",
    answer: "Minor typographical errors can be corrected through an erratum notice. For significant errors affecting conclusions, a correction or corrigendum will be published. In cases of serious issues, articles may be retracted following COPE guidelines. Contact the editorial office to report any errors."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <HelpCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-muted-foreground">
              Find answers to common questions about submitting, reviewing, and publishing 
              with the Journal of Yemeni Medical Sciences.
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Submission FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                Submission Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {submissionFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`submission-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Review FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-secondary/50 rounded-lg">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                Peer Review Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {reviewFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`review-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Publication FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="p-2 bg-accent/50 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                Publication Questions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {publicationFAQs.map((faq, index) => (
                  <AccordionItem key={index} value={`publication-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Still Have Questions */}
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Still Have Questions?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Can't find what you're looking for? Our editorial team is here to help. 
                Check our detailed guidelines or reach out directly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/author-guidelines">
                    <FileText className="mr-2 h-4 w-4" />
                    Author Guidelines
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    Contact Editorial Office
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;

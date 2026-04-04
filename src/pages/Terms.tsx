import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function Terms() {
  usePageTitle("Terms of Use");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Terms of Use</h1>

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing the Yemeni Journal of Plastic, Reconstructive and Burn Surgery (YJPRBS) website,
            you agree to these terms of use. If you do not agree, please do not use the website.
          </p>

          <h2>2. Open Access Policy</h2>
          <p>
            All articles published in YJPRBS are open access under the Creative Commons Attribution 4.0
            International License (CC BY 4.0). Readers may share, copy, and redistribute articles in any
            medium or format, and adapt, remix, and build upon them for any purpose, provided appropriate
            credit is given.
          </p>

          <h2>3. Author Responsibilities</h2>
          <p>Authors submitting manuscripts to YJPRBS warrant that:</p>
          <ul>
            <li>The work is original and has not been published elsewhere</li>
            <li>All co-authors have approved the submission</li>
            <li>The research complies with ethical standards and relevant regulations</li>
            <li>Proper attribution and citations are provided</li>
          </ul>

          <h2>4. Reviewer Responsibilities</h2>
          <p>
            Peer reviewers agree to maintain confidentiality, provide objective and constructive feedback,
            disclose conflicts of interest, and complete reviews within agreed timeframes.
          </p>

          <h2>5. Intellectual Property</h2>
          <p>
            The journal's name, logo, and website design are the property of the Yemeni Association of
            Plastic, Reconstructive and Burn Surgeons. Published article content is licensed under CC BY 4.0.
          </p>

          <h2>6. Limitation of Liability</h2>
          <p>
            YJPRBS provides content for informational and educational purposes. The journal is not liable for
            any clinical decisions made based on published content. Healthcare professionals should exercise
            independent clinical judgment.
          </p>

          <h2>7. Modifications</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the website constitutes
            acceptance of updated terms.
          </p>

          <h2>8. Contact</h2>
          <p>
            For questions about these terms, contact us at{" "}
            <a href="mailto:YemeniAPRBSurgeons@gmail.com" className="text-primary hover:underline">
              YemeniAPRBSurgeons@gmail.com
            </a>.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

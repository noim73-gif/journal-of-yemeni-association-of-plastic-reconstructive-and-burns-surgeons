import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";

export default function PrivacyPolicy() {
  usePageTitle("Privacy Policy");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>

        <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground">
          <p className="text-muted-foreground mb-6">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            The Yemeni Journal of Plastic, Reconstructive and Burn Surgery (YJPRBS) collects personal information
            necessary for manuscript submission, peer review, and publication processes. This includes your name,
            email address, institutional affiliation, and professional credentials.
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul>
            <li>Process and manage manuscript submissions</li>
            <li>Facilitate the peer review process</li>
            <li>Communicate editorial decisions and publication updates</li>
            <li>Maintain records of published articles and their authorship</li>
            <li>Improve our journal services and user experience</li>
          </ul>

          <h2>3. Data Sharing</h2>
          <p>
            We do not sell or rent personal information. Author names, affiliations, and article content are
            published as part of the open-access publication process. Reviewer identities are kept confidential
            in accordance with our double-blind peer review policy.
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect personal data against
            unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. To exercise these rights,
            please contact the editorial office at YemeniAPRBSurgeons@gmail.com.
          </p>

          <h2>6. Cookies</h2>
          <p>
            This website uses essential cookies for authentication and session management. No third-party
            tracking cookies are used.
          </p>

          <h2>7. Contact</h2>
          <p>
            For privacy-related inquiries, contact us at{" "}
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

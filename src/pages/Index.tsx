import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { RecentIssues } from "@/components/RecentIssues";
import { QuickLinks } from "@/components/QuickLinks";
import { Footer } from "@/components/Footer";
import { usePageTitle } from "@/hooks/usePageTitle";
import { ImpactStrip } from "@/components/home/ImpactStrip";
import { EditorsPick } from "@/components/home/EditorsPick";
import { MostRead } from "@/components/home/MostRead";
import { IndexedIn } from "@/components/home/IndexedIn";

const Index = () => {
  usePageTitle("");
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main id="main-content">
        <Hero />
        <ImpactStrip />
        <FeaturedSection />
        <EditorsPick />
        <MostRead />
        <RecentIssues />
        <IndexedIn />
        <QuickLinks />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "YJPRBS — Yemeni Journal of Plastic, Reconstructive and Burns Surgery",
            url: typeof window !== "undefined" ? window.location.origin : "/",
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${typeof window !== "undefined" ? window.location.origin : ""}/articles?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
    </div>
  );
};

export default Index;

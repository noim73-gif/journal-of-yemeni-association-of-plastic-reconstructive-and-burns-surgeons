import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FeaturedSection } from "@/components/FeaturedSection";
import { RecentIssues } from "@/components/RecentIssues";
import { QuickLinks } from "@/components/QuickLinks";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedSection />
        <RecentIssues />
        <QuickLinks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

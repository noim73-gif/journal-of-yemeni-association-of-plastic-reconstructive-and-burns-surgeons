import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-primary-dark overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      <div className="container mx-auto px-4 py-16 md:py-24 relative">
        <div className="max-w-4xl">
          <div className="inline-block mb-6">
            <span className="bg-accent/20 text-accent-foreground px-4 py-1.5 rounded-full text-sm font-medium">
              Open Access · Peer Reviewed
            </span>
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Yemeni Journal of Plastic, Reconstructive and Burn Surgery
            <span className="block text-accent text-center font-thin">YJPRBS</span>
          </h1>

          <p className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl leading-relaxed">
            The official Journal of Yemeni Association of Plastic, Reconstructive and Burn Surgeons.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button variant="hero" size="lg" onClick={() => navigate("/articles?issue=current")}>
              Read Current Issue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="heroOutline" size="lg" onClick={() => navigate("/submit")}>
              Submit Your Research
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-primary-foreground/20 max-w-lg">
            <div>
              <div className="font-serif text-3xl font-bold text-accent">eISSN</div>
              <div className="text-sm text-primary-foreground/70">3009-6316</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-accent">Double</div>
              <div className="text-sm text-primary-foreground/70">Blind Review</div>
            </div>
            <div>
              <div className="font-serif text-3xl font-bold text-accent">OA</div>
              <div className="text-sm text-primary-foreground/70">Open Access</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

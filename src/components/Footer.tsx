import { forwardRef } from "react";
import journalLogo from "@/assets/journal-logo.png";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return <footer ref={ref} id="about" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={journalLogo} alt="YJPRBS Logo" className="h-10 w-auto brightness-0 invert" />
              <span className="font-serif font-semibold">YJPRBS</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">The official journal of the Yemeni Association of Plastic, Reconstructive and Burn Surgeons, advancing the science and art of plastic surgery since 2011.</p>
            <p className="text-primary-foreground/80 text-xs font-medium mb-4 tracking-wide">eISSN: 3009-6316</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="/articles" className="hover:text-accent transition-colors">Current Issue</a></li>
              <li><a href="/archive" className="hover:text-accent transition-colors">Archive</a></li>
              <li><a href="/editorial-board" className="hover:text-accent transition-colors">Editorial Board</a></li>
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <h4 className="font-semibold mb-4">For Authors</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="/submit" className="hover:text-accent transition-colors">Submit Manuscript</a></li>
              <li><a href="/author-guidelines" className="hover:text-accent transition-colors">Author Guidelines</a></li>
              <li><a href="/peer-review" className="hover:text-accent transition-colors">Peer Review Process</a></li>
              <li><a href="/publication-ethics" className="hover:text-accent transition-colors">Publication Ethics</a></li>
              <li><a href="/open-access" className="hover:text-accent transition-colors">Open Access Policy</a></li>
              <li><a href="/faq" className="hover:text-accent transition-colors">FAQ for Authors</a></li>
              <li><a href="/become-reviewer" className="hover:text-accent transition-colors">Become a Reviewer</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>YemeniAPRBSurgeons@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>+967 783331323</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Yemeni - Sana'a</span>
              </li>
              <li className="mt-4">
                <a href="/contact" className="hover:text-accent transition-colors">
                  Contact Us →
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>© 2026 Yemeni Journal of Plastic, Reconstructive & Burn Surgery. All rights reserved.</p>
        </div>
      </div>
    </footer>;
});

Footer.displayName = "Footer";
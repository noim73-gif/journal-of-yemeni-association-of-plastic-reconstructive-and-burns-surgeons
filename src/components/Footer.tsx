import { forwardRef } from "react";
import { Link } from "react-router-dom";
import journalLogo from "@/assets/journal-logo.png";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = forwardRef<HTMLElement>((_, ref) => {
  return <footer ref={ref} id="about" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={journalLogo} alt="YJPRBS Logo" className="h-12 w-auto rounded bg-white/90 p-1" />
              <span className="font-serif font-semibold">YJPRBS</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">The official journal of the Yemeni Association of Plastic, Reconstructive and Burn Surgeons, advancing the science and art of plastic surgery since 2011.</p>
            <p className="text-primary-foreground/80 text-xs font-medium mb-4 tracking-wide">eISSN: 3009-6316</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/articles?issue=current" className="hover:text-accent transition-colors">Current Issue</Link></li>
              <li><Link to="/archive" className="hover:text-accent transition-colors">Archive</Link></li>
              <li><Link to="/editorial-board" className="hover:text-accent transition-colors">Editorial Board</Link></li>
            </ul>
          </div>

          {/* For Authors */}
          <div>
            <h4 className="font-semibold mb-4">For Authors</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><Link to="/submit" className="hover:text-accent transition-colors">Submit Manuscript</Link></li>
              <li><Link to="/author-guidelines" className="hover:text-accent transition-colors">Author Guidelines</Link></li>
              <li><Link to="/peer-review" className="hover:text-accent transition-colors">Peer Review Process</Link></li>
              <li><Link to="/publication-ethics" className="hover:text-accent transition-colors">Publication Ethics</Link></li>
              <li><Link to="/open-access" className="hover:text-accent transition-colors">Open Access Policy</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">FAQ for Authors</Link></li>
              <li><Link to="/become-reviewer" className="hover:text-accent transition-colors">Become a Reviewer</Link></li>
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
                <Link to="/contact" className="hover:text-accent transition-colors">
                  Contact Us →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Yemeni Journal of Plastic, Reconstructive & Burn Surgery. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-accent transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-accent transition-colors">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>;
});

Footer.displayName = "Footer";

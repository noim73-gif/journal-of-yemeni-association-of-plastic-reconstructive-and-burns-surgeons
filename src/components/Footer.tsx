import { Mail, Phone, MapPin, Twitter, Linkedin, Youtube } from "lucide-react";
export function Footer() {
  return <footer id="about" className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="font-serif font-bold text-lg">J</span>
              </div>
              <span className="font-serif font-semibold">YJPRS</span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">The official journal of the Yemeni Association of Plastic, Reconstructive and Burn Surgeons, advancing the science and art of plastic surgery since 2011.
 https://www.yafprs.org/</p>
            <div className="flex gap-4">
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li><a href="#" className="hover:text-accent transition-colors">Current Issue</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Archive</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Most Cited</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">CME Activities</a></li>
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
                <span>Yemeni - Sana"a</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/60">
          <p>© 2026 Journal of Plastic, Reconstructive & Burn Surgery. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-accent transition-colors">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>;
}
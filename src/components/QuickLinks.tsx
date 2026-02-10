import { forwardRef } from "react";
import { FileText, Send, BookOpen, Users } from "lucide-react";

const links = [
  {
    icon: Send,
    title: "Submit Manuscript",
    description: "Share your research with the global plastic surgery community",
    href: "#",
  },
  {
    icon: FileText,
    title: "Author Guidelines",
    description: "Formatting requirements and submission process",
    href: "#",
  },
  {
    icon: BookOpen,
    title: "Peer Review",
    description: "Join our panel of expert reviewers",
    href: "#",
  },
  {
    icon: Users,
    title: "Editorial Board",
    description: "Meet our distinguished editors and advisors",
    href: "#",
  },
];

export const QuickLinks = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="authors" className="py-16 md:py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-2">
            For Authors & Reviewers
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Resources to help you contribute to advancing plastic surgery research
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="group bg-card p-6 rounded-xl shadow-soft hover:shadow-elegant transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <link.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                {link.title}
              </h3>
              <p className="text-sm text-muted-foreground">{link.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
});

QuickLinks.displayName = "QuickLinks";

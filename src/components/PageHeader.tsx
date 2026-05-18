import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  icon?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, description, breadcrumbs, icon, actions }: PageHeaderProps) {
  return (
    <section className="bg-gradient-to-b from-primary/10 via-primary/5 to-background border-b border-border">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
                  <Home className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              {breadcrumbs.map((item, i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" aria-hidden />
                  {item.href && i < breadcrumbs.length - 1 ? (
                    <Link to={item.href} className="hover:text-primary transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium" aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}>
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-2">
              {icon && <span className="text-primary">{icon}</span>}
              <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {title}
              </h1>
            </div>
            {description && (
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {actions && <div className="flex-shrink-0">{actions}</div>}
        </div>
      </div>
    </section>
  );
}
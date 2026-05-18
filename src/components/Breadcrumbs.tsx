import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
}

/**
 * Compact breadcrumb strip designed to sit directly under <Header />
 * on interior pages. Does not introduce its own background so it
 * layers cleanly above existing page heroes.
 */
export function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={`border-b border-border/60 bg-background/50 ${className}`}
    >
      <div className="container mx-auto px-4 py-2.5">
        <ol className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-foreground">
          <li>
            <Link to="/" className="inline-flex items-center gap-1 hover:text-primary transition-colors">
              <Home className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only">Home</span>
            </Link>
          </li>
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={i} className="flex items-center gap-1.5">
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden />
                {item.href && !isLast ? (
                  <Link to={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span
                    className="text-foreground font-medium truncate max-w-[40ch]"
                    aria-current={isLast ? "page" : undefined}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
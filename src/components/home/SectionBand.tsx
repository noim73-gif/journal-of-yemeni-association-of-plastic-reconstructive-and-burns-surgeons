import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionBandProps {
  id?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  action?: ReactNode;
  alt?: boolean;
  className?: string;
  children: ReactNode;
}

export function SectionBand({
  id,
  eyebrow,
  title,
  description,
  action,
  alt = false,
  className,
  children,
}: SectionBandProps) {
  return (
    <section
      id={id}
      className={cn(
        "py-12 md:py-20",
        alt ? "bg-secondary/40" : "bg-background",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {(eyebrow || title || description || action) && (
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              {eyebrow && (
                <div className="text-eyebrow mb-2">{eyebrow}</div>
              )}
              {title && (
                <h2 className="text-h2 text-foreground mb-2">{title}</h2>
              )}
              {description && (
                <p className="text-body-sm max-w-2xl">{description}</p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
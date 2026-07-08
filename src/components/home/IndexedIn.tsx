const INDEXES = [
  { name: "Crossref", url: "https://www.crossref.org/" },
  { name: "DOAJ", url: "https://doaj.org/" },
  { name: "Google Scholar", url: "https://scholar.google.com/" },
  { name: "ROAD", url: "https://road.issn.org/" },
  { name: "WorldCat", url: "https://www.worldcat.org/" },
  { name: "ORCID", url: "https://orcid.org/" },
];

export function IndexedIn() {
  return (
    <section className="py-14 md:py-16 border-y border-border bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <div className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-2">
            Indexed & Registered With
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground">
            Discoverable across the scholarly web
          </h2>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6 md:gap-8 items-center max-w-4xl mx-auto">
          {INDEXES.map((idx) => (
            <a
              key={idx.name}
              href={idx.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center px-4 py-3 rounded-lg border border-border/60 bg-card hover:border-accent/60 hover:shadow-soft transition-all duration-200"
              title={idx.name}
            >
              <span className="font-serif text-sm md:text-base font-semibold text-muted-foreground group-hover:text-primary transition-colors text-center leading-tight">
                {idx.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
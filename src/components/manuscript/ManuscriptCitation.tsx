import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Copy, Download, ExternalLink, Fingerprint, Link2, Quote } from "lucide-react";
import { toast } from "sonner";
import {
  MANUSCRIPT_CITATION_FORMATS,
  manuscriptDoiUrl,
  manuscriptPermalink,
  type CitableManuscript,
} from "@/lib/manuscriptCitation";

interface Props {
  manuscript: CitableManuscript;
  /** Compact variant is used inside dashboard submission cards. */
  compact?: boolean;
}

/**
 * Shows the permanent DOI and persistent URL issued to a manuscript at
 * submission time, plus ready-to-paste citations in four styles so the work
 * can be cited before it is published in an issue.
 */
export function ManuscriptCitation({ manuscript, compact = false }: Props) {
  const [format, setFormat] = useState<string | null>(null);
  const [citation, setCitation] = useState("");

  if (!manuscript.submission_doi || !manuscript.permalink_slug) return null;

  const permalink = manuscriptPermalink(manuscript.permalink_slug);

  const copy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied to clipboard`);
  };

  const download = () => {
    const ext = format === "BibTeX" ? "bib" : "txt";
    const blob = new Blob([citation], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${manuscript.permalink_slug}-citation.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className={compact ? "mt-3 rounded-md border border-border bg-muted/40 p-3 space-y-2" : "space-y-3"}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <span className="inline-flex items-center gap-1.5 text-meta">
          <Fingerprint className="h-3.5 w-3.5 text-primary" />
          <a
            href={manuscriptDoiUrl(manuscript.submission_doi)}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono hover:text-primary hover:underline"
          >
            {manuscript.submission_doi}
          </a>
          <button
            type="button"
            onClick={() => copy(manuscript.submission_doi!, "DOI")}
            className="text-muted-foreground hover:text-primary"
            aria-label="Copy DOI"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </span>
        <span className="inline-flex items-center gap-1.5 text-meta">
          <Link2 className="h-3.5 w-3.5 text-primary" />
          <a href={`/ms/${manuscript.permalink_slug}`} className="font-mono hover:text-primary hover:underline">
            /ms/{manuscript.permalink_slug}
          </a>
          <button
            type="button"
            onClick={() => copy(permalink, "Permanent link")}
            className="text-muted-foreground hover:text-primary"
            aria-label="Copy permanent link"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
        </span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Quote className="mr-2 h-4 w-4" />
            Cite this manuscript
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {MANUSCRIPT_CITATION_FORMATS.map((f) => (
            <DropdownMenuItem
              key={f.label}
              onClick={() => {
                setCitation(f.generate(manuscript));
                setFormat(f.label);
              }}
            >
              {f.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {format && citation && (
        <div className="rounded-lg border border-border bg-muted/50 p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-overline">{format} format</span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => copy(citation, "Citation")}>
                <Copy className="mr-1 h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={download}>
                <Download className="mr-1 h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          </div>
          <p className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed text-foreground">
            {citation}
          </p>
        </div>
      )}

      {!compact && (
        <a
          href={permalink}
          className="inline-flex items-center gap-1 text-caption hover:text-primary"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {permalink}
        </a>
      )}
    </div>
  );
}

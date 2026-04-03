import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Quote, Copy, Download } from "lucide-react";
import { toast } from "sonner";

interface CitationArticle {
  title: string;
  authors: string | null;
  published_at: string | null;
  volume: string | null;
  issue: string | null;
  doi: string | null;
  abstract: string | null;
}

const JOURNAL_NAME = "Yemeni Journal of Plastic, Reconstructive and Burn Surgery";

function parseAuthors(authors: string | null): string[] {
  if (!authors) return ["Unknown"];
  return authors.split(",").map((a) => a.trim()).filter(Boolean);
}

function getYear(published_at: string | null): string {
  if (!published_at) return "n.d.";
  return new Date(published_at).getFullYear().toString();
}

function formatAuthorAPA(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map((p) => p[0].toUpperCase() + ".").join(" ");
  return `${lastName}, ${initials}`;
}

function formatAuthorVancouver(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map((p) => p[0].toUpperCase()).join("");
  return `${lastName} ${initials}`;
}

function generateAPA(article: CitationArticle): string {
  const authors = parseAuthors(article.authors);
  const year = getYear(article.published_at);
  const authorStr = authors.length > 7
    ? authors.slice(0, 6).map(formatAuthorAPA).join(", ") + ", ... " + formatAuthorAPA(authors[authors.length - 1])
    : authors.map(formatAuthorAPA).join(", ");
  
  let citation = `${authorStr} (${year}). ${article.title}. *${JOURNAL_NAME}*`;
  if (article.volume) citation += `, *${article.volume}*`;
  if (article.issue) citation += `(${article.issue})`;
  citation += ".";
  if (article.doi) citation += ` https://doi.org/${article.doi}`;
  return citation;
}

function generateVancouver(article: CitationArticle): string {
  const authors = parseAuthors(article.authors);
  const authorStr = authors.length > 6
    ? authors.slice(0, 6).map(formatAuthorVancouver).join(", ") + ", et al"
    : authors.map(formatAuthorVancouver).join(", ");
  
  let citation = `${authorStr}. ${article.title}. ${JOURNAL_NAME}.`;
  if (article.published_at) citation += ` ${getYear(article.published_at)}`;
  if (article.volume) citation += `;${article.volume}`;
  if (article.issue) citation += `(${article.issue})`;
  citation += ".";
  if (article.doi) citation += ` doi:${article.doi}`;
  return citation;
}

function generateHarvard(article: CitationArticle): string {
  const authors = parseAuthors(article.authors);
  const year = getYear(article.published_at);
  const authorStr = authors.length > 3
    ? formatAuthorAPA(authors[0]) + " et al."
    : authors.map(formatAuthorAPA).join(", ");
  
  let citation = `${authorStr} (${year}) '${article.title}', *${JOURNAL_NAME}*`;
  if (article.volume) citation += `, ${article.volume}`;
  if (article.issue) citation += `(${article.issue})`;
  citation += ".";
  if (article.doi) citation += ` doi: ${article.doi}.`;
  return citation;
}

function generateBibTeX(article: CitationArticle): string {
  const authors = parseAuthors(article.authors);
  const year = getYear(article.published_at);
  const key = (authors[0]?.split(/\s+/).pop()?.toLowerCase() || "unknown") + year;
  
  let bib = `@article{${key},\n`;
  bib += `  title     = {${article.title}},\n`;
  bib += `  author    = {${authors.join(" and ")}},\n`;
  bib += `  journal   = {${JOURNAL_NAME}},\n`;
  bib += `  year      = {${year}},\n`;
  if (article.volume) bib += `  volume    = {${article.volume}},\n`;
  if (article.issue) bib += `  number    = {${article.issue}},\n`;
  if (article.doi) bib += `  doi       = {${article.doi}},\n`;
  bib += `}`;
  return bib;
}

const formats = [
  { label: "APA", generate: generateAPA },
  { label: "Vancouver", generate: generateVancouver },
  { label: "Harvard", generate: generateHarvard },
  { label: "BibTeX", generate: generateBibTeX },
] as const;

export function CitationExport({ article }: { article: CitationArticle }) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [citation, setCitation] = useState<string>("");

  const handleSelect = (fmt: typeof formats[number]) => {
    const text = fmt.generate(article);
    setCitation(text);
    setSelectedFormat(fmt.label);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(citation);
    toast.success("Citation copied to clipboard");
  };

  const handleDownload = () => {
    const ext = selectedFormat === "BibTeX" ? "bib" : "txt";
    const blob = new Blob([citation], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `citation.${ext}`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Quote className="h-4 w-4 mr-2" />
            Cite this Article
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {formats.map((fmt) => (
            <DropdownMenuItem key={fmt.label} onClick={() => handleSelect(fmt)}>
              {fmt.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedFormat && citation && (
        <div className="bg-muted/50 border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {selectedFormat} Format
            </span>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-7 px-2">
                <Copy className="h-3.5 w-3.5 mr-1" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDownload} className="h-7 px-2">
                <Download className="h-3.5 w-3.5 mr-1" />
                Download
              </Button>
            </div>
          </div>
          <p className="text-sm text-foreground font-mono whitespace-pre-wrap break-words leading-relaxed">
            {citation}
          </p>
        </div>
      )}
    </div>
  );
}

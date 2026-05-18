import { User } from "lucide-react";

interface ArticleAuthorsProps {
  authors: string;
  variant?: "hero" | "inline";
}

/**
 * Splits a comma- or "and"-separated author string into individual chips.
 * Renders ORCID iD badges when the author entry contains a trailing
 * `[ORCID:xxxx-xxxx-xxxx-xxxx]` token. Used in both the article hero and
 * the body just before the abstract.
 */
export function ArticleAuthors({ authors, variant = "inline" }: ArticleAuthorsProps) {
  const list = authors
    .split(/,| and /i)
    .map((a) => a.trim())
    .filter(Boolean);

  const parse = (raw: string) => {
    const orcidMatch = raw.match(/\[ORCID:\s*([0-9-]{19})\s*\]/i);
    const name = raw.replace(/\[ORCID:[^\]]+\]/i, "").trim();
    return { name, orcid: orcidMatch?.[1] };
  };

  const isHero = variant === "hero";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <User className={`h-4 w-4 ${isHero ? "opacity-80" : "text-muted-foreground"}`} />
      <ul className="flex flex-wrap gap-x-2 gap-y-1">
        {list.map((raw, i) => {
          const { name, orcid } = parse(raw);
          return (
            <li
              key={i}
              className={
                isHero
                  ? "text-sm font-medium"
                  : "text-sm text-foreground inline-flex items-center gap-1"
              }
            >
              <span>{name}</span>
              {orcid && (
                <a
                  href={`https://orcid.org/${orcid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`ORCID: ${orcid}`}
                  className="inline-flex items-center justify-center h-4 w-4 rounded-sm bg-[#A6CE39] text-white text-[9px] font-bold leading-none hover:opacity-80"
                  aria-label={`ORCID iD ${orcid}`}
                >
                  iD
                </a>
              )}
              {i < list.length - 1 && <span className="opacity-50">·</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
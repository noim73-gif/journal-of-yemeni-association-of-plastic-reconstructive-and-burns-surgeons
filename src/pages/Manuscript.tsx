import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EditorialStatusBadge } from "@/components/EditorialStatusBadge";
import { ManuscriptCitation } from "@/components/manuscript/ManuscriptCitation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/EmptyState";
import { FileSearch, Loader2 } from "lucide-react";
import { logger } from "@/lib/logger";
import { citationStateLabel, manuscriptPermalink } from "@/lib/manuscriptCitation";

interface ManuscriptRecord {
  permalink_slug: string;
  submission_doi: string;
  title: string;
  authors: string | null;
  abstract: string | null;
  keywords: string | null;
  category: string | null;
  status: string;
  workflow_stage: string | null;
  manuscript_language: string | null;
  article_type: string | null;
  submitted_at: string | null;
  doi_assigned_at: string | null;
  published_article_id: string | null;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Persistent, publicly citable record for a manuscript that has been submitted
 * but not yet published. Exposes only citation-level metadata (title, authors,
 * abstract, type, stage, DOI) via a security-definer lookup.
 */
export default function Manuscript() {
  const { slug } = useParams<{ slug: string }>();
  const [record, setRecord] = useState<ManuscriptRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc("get_public_manuscript_record", { p_slug: slug ?? "" });
      if (!active) return;
      if (error) logger.error("Error loading manuscript record:", error);
      setRecord((data as ManuscriptRecord[] | null)?.[0] ?? null);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [slug]);

  useEffect(() => {
    if (!record) return;
    document.title = `${record.title} | YJPRBS manuscript record`;
    const desc = (record.abstract || record.title).replace(/<[^>]*>/g, "").slice(0, 155);
    setMeta("name", "description", desc);
    setMeta("name", "citation_title", record.title);
    setMeta("name", "citation_journal_title", "Yemeni Journal of Plastic, Reconstructive and Burn Surgery");
    setMeta("name", "citation_doi", record.submission_doi);
    setMeta("name", "citation_public_url", manuscriptPermalink(record.permalink_slug));
    if (record.submitted_at) setMeta("name", "citation_online_date", record.submitted_at.slice(0, 10));
    setMeta("property", "og:title", record.title);
    setMeta("property", "og:description", desc);
    setMeta("property", "og:type", "article");

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = manuscriptPermalink(record.permalink_slug);
  }, [record]);

  const keywords = record?.keywords
    ? record.keywords.split(/[,;]/).map((k) => k.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs items={[{ label: "Manuscript record" }]} />

          {loading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !record ? (
            <EmptyState
              icon={FileSearch}
              title="Manuscript record not found"
              description="This identifier does not match any citable manuscript, or its record is not public."
              action={
                <Button asChild>
                  <Link to="/articles">Browse published articles</Link>
                </Button>
              }
            />
          ) : (
            <article className="space-y-6">
              <header className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">{record.article_type || record.category || "Manuscript"}</Badge>
                  <EditorialStatusBadge status={record.status} />
                  <span className="text-caption">{citationStateLabel(record.status)}</span>
                </div>
                <h1 className="text-h1">{record.title}</h1>
                {record.authors && <p className="text-lead">{record.authors}</p>}
                <p className="text-caption">
                  {record.submitted_at
                    ? `Submitted ${new Date(record.submitted_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}`
                    : "Submission date not recorded"}
                  {record.doi_assigned_at &&
                    ` · DOI issued ${new Date(record.doi_assigned_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}`}
                  {record.manuscript_language && ` · ${record.manuscript_language.toUpperCase()}`}
                </p>
              </header>

              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-overline mb-3">Persistent identifiers</p>
                <ManuscriptCitation manuscript={record} />
              </div>

              {record.published_article_id && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <p className="text-body-sm mb-2">
                    This manuscript has since been published in an issue. Cite the final version of record.
                  </p>
                  <Button asChild size="sm">
                    <Link to={`/article/${record.published_article_id}`}>View published article</Link>
                  </Button>
                </div>
              )}

              {record.abstract && (
                <section>
                  <h2 className="text-h4 mb-2">Abstract</h2>
                  <p className="text-body whitespace-pre-line">{record.abstract.replace(/<[^>]*>/g, "")}</p>
                </section>
              )}

              {keywords.length > 0 && (
                <section>
                  <h2 className="text-h5 mb-2">Keywords</h2>
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((k) => (
                      <Badge key={k} variant="outline">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              <p className="text-caption border-t border-border pt-4">
                This record is a permanent citation stub. Full text, files and peer review materials remain
                confidential until the manuscript is published.
              </p>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
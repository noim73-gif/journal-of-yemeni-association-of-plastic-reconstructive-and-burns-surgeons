import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { buildJats } from "./jats.ts";
import { buildPageOneHtml, buildPrintHtml } from "./html.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FORMATS = ["bundle", "jats", "pdf", "page1"] as const;
type Format = typeof FORMATS[number];

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get("article_id")?.trim() ?? "";
    const format = (url.searchParams.get("format") ?? "bundle").toLowerCase() as Format;

    if (!UUID_RE.test(articleId)) {
      return json({ error: "A valid article_id (uuid) is required" }, 400);
    }
    if (!FORMATS.includes(format)) {
      return json({ error: `format must be one of: ${FORMATS.join(", ")}` }, 400);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: article } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .maybeSingle();

    if (!article) return json({ error: "Article not found" }, 404);

    // Only published manuscripts are publishable packages.
    if (!article.published_at || new Date(article.published_at) > new Date()) {
      return json({ error: "Article is not published" }, 403);
    }

    let issue = null;
    if (article.journal_issue_id) {
      const { data } = await supabase
        .from("journal_issues")
        .select("*")
        .eq("id", article.journal_issue_id)
        .maybeSingle();
      issue = data;
    }

    const slug = (article.doi ? String(article.doi).replace(/[^\w.-]+/g, "-") : articleId).slice(0, 80);

    if (format === "jats") {
      return new Response(buildJats(article, issue), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/xml; charset=utf-8",
          "Content-Disposition": `attachment; filename="${slug}.jats.xml"`,
        },
      });
    }

    if (format === "pdf") {
      // Print-ready typeset HTML; the browser's print pipeline renders the PDF.
      return new Response(buildPrintHtml(article, issue, url.searchParams.get("autoprint") === "1"), {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="${slug}.html"`,
        },
      });
    }

    if (format === "page1") {
      return new Response(buildPageOneHtml(article, issue), {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/html; charset=utf-8",
          "Content-Disposition": `inline; filename="${slug}.page1.html"`,
        },
      });
    }

    const base = `${url.origin}${url.pathname}?article_id=${articleId}`;
    return json({
      article: {
        id: article.id,
        title: article.title,
        doi: article.doi,
        volume: issue?.volume ?? article.volume,
        issue: issue?.number ?? article.issue,
        pages: article.pages,
        published_at: article.published_at,
      },
      urls: {
        jats: `${base}&format=jats`,
        pdf: `${base}&format=pdf&autoprint=1`,
        page1: `${base}&format=page1`,
      },
      jats_xml: buildJats(article, issue),
      page1_html: buildPageOneHtml(article, issue),
      pdf_html: buildPrintHtml(article, issue),
    });
  } catch (_err) {
    return json({ error: "Internal server error" }, 500);
  }
});
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function escapeXml(text: string | null): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(html: string | null): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

function parseAuthors(authorsStr: string | null): Array<{ given: string; surname: string }> {
  if (!authorsStr) return [];
  return authorsStr.split(",").map((name) => {
    const parts = name.trim().split(/\s+/);
    const surname = parts.pop() || "";
    const given = parts.join(" ") || "";
    return { given, surname };
  });
}

function buildJatsXml(article: Record<string, unknown>, issue: Record<string, unknown> | null): string {
  const authors = parseAuthors(article.authors as string);
  const pubDate = article.published_at ? new Date(article.published_at as string) : new Date();
  const keywords = (article.keywords as string[] | null) || [];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE article PUBLIC "-//NLM//DTD JATS (Z39.96) Journal Archiving and Interchange DTD v1.2 20190208//EN" "JATS-archivearticle1-mathml3.dtd">
<article xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:mml="http://www.w3.org/1998/Math/MathML" article-type="research-article" dtd-version="1.2" xml:lang="en">
<front>
<journal-meta>
<journal-id journal-id-type="publisher-id">JYAPS</journal-id>
<journal-title-group>
<journal-title>Journal of Yemeni Association of Plastic Surgeons</journal-title>
<abbrev-journal-title abbrev-type="pubmed">J Yemen Assoc Plast Surg</abbrev-journal-title>
</journal-title-group>
<issn pub-type="epub">XXXX-XXXX</issn>
<publisher>
<publisher-name>Yemeni Association of Plastic Surgeons</publisher-name>
</publisher>
</journal-meta>
<article-meta>`;

  if (article.doi) {
    xml += `
<article-id pub-id-type="doi">${escapeXml(article.doi as string)}</article-id>`;
  }
  xml += `
<article-id pub-id-type="publisher-id">${escapeXml(article.id as string)}</article-id>`;

  if (article.category) {
    xml += `
<article-categories>
<subj-group subj-group-type="heading">
<subject>${escapeXml(article.category as string)}</subject>
</subj-group>
</article-categories>`;
  }

  xml += `
<title-group>
<article-title>${escapeXml(article.title as string)}</article-title>
</title-group>`;

  if (authors.length > 0) {
    xml += `
<contrib-group>`;
    authors.forEach((a, i) => {
      xml += `
<contrib contrib-type="author"${i === 0 ? ' corresp="yes"' : ''}>
<name>
<surname>${escapeXml(a.surname)}</surname>
<given-names>${escapeXml(a.given)}</given-names>
</name>
</contrib>`;
    });
    xml += `
</contrib-group>`;
  }

  xml += `
<pub-date pub-type="epub">
<day>${String(pubDate.getDate()).padStart(2, "0")}</day>
<month>${String(pubDate.getMonth() + 1).padStart(2, "0")}</month>
<year>${pubDate.getFullYear()}</year>
</pub-date>`;

  if (issue) {
    xml += `
<volume>${escapeXml(String(issue.volume))}</volume>
<issue>${escapeXml(String(issue.number))}</issue>`;
  } else if (article.volume) {
    xml += `
<volume>${escapeXml(article.volume as string)}</volume>`;
    if (article.issue) {
      xml += `
<issue>${escapeXml(article.issue as string)}</issue>`;
    }
  }

  if (article.pages) {
    xml += `
<fpage>${escapeXml(article.pages as string)}</fpage>`;
  }

  if (keywords.length > 0) {
    xml += `
<kwd-group>`;
    keywords.forEach((kw) => {
      xml += `
<kwd>${escapeXml(kw)}</kwd>`;
    });
    xml += `
</kwd-group>`;
  }

  if (article.abstract) {
    xml += `
<abstract>
<p>${escapeXml(stripHtml(article.abstract as string))}</p>
</abstract>`;
  }

  xml += `
</article-meta>
</front>
<body>`;

  const sections = [
    { tag: "sec", id: "introduction", title: "Introduction", content: article.introduction },
    { tag: "sec", id: "methods", title: "Methods", content: article.methods },
    { tag: "sec", id: "results", title: "Results", content: article.results },
    { tag: "sec", id: "discussion", title: "Discussion", content: article.discussion },
  ];

  for (const s of sections) {
    if (s.content) {
      xml += `
<sec id="${s.id}">
<title>${s.title}</title>
<p>${escapeXml(stripHtml(s.content as string))}</p>
</sec>`;
    }
  }

  if (!sections.some((s) => s.content) && article.content) {
    xml += `
<sec>
<p>${escapeXml(stripHtml(article.content as string))}</p>
</sec>`;
  }

  xml += `
</body>`;

  if (article.references) {
    xml += `
<back>
<ref-list>
<title>References</title>`;
    const refs = stripHtml(article.references as string)
      .split("\n")
      .filter((r) => r.trim());
    refs.forEach((ref, i) => {
      xml += `
<ref id="ref${i + 1}">
<mixed-citation>${escapeXml(ref.trim())}</mixed-citation>
</ref>`;
    });
    xml += `
</ref-list>
</back>`;
  }

  xml += `
</article>`;

  return xml;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get("article_id");

    if (!articleId) {
      return new Response(JSON.stringify({ error: "article_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (error || !article) {
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let issue = null;
    if (article.journal_issue_id) {
      const { data } = await supabase
        .from("journal_issues")
        .select("*")
        .eq("id", article.journal_issue_id)
        .single();
      issue = data;
    }

    const xml = buildJatsXml(article, issue);

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": `attachment; filename="article-${articleId}.xml"`,
      },
    });
  } catch (err) {
    console.error("JATS XML export error");
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);

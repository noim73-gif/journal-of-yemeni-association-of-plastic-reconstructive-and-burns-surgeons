import { corsHeaders } from "https://deno.land/x/edge_cors@0.1.0/src/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHead = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHead });
  }

  try {
    const url = new URL(req.url);
    const articleId = url.searchParams.get("article_id");
    if (!articleId) {
      return new Response(JSON.stringify({ error: "article_id required" }), {
        status: 400,
        headers: { ...corsHead, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: article, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", articleId)
      .single();

    if (error || !article) {
      return new Response(JSON.stringify({ error: "Article not found" }), {
        status: 404,
        headers: { ...corsHead, "Content-Type": "application/json" },
      });
    }

    // Build HTML for PDF-like rendering
    const sections: string[] = [];

    // Header
    sections.push(`
      <div style="text-align:center;margin-bottom:30px;border-bottom:2px solid #1a365d;padding-bottom:20px;">
        <p style="font-size:12px;color:#666;margin:0;">Yemeni Journal of Plastic, Reconstructive and Burn Surgery</p>
        <p style="font-size:11px;color:#888;margin:4px 0;">eISSN: 3009-6316</p>
        ${article.volume ? `<p style="font-size:11px;color:#888;margin:2px 0;">Vol. ${article.volume}${article.issue ? `, Issue ${article.issue}` : ""}</p>` : ""}
        ${article.doi ? `<p style="font-size:11px;color:#888;margin:2px 0;">DOI: ${article.doi}</p>` : ""}
      </div>
    `);

    // Title
    sections.push(`<h1 style="font-family:Georgia,serif;font-size:22px;color:#1a365d;margin-bottom:10px;">${escapeHtml(article.title)}</h1>`);

    // Authors
    if (article.authors) {
      sections.push(`<p style="font-size:13px;color:#444;margin-bottom:5px;"><strong>Authors:</strong> ${escapeHtml(article.authors)}</p>`);
    }

    // Keywords
    if (article.keywords && article.keywords.length > 0) {
      sections.push(`<p style="font-size:12px;color:#555;margin-bottom:15px;"><strong>Keywords:</strong> ${article.keywords.map((k: string) => escapeHtml(k)).join(", ")}</p>`);
    }

    // Published date
    if (article.published_at) {
      const d = new Date(article.published_at);
      sections.push(`<p style="font-size:11px;color:#888;margin-bottom:20px;">Published: ${d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>`);
    }

    sections.push(`<hr style="border:1px solid #ddd;margin:20px 0;">`);

    // Content sections
    const addSection = (num: string, title: string, content: string | null) => {
      if (!content) return;
      const plain = stripHtml(content);
      if (!plain.trim()) return;
      sections.push(`
        <h2 style="font-family:Georgia,serif;font-size:16px;color:#1a365d;margin:20px 0 8px 0;border-bottom:1px solid #eee;padding-bottom:4px;">${num} ${title}</h2>
        <div style="font-size:13px;line-height:1.8;color:#333;text-align:justify;">${content}</div>
      `);
    };

    if (article.abstract) {
      sections.push(`
        <div style="background:#f7f7f7;padding:15px;border-left:3px solid #1a365d;margin:15px 0;">
          <h2 style="font-family:Georgia,serif;font-size:15px;color:#1a365d;margin:0 0 8px 0;">Abstract</h2>
          <p style="font-size:13px;line-height:1.7;color:#444;margin:0;">${escapeHtml(article.abstract)}</p>
        </div>
      `);
    }

    addSection("1.", "Introduction", article.introduction);
    addSection("2.", "Methods", article.methods);
    addSection("3.", "Results", article.results);
    addSection("4.", "Discussion", article.discussion);
    addSection("5.", "References", article.references);

    // Fallback for unstructured content
    if (!article.introduction && !article.methods && !article.results && !article.discussion && article.content) {
      sections.push(`<div style="font-size:13px;line-height:1.8;color:#333;">${article.content}</div>`);
    }

    // Footer
    sections.push(`
      <hr style="border:1px solid #ddd;margin:30px 0 10px 0;">
      <p style="font-size:10px;color:#999;text-align:center;">
        © ${new Date().getFullYear()} YJPRBS — Yemeni Journal of Plastic, Reconstructive and Burn Surgery | eISSN: 3009-6316
      </p>
    `);

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    @page { margin: 25mm 20mm; }
    body { font-family: 'Times New Roman', Georgia, serif; max-width: 700px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>${sections.join("\n")}</body>
</html>`;

    // Return HTML that the client can print-to-PDF
    return new Response(fullHtml, {
      headers: {
        ...corsHead,
        "Content-Type": "text/html; charset=utf-8",
        "Content-Disposition": `inline; filename="article-${articleId}.html"`,
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHead, "Content-Type": "application/json" },
    });
  }
});

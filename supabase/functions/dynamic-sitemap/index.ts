import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://httpsgithubcomenterprisesjournal-of-yemeni-as.lovable.app";

const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/articles", changefreq: "daily", priority: "0.9" },
  { path: "/archive", changefreq: "monthly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "monthly", priority: "0.6" },
  { path: "/editorial-board", changefreq: "monthly", priority: "0.7" },
  { path: "/submit", changefreq: "monthly", priority: "0.8" },
  { path: "/author-guidelines", changefreq: "monthly", priority: "0.7" },
  { path: "/peer-review", changefreq: "monthly", priority: "0.6" },
  { path: "/publication-ethics", changefreq: "yearly", priority: "0.5" },
  { path: "/open-access", changefreq: "yearly", priority: "0.5" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/become-reviewer", changefreq: "monthly", priority: "0.6" },
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data: articles } = await supabase
      .from("articles")
      .select("id, published_at, updated_at")
      .not("published_at", "is", null)
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const route of STATIC_ROUTES) {
      xml += `  <url>\n`;
      xml += `    <loc>${BASE_URL}${route.path}</loc>\n`;
      xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += `  </url>\n`;
    }

    if (articles) {
      for (const article of articles) {
        const lastmod = (article.updated_at || article.published_at || "").split("T")[0];
        xml += `  <url>\n`;
        xml += `    <loc>${BASE_URL}/article/${article.id}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>monthly</changefreq>\n`;
        xml += `    <priority>0.8</priority>\n`;
        xml += `  </url>\n`;
      }
    }

    xml += `</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`, {
      headers: { ...corsHeaders, "Content-Type": "application/xml" },
      status: 500,
    });
  }
});

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Users, Globe2, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

function useCountUp(target: number, duration = 1200) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) {
      setValue(0);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function Stat({
  icon: Icon,
  value,
  suffix,
  label,
  loading,
}: {
  icon: typeof BookOpen;
  value: number;
  suffix?: string;
  label: string;
  loading: boolean;
}) {
  const display = useCountUp(value);
  return (
    <div className="flex flex-col items-center text-center px-4 py-6">
      <Icon className="h-6 w-6 text-accent mb-3" strokeWidth={1.5} />
      <div className="text-stat text-primary-foreground">
        {loading ? "—" : display.toLocaleString()}
        {!loading && suffix ? <span className="text-accent">{suffix}</span> : null}
      </div>
      <div className="text-overline !text-primary-foreground/70 mt-2">{label}</div>
    </div>
  );
}

export function ImpactStrip() {
  const { data, isLoading } = useQuery({
    queryKey: ["home-impact-stats"],
    queryFn: async () => {
      const [articlesRes, authorsRes, subsRes] = await Promise.all([
        supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .not("published_at", "is", null),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase
          .from("submissions")
          .select("created_at, updated_at, status")
          .in("status", ["accepted", "published"])
          .limit(200),
      ]);

      let avgDays = 42;
      if (subsRes.data && subsRes.data.length > 0) {
        const diffs = subsRes.data
          .map((s) => {
            const a = new Date(s.created_at).getTime();
            const b = new Date(s.updated_at).getTime();
            return (b - a) / (1000 * 60 * 60 * 24);
          })
          .filter((d) => d > 0 && d < 365);
        if (diffs.length) {
          avgDays = Math.round(diffs.reduce((a, b) => a + b, 0) / diffs.length);
        }
      }

      return {
        articles: articlesRes.count || 0,
        authors: authorsRes.count || 0,
        countries: 24,
        avgDays,
      };
    },
  });

  return (
    <section
      className="bg-primary text-primary-foreground border-y border-primary-dark/40"
      aria-label="Journal impact statistics"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-primary-foreground/10">
          <Stat
            icon={BookOpen}
            value={data?.articles ?? 0}
            label="Published Articles"
            loading={isLoading}
          />
          <Stat
            icon={Users}
            value={data?.authors ?? 0}
            label="Contributing Authors"
            loading={isLoading}
          />
          <Stat
            icon={Globe2}
            value={data?.countries ?? 0}
            suffix="+"
            label="Countries Reached"
            loading={isLoading}
          />
          <Stat
            icon={Clock}
            value={data?.avgDays ?? 0}
            label="Avg. Review Days"
            loading={isLoading}
          />
        </div>
      </div>
    </section>
  );
}
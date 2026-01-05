import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Article } from "@/hooks/useArticles";
import { format, parseISO, startOfMonth, subMonths } from "date-fns";

interface SubmissionChartProps {
  articles: Article[];
}

const chartConfig = {
  submitted: {
    label: "Submitted",
    color: "hsl(215, 50%, 23%)",
  },
  published: {
    label: "Published",
    color: "hsl(142, 76%, 36%)",
  },
  drafts: {
    label: "Drafts",
    color: "hsl(45, 93%, 47%)",
  },
} satisfies ChartConfig;

export function SubmissionChart({ articles }: SubmissionChartProps) {
  const chartData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = subMonths(now, 11 - i);
      return {
        month: format(date, "MMM yyyy"),
        monthStart: startOfMonth(date),
        submitted: 0,
        published: 0,
        drafts: 0,
      };
    });

    articles.forEach((article) => {
      const createdDate = parseISO(article.created_at);
      const createdMonth = startOfMonth(createdDate);

      const monthIndex = months.findIndex(
        (m) => m.monthStart.getTime() === createdMonth.getTime()
      );

      if (monthIndex !== -1) {
        months[monthIndex].submitted += 1;
        if (article.published_at) {
          months[monthIndex].published += 1;
        } else {
          months[monthIndex].drafts += 1;
        }
      }
    });

    return months.map(({ month, submitted, published, drafts }) => ({
      month,
      submitted,
      published,
      drafts,
    }));
  }, [articles]);

  return (
    <ChartContainer config={chartConfig} className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            className="text-muted-foreground"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="submitted"
            fill="var(--color-submitted)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="published"
            fill="var(--color-published)"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="drafts"
            fill="var(--color-drafts)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

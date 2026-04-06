import { BookOpen } from "lucide-react";

interface IssueBannerProps {
  volume: string;
  issue: string;
}

export function IssueBanner({ volume, issue }: IssueBannerProps) {
  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 p-3 rounded-full">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground">
            Volume {volume}, Issue {issue}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Yemeni Journal of Plastic, Reconstructive & Burns Surgery
          </p>
        </div>
      </div>
    </div>
  );
}

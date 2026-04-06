import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewModeToggleProps {
  viewMode: "cards" | "compact";
  onChange: (mode: "cards" | "compact") => void;
}

export function ViewModeToggle({ viewMode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
      <Button
        variant={viewMode === "cards" ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5"
        onClick={() => onChange("cards")}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Cards</span>
      </Button>
      <Button
        variant={viewMode === "compact" ? "default" : "ghost"}
        size="sm"
        className="h-8 gap-1.5"
        onClick={() => onChange("compact")}
      >
        <List className="h-4 w-4" />
        <span className="hidden sm:inline">Compact</span>
      </Button>
    </div>
  );
}

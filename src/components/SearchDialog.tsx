import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface SearchResult {
  id: string;
  title: string;
  authors: string | null;
  category: string | null;
}

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Keyboard shortcut
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const searchArticles = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from("articles")
      .select("id, title, authors, category")
      .not("published_at", "is", null)
      .or(`title.ilike.%${q}%,authors.ilike.%${q}%`)
      .limit(10);
    setResults(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => searchArticles(query), 300);
    return () => clearTimeout(timer);
  }, [query, searchArticles]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search articles by title or author..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}
        {!loading && query.length >= 2 && results.length === 0 && (
          <CommandEmpty>No articles found.</CommandEmpty>
        )}
        {!loading && query.length < 2 && (
          <CommandEmpty>Type at least 2 characters to search...</CommandEmpty>
        )}
        {results.length > 0 && (
          <CommandGroup heading="Articles">
            {results.map((article) => (
              <CommandItem
                key={article.id}
                onSelect={() => {
                  navigate(`/article/${article.id}`);
                  onOpenChange(false);
                }}
                className="cursor-pointer"
              >
                <FileText className="mr-2 h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{article.title}</p>
                  {article.authors && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      <User className="h-3 w-3" />
                      {article.authors}
                    </p>
                  )}
                </div>
                {article.category && (
                  <span className="text-xs text-muted-foreground ml-2">{article.category}</span>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}

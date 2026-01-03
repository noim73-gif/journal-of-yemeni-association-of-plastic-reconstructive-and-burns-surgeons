import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useArticleLikes } from "@/hooks/useArticleLikes";
import { cn } from "@/lib/utils";

interface ArticleLikeButtonProps {
  articleId: string;
}

export function ArticleLikeButton({ articleId }: ArticleLikeButtonProps) {
  const { likesCount, isLiked, loading, toggleLike } = useArticleLikes(articleId);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLike}
      disabled={loading}
      className={cn(
        "gap-2",
        isLiked && "text-red-500 hover:text-red-600"
      )}
    >
      <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
      <span>{likesCount}</span>
    </Button>
  );
}

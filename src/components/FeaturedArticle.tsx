import * as React from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface FeaturedArticleProps {
  id?: string;
  category: string;
  title: string;
  authors: string;
  abstract: string;
  imageUrl: string;
  isMain?: boolean;
}

export const FeaturedArticle = React.forwardRef<HTMLElement, FeaturedArticleProps>(
  ({ id, category, title, authors, abstract, imageUrl, isMain = false }, ref) => {
    const articleLink = id ? `/article/${id}` : "#";
    const LinkWrapper = id ? Link : "a";

    if (isMain) {
      return (
        <article 
          ref={ref} 
          className="group relative bg-card rounded-xl overflow-hidden shadow-elegant hover:shadow-elegant-lg transition-all duration-300"
        >
          <div className="grid md:grid-cols-2">
            <div className="aspect-[4/3] md:aspect-auto relative overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <Badge variant="featured" className="w-fit mb-4">{category}</Badge>
              <h3 className="font-serif text-xl md:text-2xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{authors}</p>
              <p className="text-muted-foreground line-clamp-3 mb-4">{abstract}</p>
              <LinkWrapper to={articleLink} href={articleLink} className="inline-flex items-center text-primary font-medium text-sm group/link">
                Read Article
                <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
              </LinkWrapper>
            </div>
          </div>
        </article>
      );
    }

    return (
      <article 
        ref={ref} 
        className="group bg-card rounded-xl overflow-hidden shadow-soft hover:shadow-elegant transition-all duration-300"
      >
        <div className="aspect-[16/10] relative overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-5">
          <Badge variant="secondary" className="mb-3">{category}</Badge>
          <h3 className="font-serif text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">{authors}</p>
          <LinkWrapper to={articleLink} href={articleLink} className="inline-flex items-center text-primary font-medium text-sm group/link">
            Read Article
            <ArrowRight className="ml-1 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
          </LinkWrapper>
        </div>
      </article>
    );
  }
);

FeaturedArticle.displayName = "FeaturedArticle";

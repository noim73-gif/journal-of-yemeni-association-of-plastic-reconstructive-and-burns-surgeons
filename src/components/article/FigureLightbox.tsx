import { useEffect, useState, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FigureLightboxProps {
  /** Ref to the container whose <img> elements should become zoomable. */
  containerRef: React.RefObject<HTMLElement>;
}

/**
 * Attaches click handlers to every <img> within `containerRef` so users
 * can open a full-resolution overlay with caption + download. Looks for
 * a sibling figcaption or the image alt text as the caption source.
 */
export function FigureLightbox({ containerRef }: FigureLightboxProps) {
  const [open, setOpen] = useState(false);
  const [src, setSrc] = useState("");
  const [caption, setCaption] = useState("");
  const lastTrigger = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const imgs = Array.from(root.querySelectorAll("img")) as HTMLImageElement[];

    const onClick = (e: Event) => {
      const img = e.currentTarget as HTMLImageElement;
      lastTrigger.current = img;
      setSrc(img.src);
      const figcaption = img.closest("figure")?.querySelector("figcaption")?.textContent;
      setCaption(figcaption || img.alt || "");
      setOpen(true);
    };

    imgs.forEach((img) => {
      img.style.cursor = "zoom-in";
      img.addEventListener("click", onClick);
    });

    return () => {
      imgs.forEach((img) => img.removeEventListener("click", onClick));
    };
  }, [containerRef]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-5xl p-0 bg-background border-border overflow-hidden">
        <div className="relative bg-black/95 flex items-center justify-center min-h-[60vh] max-h-[80vh] p-6">
          {src && (
            <img
              src={src}
              alt={caption}
              className="max-w-full max-h-[75vh] object-contain"
            />
          )}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 text-white hover:bg-white/10"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="p-4 flex items-start justify-between gap-4 bg-background">
          <p className="text-sm text-muted-foreground flex-1">{caption || "Figure"}</p>
          <a
            href={src}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline shrink-0"
          >
            <Download className="h-4 w-4" /> Download
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
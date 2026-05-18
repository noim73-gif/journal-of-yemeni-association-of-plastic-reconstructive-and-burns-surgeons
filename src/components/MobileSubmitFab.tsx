import { Link, useLocation } from "react-router-dom";
import { Send } from "lucide-react";

/**
 * Floating "Submit Manuscript" button visible only on mobile (< md).
 * Hidden on the Submit page itself and admin/reviewer dashboards.
 */
export function MobileSubmitFab() {
  const { pathname } = useLocation();
  const hidden =
    pathname.startsWith("/submit") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/reviewer") ||
    pathname.startsWith("/auth");

  if (hidden) return null;

  return (
    <Link
      to="/submit"
      aria-label="Submit Manuscript"
      className="md:hidden fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 px-4 py-3 rounded-full bg-accent text-accent-foreground shadow-elegant-lg hover:scale-105 active:scale-95 transition-transform font-medium text-sm"
    >
      <Send className="h-4 w-4" />
      Submit
    </Link>
  );
}
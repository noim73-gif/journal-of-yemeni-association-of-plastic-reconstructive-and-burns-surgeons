import { useEffect } from "react";

export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title;
    document.title = title ? `${title} | YJPRBS` : "YJPRBS — Yemeni Journal of Plastic, Reconstructive and Burn Surgery";
    return () => { document.title = prev; };
  }, [title]);
}

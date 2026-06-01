import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";

export interface AuthorRow {
  name: string;
  affiliation?: string;
  email?: string;
  orcid?: string;
  corresponding?: boolean;
}

export interface Declarations {
  conflictOfInterest: boolean;
  ethicsApproval: boolean;
  patientConsent: boolean;
  authorshipContributions: boolean;
  notPublishedElsewhere: boolean;
}

export interface DraftState {
  title: string;
  authors: AuthorRow[];
  category: string;
  keywords: string;
  abstract: string;
  cover_letter: string;
  manuscript_url: string | null;
  manuscript_name: string | null;
  supplementary_url: string | null;
  supplementary_name: string | null;
  declarations: Declarations;
  step: number;
}

export const EMPTY_DRAFT: DraftState = {
  title: "",
  authors: [{ name: "", affiliation: "", email: "", orcid: "", corresponding: true }],
  category: "",
  keywords: "",
  abstract: "",
  cover_letter: "",
  manuscript_url: null,
  manuscript_name: null,
  supplementary_url: null,
  supplementary_name: null,
  declarations: {
    conflictOfInterest: false,
    ethicsApproval: false,
    patientConsent: false,
    authorshipContributions: false,
    notPublishedElsewhere: false,
  },
  step: 1,
};

const LS_PREFIX = "yjprbs:submission-draft:";
const LS_DEBOUNCE = 800;
const DB_DEBOUNCE = 8000;

function authorsToText(rows: AuthorRow[]): string {
  return rows
    .map((a) => a.name?.trim())
    .filter(Boolean)
    .join("; ");
}

export function useSubmissionDraft() {
  const { user } = useAuth();
  const [draft, setDraft] = useState<DraftState>(EMPTY_DRAFT);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saving, setSaving] = useState(false);

  const lsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dbTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const draftRef = useRef(draft);
  const draftIdRef = useRef<string | null>(null);
  draftRef.current = draft;
  draftIdRef.current = draftId;

  const lsKey = user ? `${LS_PREFIX}${user.id}` : null;

  // Initial load: prefer most recent DB draft, fall back to localStorage
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!user || !lsKey) {
        setLoading(false);
        return;
      }
      let lsState: DraftState | null = null;
      let lsTime = 0;
      try {
        const raw = localStorage.getItem(lsKey);
        if (raw) {
          const parsed = JSON.parse(raw);
          lsState = parsed.draft;
          lsTime = parsed.savedAt ?? 0;
        }
      } catch (e) {
        logger.error("Failed to read draft from localStorage", e);
      }

      const { data, error } = await supabase
        .from("submissions")
        .select("id, title, authors, abstract, keywords, category, cover_letter, manuscript_url, supplementary_url, metadata, updated_at")
        .eq("user_id", user.id)
        .eq("status", "draft")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cancelled) return;
      if (error) logger.error("Failed to load DB draft", error);

      const dbTime = data?.updated_at ? new Date(data.updated_at).getTime() : 0;

      if (data && dbTime >= lsTime) {
        const md = (data.metadata as Record<string, unknown> | null) ?? {};
        const authors = Array.isArray((md as { authors?: AuthorRow[] }).authors)
          ? ((md as { authors: AuthorRow[] }).authors)
          : EMPTY_DRAFT.authors;
        const declarations = ((md as { declarations?: Declarations }).declarations) ?? EMPTY_DRAFT.declarations;
        const step = typeof (md as { step?: number }).step === "number" ? (md as { step: number }).step : 1;
        setDraft({
          title: data.title ?? "",
          authors,
          category: data.category ?? "",
          keywords: data.keywords ?? "",
          abstract: data.abstract ?? "",
          cover_letter: data.cover_letter ?? "",
          manuscript_url: data.manuscript_url ?? null,
          manuscript_name: (md as { manuscript_name?: string }).manuscript_name ?? null,
          supplementary_url: data.supplementary_url ?? null,
          supplementary_name: (md as { supplementary_name?: string }).supplementary_name ?? null,
          declarations,
          step,
        });
        setDraftId(data.id);
        setLastSavedAt(new Date(data.updated_at));
      } else if (lsState) {
        setDraft(lsState);
        setLastSavedAt(lsTime ? new Date(lsTime) : null);
      }
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, lsKey]);

  const writeLocal = useCallback(
    (next: DraftState) => {
      if (!lsKey) return;
      try {
        localStorage.setItem(lsKey, JSON.stringify({ draft: next, savedAt: Date.now() }));
      } catch (e) {
        logger.error("Failed to write draft to localStorage", e);
      }
    },
    [lsKey]
  );

  const persistToDb = useCallback(
    async (next: DraftState, createIfMissing: boolean): Promise<string | null> => {
      if (!user) return null;
      const payload = {
        user_id: user.id,
        title: next.title || "Untitled draft",
        abstract: next.abstract || "",
        authors: authorsToText(next.authors) || "",
        keywords: next.keywords || null,
        category: next.category || null,
        cover_letter: next.cover_letter || null,
        manuscript_url: next.manuscript_url,
        supplementary_url: next.supplementary_url,
        status: "draft",
        metadata: {
          authors: next.authors,
          declarations: next.declarations,
          step: next.step,
          manuscript_name: next.manuscript_name,
          supplementary_name: next.supplementary_name,
        } as Record<string, unknown>,
      };

      setSaving(true);
      try {
        const currentId = draftIdRef.current;
        if (currentId) {
          const { error } = await supabase.from("submissions").update(payload).eq("id", currentId);
          if (error) {
            logger.error("Failed to update draft", error);
            return null;
          }
          setLastSavedAt(new Date());
          return currentId;
        }
        if (!createIfMissing) return null;
        const { data, error } = await supabase
          .from("submissions")
          .insert(payload)
          .select("id")
          .single();
        if (error || !data) {
          logger.error("Failed to insert draft", error);
          return null;
        }
        setDraftId(data.id);
        setLastSavedAt(new Date());
        return data.id;
      } finally {
        setSaving(false);
      }
    },
    [user]
  );

  // Schedule debounced saves
  const scheduleSaves = useCallback(
    (next: DraftState) => {
      if (lsTimer.current) clearTimeout(lsTimer.current);
      if (dbTimer.current) clearTimeout(dbTimer.current);
      lsTimer.current = setTimeout(() => writeLocal(next), LS_DEBOUNCE);
      dbTimer.current = setTimeout(() => {
        // Only auto-create the DB row once the user has moved past step 1
        const createIfMissing = next.step >= 2;
        void persistToDb(next, createIfMissing);
      }, DB_DEBOUNCE);
    },
    [persistToDb, writeLocal]
  );

  const update = useCallback(
    (patch: Partial<DraftState> | ((prev: DraftState) => DraftState)) => {
      setDraft((prev) => {
        const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
        scheduleSaves(next);
        return next;
      });
    },
    [scheduleSaves]
  );

  const saveNow = useCallback(async (): Promise<string | null> => {
    if (lsTimer.current) clearTimeout(lsTimer.current);
    if (dbTimer.current) clearTimeout(dbTimer.current);
    const current = draftRef.current;
    writeLocal(current);
    return persistToDb(current, current.step >= 2);
  }, [persistToDb, writeLocal]);

  const discard = useCallback(async () => {
    if (lsTimer.current) clearTimeout(lsTimer.current);
    if (dbTimer.current) clearTimeout(dbTimer.current);
    if (lsKey) localStorage.removeItem(lsKey);
    const id = draftIdRef.current;
    if (id) {
      const { error } = await supabase.from("submissions").delete().eq("id", id);
      if (error) logger.error("Failed to delete draft", error);
    }
    setDraftId(null);
    setDraft(EMPTY_DRAFT);
    setLastSavedAt(null);
  }, [lsKey]);

  const clearLocalOnly = useCallback(() => {
    if (lsTimer.current) clearTimeout(lsTimer.current);
    if (dbTimer.current) clearTimeout(dbTimer.current);
    if (lsKey) localStorage.removeItem(lsKey);
  }, [lsKey]);

  // Save on tab close
  useEffect(() => {
    const onBeforeUnload = () => {
      if (lsKey) {
        try {
          localStorage.setItem(
            lsKey,
            JSON.stringify({ draft: draftRef.current, savedAt: Date.now() })
          );
        } catch {
          /* noop */
        }
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [lsKey]);

  return {
    draft,
    update,
    draftId,
    loading,
    saving,
    lastSavedAt,
    saveNow,
    discard,
    clearLocalOnly,
    authorsToText,
  };
}
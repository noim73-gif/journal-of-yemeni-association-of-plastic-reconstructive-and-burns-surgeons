import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { logger } from "@/lib/logger";
import { recommendGuideline } from "@/lib/reportingGuidelines";

export interface AuthorRow {
  name: string;
  degree?: string;
  orcid?: string;
  department?: string;
  institution?: string;
  affiliation?: string;
  country?: string;
  email?: string;
  role?: string;
  creditRoles?: string[];
  corresponding?: boolean;
}

export interface Declarations {
  ethicsApproval: boolean;
  ethicsNotApplicable: boolean;
  informedConsent: boolean;
  consentNotApplicable: boolean;
  conflictOfInterest: boolean;
  fundingDisclosed: boolean;
  dataAvailability: boolean;
  authorContributions: boolean;
  acknowledgmentsConfirmed: boolean;
  aiAssistanceUsed: boolean;
  aiAssistanceDeclared: boolean;
  trialRegistrationConfirmed: boolean;
  notPublishedElsewhere: boolean;
  noPlagiarism: boolean;
}

export interface FileRef {
  path: string;
  name: string;
  size?: number;
}

export type FileSlot =
  | "main_manuscript"
  | "title_page"
  | "figures"
  | "tables"
  | "supplementary"
  | "ethics_approval"
  | "reporting_checklist"
  | "cover_letter";

export type FileMap = Partial<Record<FileSlot, FileRef[]>>;

export interface DraftState {
  // Step 1
  articleTypeId: string | null;
  articleTypeCode: string | null;
  studyDesign: string | null;
  // Step 2
  title: string;
  abstract: string;
  keywords: string;
  wordCount: string;
  language: string;
  category: string;
  fundingStatement: string;
  conflictOfInterestStatement: string;
  dataAvailabilityStatement: string;
  ethicsApprovalNumber: string;
  ethicsCommittee: string;
  trialRegistry: string;
  trialRegistrationId: string;
  patientConsentObtained: boolean | null;
  // Step 3
  authors: AuthorRow[];
  // Step 4
  files: FileMap;
  cover_letter: string;
  // Step 5
  declarations: Declarations;
  aiDisclosure: string;
  acknowledgments: string;
  // Step 6
  reportingGuideline: string | null;
  guidelineAcknowledged: boolean;
  // Step 7
  finalConfirmations: Record<string, boolean>;
  step: number;
  // legacy compatibility
  manuscript_url: string | null;
  manuscript_name: string | null;
  supplementary_url: string | null;
  supplementary_name: string | null;
}

export const EMPTY_DECLARATIONS: Declarations = {
  ethicsApproval: false,
  ethicsNotApplicable: false,
  informedConsent: false,
  consentNotApplicable: false,
  conflictOfInterest: false,
  fundingDisclosed: false,
  dataAvailability: false,
  authorContributions: false,
  acknowledgmentsConfirmed: false,
  aiAssistanceUsed: false,
  aiAssistanceDeclared: false,
  trialRegistrationConfirmed: false,
  notPublishedElsewhere: false,
  noPlagiarism: false,
};

export const EMPTY_DRAFT: DraftState = {
  articleTypeId: null,
  articleTypeCode: null,
  studyDesign: null,
  title: "",
  abstract: "",
  keywords: "",
  wordCount: "",
  language: "en",
  category: "",
  fundingStatement: "",
  conflictOfInterestStatement: "",
  dataAvailabilityStatement: "",
  ethicsApprovalNumber: "",
  ethicsCommittee: "",
  trialRegistry: "",
  trialRegistrationId: "",
  patientConsentObtained: null,
  authors: [
    {
      name: "",
      degree: "",
      orcid: "",
      department: "",
      institution: "",
      country: "",
      email: "",
      role: "Author",
      creditRoles: [],
      corresponding: true,
    },
  ],
  files: {},
  cover_letter: "",
  declarations: { ...EMPTY_DECLARATIONS },
  aiDisclosure: "",
  acknowledgments: "",
  reportingGuideline: null,
  guidelineAcknowledged: false,
  finalConfirmations: {},
  step: 1,
  manuscript_url: null,
  manuscript_name: null,
  supplementary_url: null,
  supplementary_name: null,
};

const LS_PREFIX = "yjprbs:submission-draft:";
const LS_DEBOUNCE = 800;
const DB_DEBOUNCE = 8000;

export function authorsToText(rows: AuthorRow[]): string {
  return rows
    .map((a) => a.name?.trim())
    .filter(Boolean)
    .join("; ");
}

/** Merge a persisted (possibly older) draft shape onto the current schema. */
function hydrate(raw: unknown): DraftState {
  const p = (raw ?? {}) as Partial<DraftState> & { declarations?: Partial<Declarations> };
  const authors = Array.isArray(p.authors) && p.authors.length
    ? p.authors.map((a) => ({
        ...a,
        institution: a.institution ?? a.affiliation ?? "",
        creditRoles: Array.isArray(a.creditRoles) ? a.creditRoles : [],
      }))
    : EMPTY_DRAFT.authors;
  const files: FileMap = { ...(p.files ?? {}) };
  // Legacy single-file drafts
  if (!files.main_manuscript && p.manuscript_url) {
    files.main_manuscript = [{ path: p.manuscript_url, name: p.manuscript_name ?? "Manuscript" }];
  }
  if (!files.supplementary && p.supplementary_url) {
    files.supplementary = [{ path: p.supplementary_url, name: p.supplementary_name ?? "Supplementary" }];
  }
  return {
    ...EMPTY_DRAFT,
    ...p,
    authors,
    files,
    declarations: { ...EMPTY_DECLARATIONS, ...(p.declarations ?? {}) },
    finalConfirmations: p.finalConfirmations ?? {},
  };
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
          lsState = hydrate(parsed.draft);
          lsTime = parsed.savedAt ?? 0;
        }
      } catch (e) {
        logger.error("Failed to read draft from localStorage", e);
      }

      const { data, error } = await supabase
        .from("submissions")
        .select("id, metadata, updated_at")
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
        setDraft(hydrate(md.draft ?? md));
        setDraftId(data.id);
        setLastSavedAt(new Date(data.updated_at));
      } else if (lsState) {
        setDraft(lsState);
        setLastSavedAt(lsTime ? new Date(lsTime) : null);
        if (data) setDraftId(data.id);
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

  const buildPayload = useCallback((next: DraftState) => {
    const mainFile = next.files.main_manuscript?.[0] ?? null;
    const suppFile = next.files.supplementary?.[0] ?? null;
    return {
      user_id: user?.id as string,
      title: next.title || "Untitled draft",
      abstract: next.abstract || "",
      authors: authorsToText(next.authors) || "",
      keywords: next.keywords || null,
      category: next.category || null,
      cover_letter: next.cover_letter || null,
      manuscript_url: mainFile?.path ?? null,
      supplementary_url: suppFile?.path ?? null,
      status: "draft",
      article_type_id: next.articleTypeId,
      word_count: next.wordCount ? Number(next.wordCount) || null : null,
      manuscript_language: next.language || "en",
      funding_statement: next.fundingStatement || null,
      conflict_of_interest_statement: next.conflictOfInterestStatement || null,
      data_availability_statement: next.dataAvailabilityStatement || null,
      ethics_approval_number: next.ethicsApprovalNumber || null,
      ethics_committee: next.ethicsCommittee || null,
      trial_registry: next.trialRegistry || null,
      trial_registration_id: next.trialRegistrationId || null,
      patient_consent_obtained: next.patientConsentObtained,
      reporting_guideline:
        next.reportingGuideline ??
        recommendGuideline(next.articleTypeCode, next.studyDesign).code,
      ai_disclosure: next.aiDisclosure || null,
      acknowledgments: next.acknowledgments || null,
      metadata: JSON.parse(JSON.stringify({ draft: next })),
    };
  }, [user]);

  const persistToDb = useCallback(
    async (next: DraftState, createIfMissing: boolean): Promise<string | null> => {
      if (!user) return null;
      const payload = buildPayload(next);
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
    [user, buildPayload]
  );

  const scheduleSaves = useCallback(
    (next: DraftState) => {
      if (lsTimer.current) clearTimeout(lsTimer.current);
      if (dbTimer.current) clearTimeout(dbTimer.current);
      lsTimer.current = setTimeout(() => writeLocal(next), LS_DEBOUNCE);
      dbTimer.current = setTimeout(() => {
        void persistToDb(next, next.step >= 2);
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

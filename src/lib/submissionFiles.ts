import type { FileSlot } from "@/hooks/useSubmissionDraft";

export interface FileSlotDef {
  slot: FileSlot;
  label: string;
  hint: string;
  accept: string;
  required: boolean;
  multiple: boolean;
}

export const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const FILE_SLOTS: FileSlotDef[] = [
  {
    slot: "main_manuscript",
    label: "Main manuscript",
    hint: "Anonymised manuscript without author details — DOCX, DOC or PDF",
    accept: ".doc,.docx,.pdf",
    required: true,
    multiple: false,
  },
  {
    slot: "title_page",
    label: "Title page",
    hint: "Title, all authors, affiliations and corresponding author — DOCX or PDF",
    accept: ".doc,.docx,.pdf",
    required: true,
    multiple: false,
  },
  {
    slot: "cover_letter",
    label: "Cover letter",
    hint: "Addressed to the Editor-in-Chief — DOCX or PDF",
    accept: ".doc,.docx,.pdf",
    required: true,
    multiple: false,
  },
  {
    slot: "figures",
    label: "Figures",
    hint: "One file per figure — TIFF, PNG, JPG or PDF (min. 300 dpi)",
    accept: ".tif,.tiff,.png,.jpg,.jpeg,.pdf",
    required: false,
    multiple: true,
  },
  {
    slot: "tables",
    label: "Tables",
    hint: "Editable tables — DOCX, XLSX or CSV",
    accept: ".doc,.docx,.xlsx,.xls,.csv",
    required: false,
    multiple: true,
  },
  {
    slot: "ethics_approval",
    label: "Ethics approval letter",
    hint: "Institutional review board / ethics committee approval — PDF or image",
    accept: ".pdf,.png,.jpg,.jpeg",
    required: false,
    multiple: true,
  },
  {
    slot: "reporting_checklist",
    label: "Reporting guideline checklist",
    hint: "Completed checklist for the recommended guideline — PDF or DOCX",
    accept: ".pdf,.doc,.docx",
    required: false,
    multiple: true,
  },
  {
    slot: "supplementary",
    label: "Supplementary files",
    hint: "Appendices, datasets or videos — PDF, DOCX, XLSX, CSV, ZIP or images",
    accept: ".pdf,.doc,.docx,.xlsx,.csv,.zip,.png,.jpg,.jpeg,.tif,.tiff",
    required: false,
    multiple: true,
  },
];

export const FILE_SLOT_LABELS = FILE_SLOTS.reduce<Record<string, string>>((acc, s) => {
  acc[s.slot] = s.label;
  return acc;
}, {});

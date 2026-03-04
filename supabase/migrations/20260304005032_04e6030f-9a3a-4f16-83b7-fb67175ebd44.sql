
-- Add new roles to app_role enum for OJS compliance
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'journal_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'copyeditor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'layout_editor';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'section_editor';

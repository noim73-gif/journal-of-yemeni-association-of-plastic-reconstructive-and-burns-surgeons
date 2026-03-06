export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_galleys: {
        Row: {
          article_id: string
          created_at: string
          file_type: string
          file_url: string
          id: string
          is_primary: boolean | null
          label: string
          locale: string | null
          updated_at: string
        }
        Insert: {
          article_id: string
          created_at?: string
          file_type?: string
          file_url: string
          id?: string
          is_primary?: boolean | null
          label?: string
          locale?: string | null
          updated_at?: string
        }
        Update: {
          article_id?: string
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          is_primary?: boolean | null
          label?: string
          locale?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_galleys_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_likes: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_likes_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_reviews: {
        Row: {
          article_id: string
          assigned_at: string
          completed_at: string | null
          created_at: string
          feedback: string | null
          id: string
          private_notes: string | null
          recommendation: string | null
          reviewer_id: string
          status: string
          updated_at: string
        }
        Insert: {
          article_id: string
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          private_notes?: string | null
          recommendation?: string | null
          reviewer_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          article_id?: string
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          private_notes?: string | null
          recommendation?: string | null
          reviewer_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_reviews_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          abstract: string | null
          article_number: number | null
          authors: string | null
          category: string | null
          content: string | null
          created_at: string
          created_by: string | null
          discussion: string | null
          doi: string | null
          id: string
          image_url: string | null
          introduction: string | null
          is_featured: boolean | null
          is_main_featured: boolean | null
          issue: string | null
          journal_issue_id: string | null
          keywords: string[] | null
          methods: string | null
          pages: string | null
          published_at: string | null
          references: string | null
          results: string | null
          review_status: string | null
          submission_id: string | null
          title: string
          updated_at: string
          volume: string | null
        }
        Insert: {
          abstract?: string | null
          article_number?: number | null
          authors?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          discussion?: string | null
          doi?: string | null
          id?: string
          image_url?: string | null
          introduction?: string | null
          is_featured?: boolean | null
          is_main_featured?: boolean | null
          issue?: string | null
          journal_issue_id?: string | null
          keywords?: string[] | null
          methods?: string | null
          pages?: string | null
          published_at?: string | null
          references?: string | null
          results?: string | null
          review_status?: string | null
          submission_id?: string | null
          title: string
          updated_at?: string
          volume?: string | null
        }
        Update: {
          abstract?: string | null
          article_number?: number | null
          authors?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          created_by?: string | null
          discussion?: string | null
          doi?: string | null
          id?: string
          image_url?: string | null
          introduction?: string | null
          is_featured?: boolean | null
          is_main_featured?: boolean | null
          issue?: string | null
          journal_issue_id?: string | null
          keywords?: string[] | null
          methods?: string | null
          pages?: string | null
          published_at?: string | null
          references?: string | null
          results?: string | null
          review_status?: string | null
          submission_id?: string | null
          title?: string
          updated_at?: string
          volume?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_journal_issue_id_fkey"
            columns: ["journal_issue_id"]
            isOneToOne: false
            referencedRelation: "journal_issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "articles_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_profiles: {
        Row: {
          academic_degree: string | null
          created_at: string
          google_scholar_id: string | null
          hospital: string | null
          id: string
          is_public_profile: boolean | null
          medical_license_number: string | null
          orcid_id: string | null
          research_interests: string[] | null
          specialty: string | null
          spoken_languages: string[] | null
          university: string | null
          updated_at: string
          user_id: string
          years_of_experience: number | null
        }
        Insert: {
          academic_degree?: string | null
          created_at?: string
          google_scholar_id?: string | null
          hospital?: string | null
          id?: string
          is_public_profile?: boolean | null
          medical_license_number?: string | null
          orcid_id?: string | null
          research_interests?: string[] | null
          specialty?: string | null
          spoken_languages?: string[] | null
          university?: string | null
          updated_at?: string
          user_id: string
          years_of_experience?: number | null
        }
        Update: {
          academic_degree?: string | null
          created_at?: string
          google_scholar_id?: string | null
          hospital?: string | null
          id?: string
          is_public_profile?: boolean | null
          medical_license_number?: string | null
          orcid_id?: string | null
          research_interests?: string[] | null
          specialty?: string | null
          spoken_languages?: string[] | null
          university?: string | null
          updated_at?: string
          user_id?: string
          years_of_experience?: number | null
        }
        Relationships: []
      }
      editorial_board_members: {
        Row: {
          affiliation: string | null
          created_at: string
          display_order: number | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          orcid_id: string | null
          photo_url: string | null
          role: Database["public"]["Enums"]["board_member_role"]
          specialty: string | null
          title: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          affiliation?: string | null
          created_at?: string
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          orcid_id?: string | null
          photo_url?: string | null
          role: Database["public"]["Enums"]["board_member_role"]
          specialty?: string | null
          title?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          affiliation?: string | null
          created_at?: string
          display_order?: number | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          orcid_id?: string | null
          photo_url?: string | null
          role?: Database["public"]["Enums"]["board_member_role"]
          specialty?: string | null
          title?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      editorial_decisions: {
        Row: {
          comments: string | null
          created_at: string
          decision: string
          editor_id: string
          id: string
          notify_author: boolean | null
          stage: string
          submission_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
          decision: string
          editor_id: string
          id?: string
          notify_author?: boolean | null
          stage: string
          submission_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
          decision?: string
          editor_id?: string
          id?: string
          notify_author?: boolean | null
          stage?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_decisions_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_issues: {
        Row: {
          cover_image_url: string | null
          created_at: string
          description: string | null
          id: string
          is_current: boolean | null
          number: number
          published_at: string | null
          status: string
          title: string | null
          updated_at: string
          volume: number
          year: number
        }
        Insert: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_current?: boolean | null
          number: number
          published_at?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          volume: number
          year: number
        }
        Update: {
          cover_image_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_current?: boolean | null
          number?: number
          published_at?: string | null
          status?: string
          title?: string | null
          updated_at?: string
          volume?: number
          year?: number
        }
        Relationships: []
      }
      login_activity: {
        Row: {
          id: string
          ip_address: string | null
          login_at: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          login_at?: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          login_at?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          account_status: string | null
          additional_specialties: string | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          full_name: string | null
          id: string
          id_number: string | null
          notification_preferences: Json | null
          phone: string | null
          postal_code: string | null
          primary_specialty: string | null
          profession: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          account_status?: string | null
          additional_specialties?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          id_number?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          postal_code?: string | null
          primary_specialty?: string | null
          profession?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          account_status?: string | null
          additional_specialties?: string | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          id_number?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          postal_code?: string | null
          primary_specialty?: string | null
          profession?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      reading_history: {
        Row: {
          article_authors: string | null
          article_id: string
          article_image: string | null
          article_title: string
          id: string
          read_at: string
          read_duration_seconds: number | null
          user_id: string
        }
        Insert: {
          article_authors?: string | null
          article_id: string
          article_image?: string | null
          article_title: string
          id?: string
          read_at?: string
          read_duration_seconds?: number | null
          user_id: string
        }
        Update: {
          article_authors?: string | null
          article_id?: string
          article_image?: string | null
          article_title?: string
          id?: string
          read_at?: string
          read_duration_seconds?: number | null
          user_id?: string
        }
        Relationships: []
      }
      reviewer_applications: {
        Row: {
          academic_title: string
          admin_notes: string | null
          agreed_to_confidentiality: boolean
          agreed_to_guidelines: boolean
          created_at: string
          department: string | null
          email: string
          expertise_areas: string[]
          full_name: string
          google_scholar_id: string | null
          id: string
          institution: string
          motivation: string | null
          orcid_id: string | null
          previous_review_experience: string | null
          publications_count: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["reviewer_application_status"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          academic_title: string
          admin_notes?: string | null
          agreed_to_confidentiality?: boolean
          agreed_to_guidelines?: boolean
          created_at?: string
          department?: string | null
          email: string
          expertise_areas?: string[]
          full_name: string
          google_scholar_id?: string | null
          id?: string
          institution: string
          motivation?: string | null
          orcid_id?: string | null
          previous_review_experience?: string | null
          publications_count?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["reviewer_application_status"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          academic_title?: string
          admin_notes?: string | null
          agreed_to_confidentiality?: boolean
          agreed_to_guidelines?: boolean
          created_at?: string
          department?: string | null
          email?: string
          expertise_areas?: string[]
          full_name?: string
          google_scholar_id?: string | null
          id?: string
          institution?: string
          motivation?: string | null
          orcid_id?: string | null
          previous_review_experience?: string | null
          publications_count?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["reviewer_application_status"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      saved_articles: {
        Row: {
          article_authors: string | null
          article_id: string
          article_image: string | null
          article_title: string
          id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          article_authors?: string | null
          article_id: string
          article_image?: string | null
          article_title: string
          id?: string
          saved_at?: string
          user_id: string
        }
        Update: {
          article_authors?: string | null
          article_id?: string
          article_image?: string | null
          article_title?: string
          id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: []
      }
      submission_files: {
        Row: {
          created_at: string
          file_name: string
          file_type: string
          file_url: string
          id: string
          notes: string | null
          stage: string
          submission_id: string
          uploaded_by: string
          version: number
        }
        Insert: {
          created_at?: string
          file_name: string
          file_type?: string
          file_url: string
          id?: string
          notes?: string | null
          stage?: string
          submission_id: string
          uploaded_by: string
          version?: number
        }
        Update: {
          created_at?: string
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          notes?: string | null
          stage?: string
          submission_id?: string
          uploaded_by?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "submission_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_reviews: {
        Row: {
          assigned_at: string
          completed_at: string | null
          created_at: string
          feedback: string | null
          id: string
          private_notes: string | null
          recommendation: string | null
          reviewer_id: string
          status: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          private_notes?: string | null
          recommendation?: string | null
          reviewer_id: string
          status?: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          completed_at?: string | null
          created_at?: string
          feedback?: string | null
          id?: string
          private_notes?: string | null
          recommendation?: string | null
          reviewer_id?: string
          status?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_reviews_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          abstract: string
          admin_notes: string | null
          authors: string
          category: string | null
          copyeditor_id: string | null
          cover_letter: string | null
          created_at: string
          decision: string | null
          decision_date: string | null
          editor_id: string | null
          id: string
          journal_issue_id: string | null
          keywords: string | null
          layout_editor_id: string | null
          manuscript_url: string | null
          metadata: Json | null
          review_type: string | null
          revision_number: number | null
          section_editor_id: string | null
          status: string
          supplementary_url: string | null
          title: string
          updated_at: string
          user_id: string
          workflow_stage: string
        }
        Insert: {
          abstract: string
          admin_notes?: string | null
          authors: string
          category?: string | null
          copyeditor_id?: string | null
          cover_letter?: string | null
          created_at?: string
          decision?: string | null
          decision_date?: string | null
          editor_id?: string | null
          id?: string
          journal_issue_id?: string | null
          keywords?: string | null
          layout_editor_id?: string | null
          manuscript_url?: string | null
          metadata?: Json | null
          review_type?: string | null
          revision_number?: number | null
          section_editor_id?: string | null
          status?: string
          supplementary_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          workflow_stage?: string
        }
        Update: {
          abstract?: string
          admin_notes?: string | null
          authors?: string
          category?: string | null
          copyeditor_id?: string | null
          cover_letter?: string | null
          created_at?: string
          decision?: string | null
          decision_date?: string | null
          editor_id?: string | null
          id?: string
          journal_issue_id?: string | null
          keywords?: string | null
          layout_editor_id?: string | null
          manuscript_url?: string | null
          metadata?: Json | null
          review_type?: string | null
          revision_number?: number | null
          section_editor_id?: string | null
          status?: string
          supplementary_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          workflow_stage?: string
        }
        Relationships: [
          {
            foreignKeyName: "submissions_journal_issue_id_fkey"
            columns: ["journal_issue_id"]
            isOneToOne: false
            referencedRelation: "journal_issues"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      doctor_profiles_public: {
        Row: {
          academic_degree: string | null
          created_at: string | null
          hospital: string | null
          id: string | null
          is_public_profile: boolean | null
          research_interests: string[] | null
          specialty: string | null
          spoken_languages: string[] | null
          university: string | null
          updated_at: string | null
          user_id: string | null
          years_of_experience: number | null
        }
        Insert: {
          academic_degree?: string | null
          created_at?: string | null
          hospital?: string | null
          id?: string | null
          is_public_profile?: boolean | null
          research_interests?: string[] | null
          specialty?: string | null
          spoken_languages?: string[] | null
          university?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Update: {
          academic_degree?: string | null
          created_at?: string | null
          hospital?: string | null
          id?: string | null
          is_public_profile?: boolean | null
          research_interests?: string[] | null
          specialty?: string | null
          spoken_languages?: string[] | null
          university?: string | null
          updated_at?: string | null
          user_id?: string | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "admin"
        | "moderator"
        | "user"
        | "reviewer"
        | "doctor"
        | "editor"
        | "member"
        | "journal_manager"
        | "copyeditor"
        | "layout_editor"
        | "section_editor"
      board_member_role:
        | "editor_in_chief"
        | "associate_editor"
        | "board_member"
        | "international_advisor"
      reviewer_application_status:
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "admin",
        "moderator",
        "user",
        "reviewer",
        "doctor",
        "editor",
        "member",
        "journal_manager",
        "copyeditor",
        "layout_editor",
        "section_editor",
      ],
      board_member_role: [
        "editor_in_chief",
        "associate_editor",
        "board_member",
        "international_advisor",
      ],
      reviewer_application_status: [
        "pending",
        "under_review",
        "approved",
        "rejected",
      ],
    },
  },
} as const

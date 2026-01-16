import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  id_number: string | null;
  phone: string | null;
  city: string | null;
  country: string | null;
  bio: string | null;
  account_status: "verified" | "unverified" | "suspended";
  notification_preferences: {
    email_submissions: boolean;
    email_reviews: boolean;
    email_publications: boolean;
  } | null;
  created_at: string;
  updated_at: string;
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  specialty: "Plastic Surgery" | "Reconstructive Surgery" | "Burns" | "General Surgery" | "Other" | null;
  academic_degree: string | null;
  university: string | null;
  hospital: string | null;
  years_of_experience: number | null;
  medical_license_number: string | null;
  research_interests: string[] | null;
  spoken_languages: string[] | null;
  is_public_profile: boolean;
  orcid_id: string | null;
  google_scholar_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginActivity {
  id: string;
  user_id: string;
  ip_address: string | null;
  user_agent: string | null;
  login_at: string;
}

export function useProfile(userId?: string) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile | null>(null);
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const targetUserId = userId || user?.id;

  const fetchProfile = useCallback(async () => {
    if (!targetUserId) {
      setLoading(false);
      return;
    }

    try {
      // Fetch main profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", targetUserId)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        throw profileError;
      }

      if (profileData) {
        setProfile({
          ...profileData,
          account_status: profileData.account_status as "verified" | "unverified" | "suspended",
          notification_preferences: profileData.notification_preferences as Profile["notification_preferences"],
        });
      }

      // Fetch doctor profile
      const { data: doctorData, error: doctorError } = await supabase
        .from("doctor_profiles")
        .select("*")
        .eq("user_id", targetUserId)
        .single();

      if (doctorError && doctorError.code !== "PGRST116") {
        console.error("Error fetching doctor profile:", doctorError);
      }

      if (doctorData) {
        setDoctorProfile(doctorData as DoctorProfile);
      }

      // Fetch user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", targetUserId);

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
      } else {
        setUserRoles(rolesData?.map((r) => r.role) || []);
      }

      // Fetch login activity (only for own profile)
      if (targetUserId === user?.id) {
        const { data: activityData, error: activityError } = await supabase
          .from("login_activity")
          .select("*")
          .eq("user_id", targetUserId)
          .order("login_at", { ascending: false })
          .limit(10);

        if (activityError) {
          console.error("Error fetching login activity:", activityError);
        } else {
          setLoginActivity(activityData || []);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [targetUserId, user?.id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!targetUserId) return { success: false };

    try {
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("user_id", targetUserId);

      if (error) throw error;

      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
      toast.success("Profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      return { success: false };
    }
  };

  const updateDoctorProfile = async (updates: Partial<DoctorProfile>) => {
    if (!targetUserId) return { success: false };

    try {
      // Check if doctor profile exists
      const { data: existing } = await supabase
        .from("doctor_profiles")
        .select("id")
        .eq("user_id", targetUserId)
        .single();

      if (existing) {
        // Update existing
        const { error } = await supabase
          .from("doctor_profiles")
          .update(updates)
          .eq("user_id", targetUserId);

        if (error) throw error;
      } else {
        // Insert new
        const { error } = await supabase
          .from("doctor_profiles")
          .insert({ user_id: targetUserId, ...updates });

        if (error) throw error;
      }

      setDoctorProfile((prev) => (prev ? { ...prev, ...updates } : null));
      await fetchProfile(); // Refresh data
      toast.success("Professional profile updated successfully");
      return { success: true };
    } catch (error) {
      console.error("Error updating doctor profile:", error);
      toast.error("Failed to update professional profile");
      return { success: false };
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!targetUserId) return { success: false, url: null };

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${targetUserId}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("article-images")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("article-images")
        .getPublicUrl(fileName);

      const avatarUrl = data.publicUrl;

      await updateProfile({ avatar_url: avatarUrl });
      return { success: true, url: avatarUrl };
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload avatar");
      return { success: false, url: null };
    }
  };

  const updateNotificationPreferences = async (
    preferences: Profile["notification_preferences"]
  ) => {
    return updateProfile({ notification_preferences: preferences } as Partial<Profile>);
  };

  return {
    profile,
    doctorProfile,
    loginActivity,
    userRoles,
    loading,
    refetch: fetchProfile,
    updateProfile,
    updateDoctorProfile,
    uploadAvatar,
    updateNotificationPreferences,
  };
}

// Hook for fetching public doctor profiles
export function usePublicDoctorProfiles() {
  const [doctors, setDoctors] = useState<(DoctorProfile & { profile: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from("doctor_profiles")
          .select(`
            *,
            profile:profiles!doctor_profiles_user_id_fkey(*)
          `)
          .eq("is_public_profile", true);

        if (error) throw error;

        // Since the join may not work due to FK structure, fetch profiles separately
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("*");

        const doctorsWithProfiles = data?.map((doc) => {
          const userProfile = profilesData?.find(p => p.user_id === doc.user_id);
          return {
            ...doc,
            profile: userProfile ? {
              ...userProfile,
              account_status: userProfile.account_status as Profile["account_status"],
              notification_preferences: userProfile.notification_preferences as Profile["notification_preferences"],
            } : null,
          };
        }).filter(d => d.profile !== null) as (DoctorProfile & { profile: Profile })[] || [];

        setDoctors(doctorsWithProfiles);
      } catch (error) {
        console.error("Error fetching public doctors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return { doctors, loading };
}

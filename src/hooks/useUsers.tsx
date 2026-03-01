import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

export interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
  account_status: string | null;
  profession: string | null;
  primary_specialty: string | null;
  additional_specialties: string | null;
  postal_code: string | null;
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (profilesError) {
      logger.error("Error fetching profiles:", profilesError);
      toast.error("Failed to load users");
      setLoading(false);
      return;
    }

    // Fetch all user roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*");

    if (rolesError) {
      logger.error("Error fetching roles:", rolesError);
    }

    // Map profiles with their roles
    const usersWithRoles: UserWithRole[] = (profiles || []).map((profile) => {
      const userRoles = (roles || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role);

      return {
        id: profile.id,
        user_id: profile.user_id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        roles: userRoles,
        account_status: profile.account_status,
        profession: profile.profession,
        primary_specialty: profile.primary_specialty,
        additional_specialties: profile.additional_specialties,
        postal_code: profile.postal_code,
      };
    });

    setUsers(usersWithRoles);
    setLoading(false);
  }

  async function assignRole(userId: string, role: "admin" | "moderator" | "reviewer" | "user") {
    const { error } = await supabase
      .from("user_roles")
      .insert([{ user_id: userId, role }]);

    if (error) {
      if (error.code === "23505") {
        toast.error("User already has this role");
      } else {
        logger.error("Error assigning role:", error);
        toast.error("Failed to assign role");
      }
      return false;
    }

    toast.success("Role assigned successfully");
    await fetchUsers();
    return true;
  }

  async function removeRole(userId: string, role: "admin" | "moderator" | "reviewer" | "user") {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);

    if (error) {
      logger.error("Error removing role:", error);
      toast.error("Failed to remove role");
      return false;
    }

    toast.success("Role removed successfully");
    await fetchUsers();
    return true;
  }

  async function updateAccountStatus(userId: string, status: "verified" | "unverified" | "suspended") {
    const { error } = await supabase
      .from("profiles")
      .update({ account_status: status })
      .eq("user_id", userId);

    if (error) {
      logger.error("Error updating account status:", error);
      toast.error("Failed to update account status");
      return false;
    }

    toast.success(`Account ${status} successfully`);
    await fetchUsers();
    return true;
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    refetch: fetchUsers,
    assignRole,
    removeRole,
    updateAccountStatus,
  };
}

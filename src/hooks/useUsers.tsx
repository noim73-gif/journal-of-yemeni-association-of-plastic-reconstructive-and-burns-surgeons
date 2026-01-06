import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UserWithRole {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
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
      console.error("Error fetching profiles:", profilesError);
      toast.error("Failed to load users");
      setLoading(false);
      return;
    }

    // Fetch all user roles
    const { data: roles, error: rolesError } = await supabase
      .from("user_roles")
      .select("*");

    if (rolesError) {
      console.error("Error fetching roles:", rolesError);
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
      };
    });

    setUsers(usersWithRoles);
    setLoading(false);
  }

  async function assignRole(userId: string, role: "admin" | "moderator" | "user") {
    const { error } = await supabase
      .from("user_roles")
      .insert([{ user_id: userId, role }]);

    if (error) {
      if (error.code === "23505") {
        toast.error("User already has this role");
      } else {
        console.error("Error assigning role:", error);
        toast.error("Failed to assign role");
      }
      return false;
    }

    toast.success("Role assigned successfully");
    await fetchUsers();
    return true;
  }

  async function removeRole(userId: string, role: "admin" | "moderator" | "user") {
    const { error } = await supabase
      .from("user_roles")
      .delete()
      .eq("user_id", userId)
      .eq("role", role);

    if (error) {
      console.error("Error removing role:", error);
      toast.error("Failed to remove role");
      return false;
    }

    toast.success("Role removed successfully");
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
  };
}

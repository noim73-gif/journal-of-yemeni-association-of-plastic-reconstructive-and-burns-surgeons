import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type BoardMemberRole = "editor_in_chief" | "associate_editor" | "board_member" | "international_advisor";

export interface BoardMember {
  id: string;
  name: string;
  role: BoardMemberRole;
  title: string | null;
  affiliation: string | null;
  specialty: string | null;
  email: string | null;
  orcid_id: string | null;
  photo_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BoardMemberInput {
  name: string;
  role: BoardMemberRole;
  title?: string | null;
  affiliation?: string | null;
  specialty?: string | null;
  email?: string | null;
  orcid_id?: string | null;
  photo_url?: string | null;
  display_order?: number;
  is_active?: boolean;
}

export function useEditorialBoard() {
  return useQuery({
    queryKey: ["editorial-board"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_board_members")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as BoardMember[];
    },
  });
}

export function useEditorialBoardAdmin() {
  return useQuery({
    queryKey: ["editorial-board-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("editorial_board_members")
        .select("*")
        .order("role")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as BoardMember[];
    },
  });
}

export function useCreateBoardMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (member: BoardMemberInput) => {
      const { data, error } = await supabase
        .from("editorial_board_members")
        .insert(member)
        .select()
        .single();

      if (error) throw error;
      return data as BoardMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorial-board"] });
      queryClient.invalidateQueries({ queryKey: ["editorial-board-admin"] });
      toast.success("Board member added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add board member: " + error.message);
    },
  });
}

export function useUpdateBoardMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<BoardMember> & { id: string }) => {
      const { data, error } = await supabase
        .from("editorial_board_members")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as BoardMember;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorial-board"] });
      queryClient.invalidateQueries({ queryKey: ["editorial-board-admin"] });
      toast.success("Board member updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update board member: " + error.message);
    },
  });
}

export function useDeleteBoardMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("editorial_board_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["editorial-board"] });
      queryClient.invalidateQueries({ queryKey: ["editorial-board-admin"] });
      toast.success("Board member deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete board member: " + error.message);
    },
  });
}

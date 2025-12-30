import { useCallback, useEffect, useState } from "react";

import { toast } from "sonner";

import { supabase } from "@/lib/supabase.client";
import { useAuthStore } from "@/stores/auth-store";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  website: string | null;
  updated_at: string | null;
}

export function useProfile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Create default profile
  const createDefaultProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          username: null,
          full_name: null,
          avatar_url: null,
          website: null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Failed to create default profile:", err);
      return null;
    }
  }, []);

  // Fetch profile
  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile doesn't exist, create default one
          const newProfile = await createDefaultProfile(user.id);
          if (newProfile) setProfile(newProfile);
        } else {
          toast.error("Failed to load profile");
          console.error(error);
        }
      } else {
        setProfile(data);
      }
    } catch (err) {
      toast.error("Failed to load profile");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, createDefaultProfile]);

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user?.id) return;

    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast.success("Profile updated successfully!");
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(errorMessage);
      console.error(err);
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    updating,
    updateProfile,
    refetch: fetchProfile,
  };
}

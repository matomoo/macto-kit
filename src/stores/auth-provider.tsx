"use client";

import { useEffect } from "react";

import { supabase } from "@/lib/supabase.client";
import { useAuthStore } from "@/stores/auth-store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { initializeAuth, hydrated } = useAuthStore();

  useEffect(() => {
    // Don't do anything until Zustand has hydrated from localStorage
    if (!hydrated) return;

    let mounted = true;

    // Initialize auth on mount (after hydration)
    // This respects persisted state and only validates if needed
    const init = async () => {
      if (!mounted) return;
      await initializeAuth();
    };

    init();

    // Subscribe to Supabase auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event) => {
      if (!mounted) return;

      // Only reinitialize on explicit sign in/out events
      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        await initializeAuth();
      }
    });

    // Cleanup
    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [initializeAuth, hydrated]);

  return children;
}

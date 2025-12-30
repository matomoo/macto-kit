import { create } from "zustand";
import { persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase.client";

export interface User {
  id: string;
  email: string;
  user_metadata?: Record<string, any>;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            set({ error: error.message, loading: false });
            throw error;
          }

          if (data.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                user_metadata: data.user.user_metadata,
              },
              isAuthenticated: true,
              loading: false,
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Login failed";
          set({ error: errorMessage, loading: false, isAuthenticated: false });
          throw err;
        }
      },

      register: async (email: string, password: string) => {
        set({ loading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) {
            set({ error: error.message, loading: false });
            throw error;
          }

          if (data.user) {
            set({
              user: {
                id: data.user.id,
                email: data.user.email!,
                user_metadata: data.user.user_metadata,
              },
              isAuthenticated: true,
              loading: false,
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Registration failed";
          set({ error: errorMessage, loading: false, isAuthenticated: false });
          throw err;
        }
      },

      logout: async () => {
        set({ loading: true, error: null });
        try {
          const { error } = await supabase.auth.signOut();

          if (error) {
            set({ error: error.message, loading: false });
            throw error;
          }

          set({ user: null, isAuthenticated: false, loading: false });
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Logout failed";
          set({ error: errorMessage, loading: false });
          throw err;
        }
      },

      checkAuth: async () => {
        set({ loading: true });
        try {
          const { data } = await supabase.auth.getSession();

          if (data.session?.user) {
            set({
              user: {
                id: data.session.user.id,
                email: data.session.user.email!,
                user_metadata: data.session.user.user_metadata,
              },
              isAuthenticated: true,
              loading: false,
            });
          } else {
            set({ user: null, isAuthenticated: false, loading: false });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Auth check failed";
          set({ error: errorMessage, loading: false, isAuthenticated: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

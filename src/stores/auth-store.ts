/** biome-ignore-all assist/source/organizeImports: <will fix later> */
/** biome-ignore-all lint/suspicious/noExplicitAny: <will fix later> */
import { create } from "zustand";
import { persist } from "zustand/middleware";

import { supabase } from "@/lib/supabase.client";
import {
  setAuthCookie,
  setUserCookie,
  deleteAuthCookie,
  deleteUserCookie,
  getAuthCookie,
  getUserCookie,
  deleteSessionCookie,
} from "@/lib/cookie.client";

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
  sessionToken: string | null;
  hydrated: boolean;

  // Auth actions
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearError: () => void;
  restoreFromCookie: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      sessionToken: null,
      hydrated: false,

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

          if (data.user && data.session && data.user.email) {
            const userData: User = {
              id: data.user.id,
              email: data.user.email,
              user_metadata: data.user.user_metadata,
            };

            // Store in cookies
            setAuthCookie(data.session.access_token, 7);
            setUserCookie(userData, 7);

            set({
              user: userData,
              sessionToken: data.session.access_token,
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

          if (data.user && data.session && data.user.email) {
            const userData: User = {
              id: data.user.id,
              email: data.user.email,
              user_metadata: data.user.user_metadata,
            };

            // Store in cookies
            setAuthCookie(data.session.access_token, 7);
            setUserCookie(userData, 7);

            set({
              user: userData,
              sessionToken: data.session.access_token,
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

          // Clear cookies
          deleteAuthCookie();
          deleteUserCookie();
          deleteSessionCookie();

          set({
            user: null,
            sessionToken: null,
            isAuthenticated: false,
            loading: false,
          });
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

          if (data.session?.user?.email) {
            const userData: User = {
              id: data.session.user.id,
              email: data.session.user.email,
              user_metadata: data.session.user.user_metadata,
            };

            // Update cookies
            setAuthCookie(data.session.access_token, 7);
            setUserCookie(userData, 7);

            set({
              user: userData,
              sessionToken: data.session.access_token,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            set({
              user: null,
              sessionToken: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Auth check failed";
          set({ error: errorMessage, loading: false, isAuthenticated: false });
        }
      },

      restoreFromCookie: () => {
        // Don't set loading: false here - let checkAuth() handle final loading state
        // This prevents race conditions where we restore from cookie but Supabase session has expired
        try {
          const user = getUserCookie();
          const token = getAuthCookie();

          if (user && token) {
            // Restore from cookie without changing loading state
            // checkAuth() will validate the session and set final state
            set({
              user,
              sessionToken: token,
              isAuthenticated: true,
            });
          }
        } catch (err) {
          console.error("Failed to restore from cookie:", err);
        }
      },

      initializeAuth: async () => {
        // This is called after Zustand persist hydration
        // It validates the persisted auth state
        set({ loading: true });
        try {
          // First check if we have persisted auth data
          const state = useAuthStore.getState();
          if (state.isAuthenticated && state.sessionToken) {
            // We have persisted auth state - just mark as loaded
            // Trust the persisted state unless Supabase explicitly says otherwise
            set({ loading: false });
            return;
          }

          // No persisted auth state, check with Supabase
          const { data } = await supabase.auth.getSession();

          if (data.session?.user?.email) {
            const userData: User = {
              id: data.session.user.id,
              email: data.session.user.email,
              user_metadata: data.session.user.user_metadata,
            };

            setAuthCookie(data.session.access_token, 7);
            setUserCookie(userData, 7);

            set({
              user: userData,
              sessionToken: data.session.access_token,
              isAuthenticated: true,
              loading: false,
            });
          } else {
            set({
              user: null,
              sessionToken: null,
              isAuthenticated: false,
              loading: false,
            });
          }
        } catch (err) {
          set({ loading: false });
          console.error("Auth initialization failed:", err);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        sessionToken: state.sessionToken,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark as hydrated once persist middleware has loaded data from storage
        if (state) {
          state.hydrated = true;
        }
      },
    },
  ),
);

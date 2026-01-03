import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

/**
 * Hook to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, loading, hydrated } = useAuthStore();

  useEffect(() => {
    // Wait for Zustand to hydrate from localStorage
    if (!hydrated) return;

    // Don't redirect while checking auth
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/auth/v1/login");
    }
  }, [isAuthenticated, loading, hydrated, router]);

  return { isAuthenticated, loading };
}

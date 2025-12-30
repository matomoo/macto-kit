import { useEffect } from "react";

import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

/**
 * Hook to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    // Don't redirect while checking auth
    if (loading) return;

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.replace("/auth/v1/login");
    }
  }, [isAuthenticated, loading, router]);

  return { isAuthenticated, loading };
}

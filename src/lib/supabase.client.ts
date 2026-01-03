import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "-";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "-";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic session persistence in localStorage
    persistSession: true,
    // Store session data in localStorage for automatic recovery
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
    // Auto-refresh session to keep it valid
    autoRefreshToken: true,
    // Detect session changes from tabs
    detectSessionInUrl: true,
  },
});

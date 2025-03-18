import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Add fallback for development or if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase URL or Anon Key is missing. Please check your environment variables.",
  );
}

export const supabase = createClient<Database>(
  supabaseUrl || "https://your-project-url.supabase.co",
  supabaseAnonKey || "your-anon-key-placeholder",
);

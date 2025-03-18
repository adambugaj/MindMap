import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = "https://hylkeiigpilltfwlnrcg.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh5bGtlaWlncGlsbHRmd2xucmNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMTcxMDMsImV4cCI6MjA1Nzc5MzEwM30.y21GkS4rSaja6PQO81EZRY9LjyX0a3Gq81Gt4nLgOVg";

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

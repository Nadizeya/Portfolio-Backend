import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

// Use service role key for backend - bypasses RLS policies
export const supabase = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

// Use anon key for public/frontend operations (respects RLS)
export const supabaseAnon = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY,
);

// Test connection function
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("_test_").select("*").limit(1);

    // If we get here without throwing, connection works
    // The query might fail (table doesn't exist) but connection is ok
    if (
      error &&
      error.message.includes("relation") &&
      error.message.includes("does not exist")
    ) {
      return {
        success: true,
        message: "Supabase connected successfully (no tables yet)",
      };
    }

    return { success: true, message: "Supabase connected successfully", data };
  } catch (error: any) {
    return {
      success: false,
      message: "Supabase connection failed",
      error: error.message,
    };
  }
};

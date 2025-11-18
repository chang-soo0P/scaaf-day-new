// Conditional Supabase client - only create if env vars are available
let supabase: any = null;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    // Try to load Supabase only if package is installed
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { createClient } = require("@supabase/supabase-js");
      supabase = createClient(supabaseUrl, supabaseKey);
    } catch (requireError) {
      // Package not installed, supabase remains null
      if (process.env.NODE_ENV === "development") {
        console.warn("Supabase package not installed. Install with: pnpm add @supabase/supabase-js");
      }
    }
  }
} catch (error) {
  // Silently fail - supabase will be null
  if (process.env.NODE_ENV === "development") {
    console.warn("Supabase client initialization failed:", error);
  }
}

export { supabase };

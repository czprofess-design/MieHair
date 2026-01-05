import { createClient } from '@supabase/supabase-js';

// IMPORTANT: These credentials connect to the sample Supabase project.
// For a production app, replace them with your own project's URL and anon key.
// FIX: Explicitly typing the constants as `string` prevents TypeScript from inferring them as
// literal types, which caused errors in the comparisons on lines 11 and 12.
const supabaseUrl: string = 'https://xrnzsmjjbtclmkmrlfxj.supabase.co';
const supabaseAnonKey: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybnpzbWpqYnRjbG1rbXJsZnhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxOTE4OTQsImV4cCI6MjA3Nzc2Nzg5NH0.ZGlPVG9O11UcH9JqmVxgWRWIwL-OMN5d6IVgLCcYqhc';

// FIX: The original check used the actual credentials as placeholder values, preventing the app from running.
// This now checks against generic placeholder text, allowing the app to proceed with the credentials above.
export const isSupabaseConfigured =
  supabaseUrl !== 'https://your-project-id.supabase.co' &&
  supabaseAnonKey !== 'your-anon-key';

if (!isSupabaseConfigured) {
  console.warn(
    "Supabase is not configured. Please add your SUPABASE_URL and SUPABASE_ANON_KEY to lib/supabase.ts to enable authentication."
  );
}

// Initialize the Supabase client.
// FIX: Explicitly pass a `fetch` implementation to resolve `TypeError: Failed to fetch`
// errors that can occur in sandboxed browser environments.
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    // FIX: Add types for `fetch` arguments to resolve spread operator error.
    fetch: (...args: Parameters<typeof fetch>) => fetch(...args),
  },
});
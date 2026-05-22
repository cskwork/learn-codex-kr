"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (!url || !anonKey) return null;
  if (cached) return cached;
  cached = createClient(url, anonKey, {
    realtime: {
      params: { eventsPerSecond: 5 },
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey);
}

'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export function getSupabaseConfig() {
  return {
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
    isCustom: false,
    isOfflineMode: !supabaseUrl || !supabaseAnonKey,
  };
}

export const SUPABASE_URL = supabaseUrl;
export const SUPABASE_ANON_KEY = supabaseAnonKey;

export const supabase = createBrowserClient(supabaseUrl || 'http://127.0.0.1:54321', supabaseAnonKey || 'offline-placeholder-key', {
  db: { schema: 'fitness' },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

let endpointIsReachable: boolean | null = null;

export function getSupabaseReachableState() {
  return endpointIsReachable;
}

export function setSupabaseReachableState(reachable: boolean | null) {
  endpointIsReachable = reachable;
}

export async function checkSupabaseConnection(
  overrideUrl = supabaseUrl,
  overrideKey = supabaseAnonKey
): Promise<{
  connected: boolean;
  endpoint: string;
  isDomainError?: boolean;
  error?: string;
  tablesFound?: string[];
  statusText?: string;
}> {
  const targetUrl = overrideUrl.trim().replace(/\/+$/, '');
  const targetKey = overrideKey.trim();
  if (!targetUrl || !targetKey) {
    return { connected: false, endpoint: targetUrl, error: 'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    let response: Response;
    try {
      response = await fetch(`${targetUrl}/rest/v1/`, {
        headers: {
          apikey: targetKey,
          Authorization: `Bearer ${targetKey}`,
        },
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (response.ok || response.status === 404) {
      endpointIsReachable = true;
      return { connected: true, endpoint: targetUrl, tablesFound: ['fitness'], statusText: 'Connected & active' };
    }
    endpointIsReachable = false;
    return { connected: false, endpoint: targetUrl, error: `HTTP ${response.status}: ${response.statusText}` };
  } catch (error) {
    endpointIsReachable = false;
    const message = error instanceof Error ? error.message : String(error);
    const isDomainError = message.includes('Failed to fetch') || message.includes('ERR_NAME_NOT_RESOLVED') || message.includes('NetworkError') || message.includes('aborted');
    return {
      connected: false,
      endpoint: targetUrl,
      isDomainError,
      error: isDomainError
        ? `The Supabase endpoint "${targetUrl}" is unreachable. Check the URL and project status.`
        : message,
    };
  }
}

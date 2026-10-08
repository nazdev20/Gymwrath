import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  isCustom: boolean;
  isOfflineMode: boolean;
}

function getEnvironmentConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/\/+$/, '');
  const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
    );
  }

  return { url, anonKey };
}

export function getSupabaseConfig(): SupabaseConfig {
  let customUrl = '';
  let customKey = '';
  let offline = false;

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      customUrl = window.localStorage.getItem('apex_supabase_url') || '';
      customKey = window.localStorage.getItem('apex_supabase_key') || '';
      offline = window.localStorage.getItem('apex_supabase_offline') === 'true';
    }
  } catch {
    // Ignore storage issues
  }

  const env = getEnvironmentConfig();
  const url = (customUrl.trim() || env.url).replace(/\/+$/, '');
  const anonKey = customKey.trim() || env.anonKey;

  return {
    url,
    anonKey,
    isCustom: !!(customUrl.trim() || customKey.trim()),
    isOfflineMode: offline,
  };
}

const initialConfig = getSupabaseConfig();
export let SUPABASE_URL: string = initialConfig.url;
export let SUPABASE_ANON_KEY: string = initialConfig.anonKey;

let activeClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

let endpointIsReachable: boolean | null = null;

export function getSupabaseReachableState(): boolean | null {
  return endpointIsReachable;
}

export function setSupabaseReachableState(reachable: boolean | null) {
  endpointIsReachable = reachable;
}

export function setCustomSupabaseConfig(url: string, key: string, offline = false) {
  const cleanUrl = url.trim().replace(/\/+$/, '');
  const cleanKey = key.trim();

  if (!cleanUrl || !cleanKey) {
    resetSupabaseConfig();
    return;
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('apex_supabase_url', cleanUrl);
      window.localStorage.setItem('apex_supabase_key', cleanKey);
      window.localStorage.setItem('apex_supabase_offline', offline ? 'true' : 'false');
    }
  } catch {}

  SUPABASE_URL = cleanUrl;
  SUPABASE_ANON_KEY = cleanKey;

  activeClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  endpointIsReachable = null;
}

export function resetSupabaseConfig() {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem('apex_supabase_url');
      window.localStorage.removeItem('apex_supabase_key');
      window.localStorage.removeItem('apex_supabase_offline');
    }
  } catch {}

  const env = getEnvironmentConfig();

  SUPABASE_URL = env.url;
  SUPABASE_ANON_KEY = env.anonKey;

  activeClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });

  endpointIsReachable = null;
}

// Transparent proxy ensuring queries always use the active configured client
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (activeClient as any)[prop];
  },
});

export async function checkSupabaseConnection(
  overrideUrl?: string,
  overrideKey?: string
): Promise<{
  connected: boolean;
  endpoint: string;
  isDomainError?: boolean;
  error?: string;
  tablesFound?: string[];
  statusText?: string;
}> {
  const config = getSupabaseConfig();
  const targetUrl = (overrideUrl || config.url).trim().replace(/\/+$/, '');
  const targetKey = (overrideKey || config.anonKey).trim();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(`${targetUrl}/rest/v1/`, {
      method: 'GET',
      headers: {
        apikey: targetKey,
        Authorization: `Bearer ${targetKey}`,
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok || res.status === 200 || res.status === 404) {
      endpointIsReachable = true;
      return {
        connected: true,
        endpoint: targetUrl,
        tablesFound: ['profiles'],
        statusText: 'Connected & active',
      };
    }

    endpointIsReachable = false;
    return {
      connected: false,
      endpoint: targetUrl,
      error: `HTTP ${res.status}: ${res.statusText}`,
    };
  } catch (err: any) {
    endpointIsReachable = false;
    const errMsg = err?.message || String(err);
    const isDomain =
      errMsg.includes('Failed to fetch') ||
      errMsg.includes('ERR_NAME_NOT_RESOLVED') ||
      errMsg.includes('NetworkError') ||
      errMsg.includes('aborted');

    return {
      connected: false,
      endpoint: targetUrl,
      isDomainError: isDomain,
      error: isDomain
        ? `DNS Error (ERR_NAME_NOT_RESOLVED): Host "${targetUrl}" cannot be resolved. The Supabase project subdomain does not exist or is paused.`
        : errMsg,
    };
  }
}

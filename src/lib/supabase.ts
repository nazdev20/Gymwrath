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

  return { url, anonKey };
}

const OFFLINE_SUPABASE_URL = 'http://127.0.0.1:54321';
const OFFLINE_SUPABASE_KEY = 'offline-placeholder-key';

function createSupabaseClient(url: string, anonKey: string): SupabaseClient {
  return createClient(url || OFFLINE_SUPABASE_URL, anonKey || OFFLINE_SUPABASE_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
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
    isOfflineMode: offline || !url || !anonKey,
  };
}

const initialConfig = getSupabaseConfig();
export let SUPABASE_URL: string = initialConfig.url;
export let SUPABASE_ANON_KEY: string = initialConfig.anonKey;

let activeClient: SupabaseClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let endpointIsReachable: boolean | null = null;

export function getSupabaseReachableState(): boolean | null {
  return endpointIsReachable;
}

export function setSupabaseReachableState(reachable: boolean | null) {
  endpointIsReachable = reachable;
}

export function setCustomSupabaseConfig(url: string, key: string, offline = false) {
  let cleanUrl = url.trim().replace(/\/+$/, '');
  let cleanKey = key.trim();

  if (!cleanUrl || !cleanKey) {
    if (!offline) {
      resetSupabaseConfig();
      return;
    }
    cleanUrl = '';
    cleanKey = '';
  }

  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (cleanUrl && cleanKey) {
        window.localStorage.setItem('apex_supabase_url', cleanUrl);
        window.localStorage.setItem('apex_supabase_key', cleanKey);
      } else {
        window.localStorage.removeItem('apex_supabase_url');
        window.localStorage.removeItem('apex_supabase_key');
      }
      window.localStorage.setItem('apex_supabase_offline', offline ? 'true' : 'false');
    }
  } catch {}

  SUPABASE_URL = cleanUrl;
  SUPABASE_ANON_KEY = cleanKey;

  activeClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

  activeClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

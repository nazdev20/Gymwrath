'use client';

import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection, getSupabaseConfig } from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import { X, Server, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const { loadFromSupabase, supabaseAuthUserId } = useApp();
  const [isTesting, setIsTesting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const config = getSupabaseConfig();

  useEffect(() => {
    if (isOpen) setResult(null);
  }, [isOpen]);

  if (!isOpen) return null;

  const testConnection = async () => {
    setIsTesting(true);
    setResult(null);
    const connection = await checkSupabaseConnection();
    setResult({
      success: connection.connected,
      message: connection.connected ? `Connected to ${connection.endpoint}.` : connection.error || 'Connection failed.'
    });
    if (connection.connected && supabaseAuthUserId) await loadFromSupabase(supabaseAuthUserId);
    setIsTesting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <section role="dialog" aria-modal="true" aria-labelledby="supabase-config-title" className="w-full max-w-xl space-y-5 rounded-3xl border border-slate-800 bg-slate-900 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <Server className="h-6 w-6 text-emerald-400" />
            <div>
              <h2 id="supabase-config-title" className="font-bold">Supabase Environment</h2>
              <p className="text-xs text-slate-400">Credentials are supplied by the server environment, not stored in browser storage.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm">
          <p><span className="text-slate-400">Project URL:</span> <code className="break-all text-emerald-300">{config.url || 'Not configured'}</code></p>
          <p><span className="text-slate-400">Public anon key:</span> {config.anonKey ? 'Configured' : 'Not configured'}</p>
          <p><span className="text-slate-400">Application schema:</span> <code className="text-emerald-300">fitness</code></p>
        </div>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs leading-relaxed text-slate-300">
          Set <code className="text-amber-300">NEXT_PUBLIC_SUPABASE_URL</code>, <code className="text-amber-300">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, and the server-only <code className="text-amber-300">SUPABASE_SERVICE_ROLE_KEY</code> in the deployment environment. Expose the <code className="text-amber-300">fitness</code> schema in Supabase API settings and apply the latest SQL shown in the Database Schema view; it refreshes PostgREST's schema cache. Never place the service-role key in a public environment variable.
        </div>

        {result && (
          <p role={result.success ? 'status' : 'alert'} className={`flex items-start gap-2 rounded-xl border p-3 text-xs ${result.success ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/30 bg-rose-500/10 text-rose-300'}`}>
            {result.success ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
            {result.message}
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800">Close</button>
          <button type="button" onClick={() => void testConnection()} disabled={isTesting} className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${isTesting ? 'animate-spin' : ''}`} />
            {isTesting ? 'Testing…' : 'Test connection'}
          </button>
        </div>
      </section>
    </div>
  );
};

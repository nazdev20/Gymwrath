import React, { useState, useEffect } from 'react';
import {
  getSupabaseConfig,
  setCustomSupabaseConfig,
  resetSupabaseConfig,
  checkSupabaseConnection,
} from '../../lib/supabase';
import { useApp } from '../../context/AppContext';
import {
  X,
  Server,
  Key,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  RotateCcw,
  Zap,
  Info,
  Check,
  Copy
} from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const { loadFromSupabase } = useApp();

  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    isDomainError?: boolean;
  }>({
    tested: false,
    success: false,
    message: '',
  });
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setIsOffline(config.isOfflineMode);
      setTestResult({ tested: false, success: false, message: '' });
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async (testUrl = url, testKey = anonKey) => {
    setIsTesting(true);
    setTestResult({ tested: false, success: false, message: '' });

    const res = await checkSupabaseConnection(testUrl, testKey);
    setIsTesting(false);
    setTestResult({
      tested: true,
      success: res.connected,
      message: res.connected
        ? `Successfully connected to Supabase REST API at ${res.endpoint}!`
        : res.error || 'Failed to connect to Supabase endpoint.',
      isDomainError: res.isDomainError,
    });
  };

  const handleSave = async () => {
    setCustomSupabaseConfig(url, anonKey, isOffline);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);

    if (!isOffline) {
      await loadFromSupabase();
    }
    onClose();
  };

  const handleReset = () => {
    resetSupabaseConfig();
    const config = getSupabaseConfig();
    setUrl(config.url);
    setAnonKey(config.anonKey);
    setIsOffline(false);
    setTestResult({ tested: false, success: false, message: '' });
  };

  const handleSetOffline = async () => {
    setIsOffline(true);
    setCustomSupabaseConfig(url, anonKey, true);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-2xl animate-in zoom-in-95 duration-150 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Supabase Credentials & Connection
              </h3>
              <p className="text-xs text-slate-400">
                Configure your active Supabase PostgreSQL project URL and API key
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* DNS Warning Banner if previous URL failed */}
        {testResult.tested && !testResult.success && testResult.isDomainError && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-amber-200">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Domain Not Resolved (ERR_NAME_NOT_RESOLVED)
            </div>
            <p className="text-slate-300 leading-relaxed">
              The Supabase project domain <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-300 font-mono">{url}</code> does not exist on the public Internet.
            </p>
            <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/20 text-[11px] text-slate-300 space-y-1">
              <p className="font-semibold text-amber-200">How to fix:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Log in to your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-0.5">Supabase Dashboard <ExternalLink className="w-2.5 h-2.5" /></a>.</li>
                <li>Ensure your project is unpaused / active.</li>
                <li>Go to <strong>Project Settings → API</strong> and copy your exact <strong>Project URL</strong> and <strong>anon public API key</strong>.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Form Controls */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Supabase Project URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://your-project-ref.supabase.co"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Standard format: <code className="text-slate-400 font-mono">https://[20-char-project-ref].supabase.co</code>
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Anon / Publishable API Key
            </label>
            <div className="relative">
              <textarea
                value={anonKey}
                onChange={e => setAnonKey(e.target.value)}
                rows={2}
                placeholder="eyJhbGciOi... or sb_publishable_..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Found under Supabase Dashboard → Project Settings → API → anon/public key.
            </p>
          </div>

          {/* Test Status Feedback */}
          {testResult.tested && (
            <div
              className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              )}
              <div className="flex-1 text-[11px] leading-relaxed break-words font-mono">
                {testResult.message}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              title="Reset to default environment credentials"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-400 hover:text-slate-200 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <button
              type="button"
              onClick={() => handleTest()}
              disabled={isTesting || !url.trim()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1.5 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-emerald-400' : ''}`} />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSetOffline}
              title="Use local persistent storage without making network calls to Supabase"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              Offline Mode
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              {isSaved ? 'Saved & Applied!' : 'Save & Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

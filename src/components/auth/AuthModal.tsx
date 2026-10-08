'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UserPlus, LogIn } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithSupabase, signUpWithSupabase } = useApp();
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [goals, setGoals] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const result = mode === 'sign-in'
        ? await signInWithSupabase(email.trim(), password)
        : await signUpWithSupabase(name.trim(), email.trim(), password, goals.trim());
      if (!result.success) {
        setError(result.error || 'Authentication failed.');
      } else if (result.requiresEmailConfirmation) {
        setMessage('Account created. Check your email to confirm the address, then sign in.');
      } else {
        setPassword('');
        onClose();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-4 text-white shadow-2xl sm:p-6">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close authentication dialog"
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            {mode === 'sign-in' ? <LogIn className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
          </div>
          <div>
            <h2 className="text-lg font-bold">{mode === 'sign-in' ? 'Sign in to GymWrath' : 'Create a client account'}</h2>
            <p className="text-xs text-slate-400">
              {mode === 'sign-in' ? 'Your account is secured by Supabase Auth.' : 'Coach and admin accounts are created by an administrator.'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'sign-up' && (
            <>
              <label className="block text-xs font-medium text-slate-300">
                Full name
                <input
                  type="text"
                  autoComplete="name"
                  required
                  maxLength={150}
                  value={name}
                  onChange={event => setName(event.target.value)}
                  className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="block text-xs font-medium text-slate-300">
                Goals or notes (optional)
                <textarea
                  rows={2}
                  maxLength={1000}
                  value={goals}
                  onChange={event => setGoals(event.target.value)}
                  className="mt-1 block w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                />
              </label>
            </>
          )}
          <label className="block text-xs font-medium text-slate-300">
            Email address
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </label>
          <label className="block text-xs font-medium text-slate-300">
            Password
            <input
              type="password"
              autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
              minLength={8}
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-1 block w-full rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
          </label>

          {error && <p role="alert" className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{error}</p>}
          {message && <p role="status" className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">{message}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-wait disabled:opacity-60"
          >
            {mode === 'sign-in' ? <LogIn className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
            {isSubmitting ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create client account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in');
            setError(null);
            setMessage(null);
          }}
          className="mt-4 w-full text-center text-xs text-slate-400 hover:text-white"
        >
          {mode === 'sign-in' ? 'Need an account? Register as a client' : 'Already registered? Sign in'}
        </button>
      </div>
    </div>
  );
};

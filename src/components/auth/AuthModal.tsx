import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { X, UserPlus, Shield, Dumbbell, User, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { registerUser, switchUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const [goals, setGoals] = useState('');
  const [submittedUser, setSubmittedUser] = useState<ReturnType<typeof registerUser> | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const created = registerUser(name.trim(), email.trim(), role, goals.trim());
    setSubmittedUser(created);
  };

  const handleDone = () => {
    if (submittedUser) {
      switchUser(submittedUser.id);
    }
    setSubmittedUser(null);
    setName('');
    setEmail('');
    setGoals('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedUser ? (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Create New Account</h3>
                <p className="text-xs text-slate-400">Register as a Client, Coach, or Admin</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                  Select Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('client')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      role === 'client'
                        ? 'bg-blue-500/15 border-blue-500 text-blue-400'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <User className="w-4 h-4" /> Client
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('coach')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      role === 'coach'
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-400'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Dumbbell className="w-4 h-4" /> Coach
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                      role === 'admin'
                        ? 'bg-purple-500/15 border-purple-500 text-purple-400'
                        : 'border-slate-800 bg-slate-850 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Shield className="w-4 h-4" /> Admin
                  </button>
                </div>
                {role === 'client' && (
                  <p className="text-[11px] text-amber-400/90 mt-1.5 flex items-center gap-1">
                    * New clients start in <span className="font-semibold underline">Pending</span> status awaiting coach assignment.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jordan.hayes@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>

              {role === 'client' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Primary Goals / Notes</label>
                  <textarea
                    rows={2}
                    value={goals}
                    onChange={e => setGoals(e.target.value)}
                    placeholder="e.g. Hypertrophy, 10k steps daily, fat loss..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <UserPlus className="w-4 h-4" /> Create Account
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Account Created Successfully!</h3>
              <p className="text-xs text-slate-400 mt-1">
                {submittedUser.role === 'client'
                  ? 'Your account has been created with status "PENDING". Admin / Coach can now approve your profile and assign programming.'
                  : 'Account is active and ready to use.'}
              </p>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-750 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Name:</span>
                <span className="text-white font-medium">{submittedUser.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Role:</span>
                <span className="capitalize font-semibold text-emerald-400">{submittedUser.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="uppercase font-semibold text-amber-400">{submittedUser.status}</span>
              </div>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Switch to New Account Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Users,
  Dumbbell,
  Utensils,
  CheckCircle,
  AlertTriangle,
  UserPlus,
  Search,
  Check,
  X,
  UserCheck,
  Ban,
  ArrowRight
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    allProfiles,
    exercises,
    foods,
    approveUser,
    suspendUser,
    activateUser,
    assignCoach,
    setActiveView,
    loadFromSupabase
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'client' | 'coach' | 'admin'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'active' | 'suspended'>('all');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'client' | 'coach'>('client');
  const [newUserGoals, setNewUserGoals] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [userCreationError, setUserCreationError] = useState<string | null>(null);
  const [userCreationMessage, setUserCreationMessage] = useState<string | null>(null);

  // Approval modal state
  const [approvingUserId, setApprovingUserId] = useState<string | null>(null);
  const [selectedCoachId, setSelectedCoachId] = useState<string>('');

  const coaches = allProfiles.filter(p => p.role === 'coach' && p.status === 'active');
  const pendingUsers = allProfiles.filter(p => p.status === 'pending');

  const filteredProfiles = allProfiles.filter(p => {
    const matchesSearch = p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.email.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const handleOpenApprove = (userId: string) => {
    setApprovingUserId(userId);
    if (coaches.length > 0) {
      setSelectedCoachId(coaches[0].id);
    }
  };

  const handleConfirmApprove = () => {
    if (approvingUserId && selectedCoachId) {
      approveUser(approvingUserId, selectedCoachId);
      setApprovingUserId(null);
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (isCreatingUser) return;
    setIsCreatingUser(true);
    setUserCreationError(null);
    setUserCreationMessage(null);
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
          goals: newUserGoals
        })
      });
      const result = await response.json() as { error?: string; message?: string };
      if (!response.ok) {
        setUserCreationError(result.error || 'The server could not create this account.');
        return;
      }
      const refreshed = await loadFromSupabase();
      if (!refreshed) {
        setUserCreationError('The account was created, but the user list could not be refreshed. Reload the page to verify it.');
        return;
      }
      setUserCreationMessage(result.message || 'Account created.');
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserGoals('');
    } catch (error) {
      setUserCreationError(error instanceof Error ? error.message : 'The server could not create this account.');
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Admin Header */}
      <div className="min-w-0 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="relative z-10 flex min-w-0 flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Platform Administration
              </span>
            </div>
            <h1 className="min-w-0 break-words text-xl sm:text-3xl leading-tight font-extrabold text-white tracking-tight">
              System Control & Account Oversight
            </h1>
            <p className="min-w-0 text-sm text-slate-400 mt-1 max-w-xl">
              Manage coach-client assignments, review pending registration requests, and oversee platform catalog invariants.
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row md:w-auto md:shrink-0">
            <button
              onClick={() => setActiveView('exercises')}
              className="min-w-0 justify-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Dumbbell className="w-4 h-4" /> Global Exercises
            </button>
            <button
              onClick={() => setActiveView('nutrition')}
              className="min-w-0 justify-center px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Utensils className="w-4 h-4" /> Food Catalog
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 min-[380px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{allProfiles.length}</div>
          <p className="text-xs text-slate-400 mt-1">Across all roles</p>
        </div>

        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingUsers.length}</div>
          <p className="text-xs text-slate-400 mt-1">Awaiting coach assignment</p>
        </div>

        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Coaches</span>
            <Dumbbell className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{coaches.length}</div>
          <p className="text-xs text-slate-400 mt-1">On platform</p>
        </div>

        <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Global Foods & Exercises</span>
            <Utensils className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{foods.length + exercises.length}</div>
          <p className="text-xs text-slate-400 mt-1">{exercises.length} ex • {foods.length} foods</p>
        </div>
      </div>

      <form onSubmit={handleCreateUser} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5">
        <div>
          <h2 className="text-base font-bold text-white">Create an application user</h2>
          <p className="text-xs text-slate-400">Creates a Supabase Auth account and linked profile. Administrator accounts can only be initialized through the protected setup endpoint.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <input required maxLength={150} value={newUserName} onChange={event => setNewUserName(event.target.value)} placeholder="Full name" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
          <input required type="email" value={newUserEmail} onChange={event => setNewUserEmail(event.target.value)} placeholder="Email address" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
          <input required type="password" minLength={8} value={newUserPassword} onChange={event => setNewUserPassword(event.target.value)} placeholder="Temporary password" className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
          <select value={newUserRole} onChange={event => setNewUserRole(event.target.value as 'client' | 'coach')} className="rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white">
            <option value="client">Client</option>
            <option value="coach">Coach</option>
          </select>
          <button type="submit" disabled={isCreatingUser} className="flex items-center justify-center gap-2 rounded-xl bg-purple-500 px-3 py-2 text-sm font-bold text-white hover:bg-purple-400 disabled:opacity-60">
            <UserPlus className="h-4 w-4" /> {isCreatingUser ? 'Creating…' : 'Create user'}
          </button>
        </div>
        {newUserRole === 'client' && (
          <input value={newUserGoals} onChange={event => setNewUserGoals(event.target.value)} maxLength={1000} placeholder="Client goals / notes (optional)" className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white" />
        )}
        {userCreationError && <p role="alert" className="text-xs text-rose-300">{userCreationError}</p>}
        {userCreationMessage && <p role="status" className="text-xs text-emerald-300">{userCreationMessage}</p>}
      </form>

      {/* User Management Table */}
      <div className="min-w-0 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">User Accounts & Access Control</h2>
            <p className="text-xs text-slate-400">Review user roles, approve new accounts, and assign coaching staff</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-44 sm:w-56"
              />
            </div>

            {/* Filter */}
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value as 'all' | 'client' | 'coach' | 'admin')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="coach">Coaches</option>
              <option value="client">Clients</option>
            </select>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-300 focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending Approval ({pendingUsers.length})</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-850/80 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">User Profile</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Account Status</th>
                <th className="px-5 py-3.5">Assigned Coach</th>
                <th className="px-5 py-3.5">Created Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProfiles.map(p => {
                const assignedCoach = allProfiles.find(c => c.id === p.assignedCoachId);

                return (
                  <tr key={p.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.avatarUrl || undefined}
                          alt={p.fullName}
                          className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-white">{p.fullName}</p>
                          <p className="text-xs text-slate-400">{p.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        p.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        p.role === 'coach' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {p.role}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        p.status === 'active' ? 'bg-emerald-500/15 text-emerald-400' :
                        p.status === 'pending' ? 'bg-amber-500/15 text-amber-400 animate-pulse' :
                        'bg-rose-500/15 text-rose-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs">
                      {p.role === 'client' ? (
                        assignedCoach ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-200">{assignedCoach.fullName}</span>
                          </div>
                        ) : (
                          <span className="text-amber-400 italic">Unassigned</span>
                        )
                      ) : (
                        <span className="text-slate-500">N/A</span>
                      )}
                    </td>

                    <td className="px-5 py-4 whitespace-nowrap text-xs text-slate-400 font-mono">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {p.status === 'pending' && (
                          <button
                            onClick={() => handleOpenApprove(p.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve & Assign
                          </button>
                        )}

                        {p.status === 'active' && p.role !== 'admin' && (
                          <button
                            onClick={() => suspendUser(p.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
                          >
                            Suspend
                          </button>
                        )}

                        {p.status === 'suspended' && (
                          <button
                            onClick={() => activateUser(p.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
                          >
                            Activate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Approval & Coach Assignment Modal */}
      {approvingUserId && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" /> Approve Client Account
              </h3>
              <button onClick={() => setApprovingUserId(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Select the primary coach to assign to this client upon approving their registration.
            </p>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Assign Primary Coach
              </label>
              <select
                value={selectedCoachId}
                onChange={e => setSelectedCoachId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-500"
              >
                {coaches.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-3 flex gap-2">
              <button
                onClick={() => setApprovingUserId(null)}
                className="flex-1 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmApprove}
                className="flex-1 py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
              >
                Confirm & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

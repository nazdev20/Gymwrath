import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHEMA_TABLES, FITNESS_SCHEMA_DDL_SQL } from '../../data/fitnessSchemaSql';
import { SupabaseService } from '../../services/supabaseService';
import { getSupabaseConfig } from '../../lib/supabase';
import { WorkflowVisualDiagram } from '../workflow/WorkflowVisualDiagram';
import { SupabaseConfigModal } from './SupabaseConfigModal';
import {
  Database,
  Server,
  Key,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Table as TableIcon,
  Search,
  Layers,
  ArrowRight,
  Shield,
  UploadCloud,
  FileCode2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download,
  GitBranch,
  UserCheck,
  Dumbbell,
  ClipboardCheck,
  MessageSquare,
  Activity,
  Flame,
  UserPlus,
  Settings,
  AlertTriangle
} from 'lucide-react';

export const DatabaseSchemaView: React.FC = () => {
  const { loadFromSupabase, isLoadingSupabase } = useApp();

  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'tables' | 'diagram' | 'sql' | 'status'>('diagram');
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number>(1);
  const [expandedTable, setExpandedTable] = useState<string | null>('profiles');
  const [isConfigModalOpen, setIsConfigModalOpen] = useState<boolean>(false);

  // Supabase Live Status State
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
    loading: boolean;
    isDomainError?: boolean;
  }>({
    tested: false,
    connected: false,
    message: '',
    loading: false
  });

  const [tableInspection, setTableInspection] = useState<{
    loading: boolean;
    data: { tableName: string; exists: boolean; count?: number; error?: string }[];
  }>({
    loading: false,
    data: []
  });

  const [syncState, setSyncState] = useState<{
    syncing: boolean;
    success?: boolean;
    logs: string[];
  }>({
    syncing: false,
    logs: []
  });

  const modules = [
    'all',
    'Users & Assignments',
    'Workout & Training',
    'Nutrition',
    'Check-Ins',
    'Progress',
    'Messaging',
    'Notifications & Settings'
  ];

  const handleTestConnection = async () => {
    setConnectionStatus(prev => ({ ...prev, loading: true }));
    const res = await SupabaseService.testConnection();
    setConnectionStatus({
      tested: true,
      connected: res.success,
      message: res.message,
      loading: false,
      isDomainError: res.isDomainError,
    });
  };

  const handleInspectTables = async () => {
    setTableInspection(prev => ({ ...prev, loading: true }));
    const res = await SupabaseService.inspectTables();
    setTableInspection({
      loading: false,
      data: res
    });
  };

  const handlePullFromSupabase = async () => {
    setSyncState({ syncing: true, logs: ['Fetching live records directly from Supabase tables...'] });
    const success = await loadFromSupabase();
    setSyncState({
      syncing: false,
      success,
      logs: success
        ? ['Successfully fetched all live records from Supabase tables!', 'Application state updated with live database rows.']
        : ['Queried Supabase endpoint. Tables are ready or currently awaiting rows.']
    });
    handleInspectTables();
  };

  useEffect(() => {
    handleTestConnection();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(FITNESS_SCHEMA_DDL_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const supabaseConfig = getSupabaseConfig();
  const supabaseUrl = supabaseConfig.url;
  const supabaseAnonKey = supabaseConfig.anonKey;

  const filteredTables = SCHEMA_TABLES.filter(table => {
    const matchesModule = selectedModule === 'all' || table.module === selectedModule;
    const matchesSearch =
      table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.columns.some(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Fitness Database & Supabase Schema</h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Live Supabase PostgreSQL database integration • No hardcoded mock datasets
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsConfigModalOpen(true)}
            title="View Supabase environment and setup requirements"
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-750 hover:border-emerald-500/40 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            Supabase Setup
          </button>

          <button
            onClick={handleTestConnection}
            disabled={connectionStatus.loading}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${connectionStatus.loading ? 'animate-spin text-emerald-400' : ''}`} />
            Test Supabase
          </button>
          
          <button
            onClick={handlePullFromSupabase}
            disabled={syncState.syncing || isLoadingSupabase}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Download className={`w-4 h-4 ${syncState.syncing || isLoadingSupabase ? 'animate-bounce' : ''}`} />
            {syncState.syncing || isLoadingSupabase ? 'Querying Database...' : 'Fetch Live DB Records'}
          </button>
        </div>
      </div>

      {/* Supabase Connection Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          {/* Endpoint Details */}
          <div className="space-y-1.5 lg:pr-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
                <Server className="w-4 h-4 text-emerald-400" /> Supabase REST Endpoint
              </div>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                Change
              </button>
            </div>
            <p className="font-mono text-xs text-slate-200 truncate bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-850">
              {supabaseUrl}/rest/v1/
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              {connectionStatus.loading ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  Testing...
                </span>
              ) : connectionStatus.connected ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Connected & Active
                </span>
              ) : supabaseConfig.isOfflineMode ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  Offline Mode (Local Storage)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {connectionStatus.isDomainError ? 'Domain Not Resolved' : 'Unreachable'}
                </span>
              )}
              <span className="text-[11px] text-slate-400">PostgreSQL Relational DB</span>
            </div>
          </div>

          {/* API Key */}
          <div className="space-y-1.5 pt-3 lg:pt-0 lg:px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
                <Key className="w-4 h-4 text-teal-400" /> Active Anon / Publishable Key
              </div>
              <button
                onClick={() => setIsConfigModalOpen(true)}
                className="text-[10px] text-emerald-400 hover:text-emerald-300 underline font-medium"
              >
                Edit
              </button>
            </div>
            <p className="font-mono text-xs text-slate-300 truncate bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-850">
              {supabaseAnonKey.slice(0, 18)}...{supabaseAnonKey.slice(-10)}
            </p>
            <p className="text-[11px] text-slate-400">
              {supabaseConfig.isCustom ? 'Using custom user-configured credentials' : 'Default environment credentials'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="space-y-1.5 pt-3 lg:pt-0 lg:pl-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400 tracking-wider">
              <Layers className="w-4 h-4 text-purple-400" /> ER Schema Coverage
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-mono font-extrabold text-white">{SCHEMA_TABLES.length}</span>
              <span className="text-xs text-slate-400">Relational Tables in 7 Domains</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Live REST Queries • Complete PostgreSQL DDL
            </p>
          </div>
        </div>

        {/* DNS / Connection Warning Banner */}
        {connectionStatus.tested && !connectionStatus.connected && !supabaseConfig.isOfflineMode && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Supabase Host Unreachable: {connectionStatus.isDomainError ? 'Domain Not Resolved (ERR_NAME_NOT_RESOLVED)' : 'Endpoint Inactive'}</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {connectionStatus.isDomainError
                  ? `DNS cannot find "${supabaseUrl}". Verify your Supabase Project Reference ID at supabase.com/dashboard.`
                  : connectionStatus.message}
              </p>
            </div>
            <button
              onClick={() => setIsConfigModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors shrink-0 text-xs flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Key className="w-3.5 h-3.5" />
              Configure Working Keys
            </button>
          </div>
        )}

        {/* Live sync logs if any */}
        {syncState.logs.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 pb-1.5 border-b border-slate-850 mb-1.5 text-[11px]">
              <span>Database Query Status</span>
              <span className={syncState.success ? 'text-emerald-400' : 'text-amber-400'}>
                {syncState.syncing ? 'Querying...' : syncState.success ? 'Connected' : 'Ready'}
              </span>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto text-slate-300">
              {syncState.logs.map((log, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">›</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'diagram'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> Role Workflow Diagram
          </button>
          <button
            onClick={() => setActiveTab('tables')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'tables'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" /> Interactive ER Tables ({SCHEMA_TABLES.length})
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sql'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode2 className="w-3.5 h-3.5" /> PostgreSQL DDL Script
          </button>
          <button
            onClick={() => {
              setActiveTab('status');
              if (tableInspection.data.length === 0) handleInspectTables();
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'status'
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" /> Live Supabase Inspector
          </button>
        </div>
      </div>

      {/* Tab Content: Role Workflow Diagram */}
      {activeTab === 'diagram' && (
        <WorkflowVisualDiagram />
      )}

      {/* Tab Content: Interactive Tables */}
      {activeTab === 'tables' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Module Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              {modules.map(mod => (
                <button
                  key={mod}
                  onClick={() => setSelectedModule(mod)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-colors ${
                    selectedModule === mod
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
                  }`}
                >
                  {mod === 'all' ? 'All Modules (7)' : mod}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search tables or columns..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Tables Accordion List */}
          <div className="space-y-3">
            {filteredTables.map(table => {
              const isExpanded = expandedTable === table.name;

              return (
                <div
                  key={table.name}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md"
                >
                  {/* Table Header */}
                  <button
                    onClick={() => setExpandedTable(isExpanded ? null : table.name)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-850/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono font-bold text-xs">
                        <TableIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-white">{table.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                            {table.module}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{table.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-slate-500">
                        {table.columns.length} columns
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Table Schema Details */}
                  {isExpanded && (
                    <div className="border-t border-slate-800 p-4 bg-slate-950/60">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                              <th className="pb-2 px-2">Column Name</th>
                              <th className="pb-2 px-2">Data Type</th>
                              <th className="pb-2 px-2">Key Constraint</th>
                              <th className="pb-2 px-2">Nullable</th>
                              <th className="pb-2 px-2">Description</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            {table.columns.map(col => (
                              <tr key={col.name} className="hover:bg-slate-900/50">
                                <td className="py-2.5 px-2 font-mono font-bold text-emerald-400">
                                  {col.name}
                                </td>
                                <td className="py-2.5 px-2 font-mono text-teal-300">
                                  {col.type}
                                </td>
                                <td className="py-2.5 px-2">
                                  {col.isPk && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                                      <Key className="w-3 h-3" /> PK (UUID)
                                    </span>
                                  )}
                                  {col.isFk && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-300 border border-blue-500/30">
                                      FK → {col.fkTarget}
                                    </span>
                                  )}
                                  {!col.isPk && !col.isFk && (
                                    <span className="text-slate-600 font-mono">-</span>
                                  )}
                                </td>
                                <td className="py-2.5 px-2 font-mono text-slate-400 text-[11px]">
                                  {col.nullable ? 'YES' : 'NO'}
                                </td>
                                <td className="py-2.5 px-2 text-slate-400">
                                  {col.description || '-'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Content: PostgreSQL DDL Script */}
      {activeTab === 'sql' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-slate-900 p-3 rounded-xl border border-slate-800">
            <div>
              <p className="text-xs font-bold text-white">Full PostgreSQL DDL Migration Script</p>
              <p className="text-[11px] text-slate-400">
                Run this in the Supabase SQL Editor to create the fitness schema, tables, constraints, and indexes. Then expose the fitness schema in Supabase API settings and configure access policies.
              </p>
            </div>
            <button
              onClick={handleCopySql}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copiedSql ? 'Copied SQL!' : 'Copy SQL Script'}
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed">
            <pre>{FITNESS_SCHEMA_DDL_SQL}</pre>
          </div>
        </div>
      )}

      {/* Tab Content: Live Supabase Inspector */}
      {activeTab === 'status' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Live schema inspection queried directly from Supabase endpoint: <span className="font-mono text-slate-200">{supabaseUrl}</span>
            </p>
            <button
              onClick={handleInspectTables}
              disabled={tableInspection.loading}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${tableInspection.loading ? 'animate-spin text-emerald-400' : ''}`} />
              Refresh Table Scan
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {tableInspection.data.map(item => (
              <div
                key={item.tableName}
                className={`p-3.5 rounded-xl border transition-all ${
                  item.exists
                    ? 'bg-slate-900 border-emerald-500/30'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white">{item.tableName}</span>
                  {item.exists ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                      Not Provisioned
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400">
                  {item.exists ? (
                    <span className="text-emerald-400 font-mono font-bold">{item.count ?? 0} records active</span>
                  ) : (
                    <span className="text-slate-500">Run SQL script in Supabase to provision table</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Supabase Credentials Modal */}
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          handleTestConnection();
        }}
      />
    </div>
  );
};

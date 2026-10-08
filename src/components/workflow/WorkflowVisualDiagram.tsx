import React, { useRef, useState } from 'react';
import { Download, Shield, Dumbbell, UserCheck, Activity, CheckCircle2, ArrowRight, Database, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

export const WorkflowVisualDiagram: React.FC = () => {
  const [zoom, setZoom] = useState<number>(1);
  const [downloading, setDownloading] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadAsPng = () => {
    if (!svgRef.current) return;
    setDownloading(true);

    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        // High resolution 2x scale
        canvas.width = 1600 * 2;
        canvas.height = 1050 * 2;
        const context = canvas.getContext('2d');
        if (context) {
          context.scale(2, 2);
          context.fillStyle = '#090d16';
          context.fillRect(0, 0, 1600, 1050);
          context.drawImage(image, 0, 0, 1600, 1050);
          
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = 'fitness_platform_workflow_diagram.png';
          downloadLink.href = pngUrl;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          window.URL.revokeObjectURL(blobURL);
        }
        setDownloading(false);
      };
      image.onerror = () => {
        setDownloading(false);
        // Fallback: download as SVG
        const downloadLink = document.createElement('a');
        downloadLink.download = 'fitness_platform_workflow_diagram.svg';
        downloadLink.href = blobURL;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
      image.src = blobURL;
    } catch (err) {
      console.error('Failed to export diagram image:', err);
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            End-to-End System Workflow Architecture
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Complete lifecycle map detailing role responsibilities and PostgreSQL database sync
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs font-mono px-2 text-slate-300 font-bold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.min(1.5, prev + 0.1))}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoom(1)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors text-xs font-medium"
              title="Reset Zoom"
            >
              Reset
            </button>
          </div>

          <button
            onClick={downloadAsPng}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            {downloading ? 'Generating PNG...' : 'Download Image (PNG)'}
          </button>
        </div>
      </div>

      {/* SVG Image Canvas Container */}
      <div className="w-full overflow-x-auto bg-slate-950 border border-slate-800/80 rounded-2xl p-2 sm:p-4 shadow-2xl">
        <div 
          style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', minWidth: '1200px' }}
          className="transition-transform duration-150"
        >
          <svg
            ref={svgRef}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1600 1050"
            width="1600"
            height="1050"
            className="w-full h-auto select-none rounded-xl"
            style={{ backgroundColor: '#090d16', fontFamily: 'system-ui, -apple-system, sans-serif' }}
          >
            <defs>
              {/* Gradients */}
              <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0b1120" />
                <stop offset="50%" stopColor="#080c18" />
                <stop offset="100%" stopColor="#04060d" />
              </linearGradient>

              <linearGradient id="clientGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="100%" stopColor="#38bdf8" />
              </linearGradient>

              <linearGradient id="coachGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>

              <linearGradient id="dbGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>

              {/* Arrow Markers */}
              <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,1 L10,5 L0,9 L3,5 Z" fill="#38bdf8" />
              </marker>
              <marker id="arrow-emerald" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,1 L10,5 L0,9 L3,5 Z" fill="#10b981" />
              </marker>
              <marker id="arrow-purple" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,1 L10,5 L0,9 L3,5 Z" fill="#a855f7" />
              </marker>
              <marker id="arrow-amber" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
                <path d="M0,1 L10,5 L0,9 L3,5 Z" fill="#f59e0b" />
              </marker>

              {/* Shadow Filter */}
              <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
              </filter>
            </defs>

            {/* Canvas Background */}
            <rect width="1600" height="1050" fill="url(#bgGrad)" />

            {/* Subtle Grid Pattern */}
            <g opacity="0.12">
              {Array.from({ length: 32 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 50} y1="0" x2={i * 50} y2="1050" stroke="#94a3b8" strokeWidth="1" />
              ))}
              {Array.from({ length: 21 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 50} x2="1600" y2={i * 50} stroke="#94a3b8" strokeWidth="1" />
              ))}
            </g>

            {/* Header Area */}
            <g transform="translate(60, 45)">
              <rect x="0" y="0" width="1480" height="75" rx="16" fill="#0f172a" stroke="#1e293b" strokeWidth="1.5" />
              <circle cx="45" cy="37.5" r="20" fill="#10b981" fillOpacity="0.2" />
              <path d="M38 37.5 L43 42.5 L52 32.5" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <text x="80" y="34" fill="#ffffff" fontSize="22" fontWeight="800">
                FITNESS COACHING PLATFORM - END-TO-END WORKFLOW DIAGRAM
              </text>
              <text x="80" y="55" fill="#94a3b8" fontSize="13" fontWeight="500">
                Multi-Role Operational Flow (Client, Coach, Admin) with PostgreSQL Data Sync Lifecycle
              </text>
              
              <rect x="1310" y="22" width="140" height="32" rx="8" fill="#1e293b" stroke="#334155" />
              <text x="1380" y="42" fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">
                LIVE PRODUCTION
              </text>
            </g>

            {/* 3 Main Role Columns / Swimlanes */}
            {/* Column 1: Client */}
            <g transform="translate(60, 140)">
              <rect x="0" y="0" width="460" height="850" rx="18" fill="#0c192c" fillOpacity="0.7" stroke="#0284c7" strokeWidth="2" strokeOpacity="0.4" />
              <rect x="0" y="0" width="460" height="56" rx="18" fill="url(#clientGrad)" />
              <text x="230" y="35" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" letterSpacing="1">
                🏃 CLIENT ROLE
              </text>
              <text x="230" y="85" fill="#7dd3fc" fontSize="12" fontWeight="600" textAnchor="middle">
                Execution, Logging & Biofeedback
              </text>

              {/* Client Node 1: Registration */}
              <g transform="translate(25, 110)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="120" rx="14" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
                <rect x="15" y="15" width="28" height="28" rx="8" fill="#0284c7" fillOpacity="0.2" />
                <text x="29" y="34" fill="#38bdf8" fontSize="14" fontWeight="800" textAnchor="middle">1</text>
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Account Self-Registration</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Enters fitness goals, baseline weight, height, & contact info.
                </text>
                <rect x="20" y="80" width="370" height="26" rx="6" fill="#022c44" stroke="#0369a1" strokeWidth="1" />
                <text x="30" y="97" fill="#7dd3fc" fontSize="11" fontWeight="600">
                  DB Table: <tspan fill="#38bdf8" fontWeight="700">profiles</tspan> (status: 'pending')
                </text>
              </g>

              {/* Client Node 2: Calendar & Targets */}
              <g transform="translate(25, 330)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="120" rx="14" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
                <rect x="15" y="15" width="28" height="28" rx="8" fill="#0284c7" fillOpacity="0.2" />
                <text x="29" y="34" fill="#38bdf8" fontSize="14" fontWeight="800" textAnchor="middle">4</text>
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Daily Plan & Macro Targets</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Views scheduled workout calendar and target Cal/P/C/F macros.
                </text>
                <rect x="20" y="80" width="370" height="26" rx="6" fill="#022c44" stroke="#0369a1" strokeWidth="1" />
                <text x="30" y="97" fill="#7dd3fc" fontSize="11" fontWeight="600">
                  DB: <tspan fill="#38bdf8" fontWeight="700">workout_assignments, nutrition_plans</tspan>
                </text>
              </g>

              {/* Client Node 3: Active Logging */}
              <g transform="translate(25, 490)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="125" rx="14" fill="#0f172a" stroke="#0284c7" strokeWidth="1.5" />
                <rect x="15" y="15" width="28" height="28" rx="8" fill="#0284c7" fillOpacity="0.2" />
                <text x="29" y="34" fill="#38bdf8" fontSize="14" fontWeight="800" textAnchor="middle">5</text>
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Active Workout & Step Logging</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Logs live sets, weights, reps, RPE, daily steps & consumed meals.
                </text>
                <rect x="20" y="85" width="370" height="26" rx="6" fill="#022c44" stroke="#0369a1" strokeWidth="1" />
                <text x="30" y="102" fill="#7dd3fc" fontSize="11" fontWeight="600">
                  DB: <tspan fill="#38bdf8" fontWeight="700">workout_completions, progress_records</tspan>
                </text>
              </g>

              {/* Client Node 4: Weekly Check-In */}
              <g transform="translate(25, 680)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="135" rx="14" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                <rect x="15" y="15" width="28" height="28" rx="8" fill="#f59e0b" fillOpacity="0.2" />
                <text x="29" y="34" fill="#fbbf24" fontSize="14" fontWeight="800" textAnchor="middle">6</text>
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Weekly Check-In Submission</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Submits weight, sleep, stress, energy, hunger & athlete notes.
                </text>
                <rect x="20" y="95" width="370" height="26" rx="6" fill="#451a03" stroke="#b45309" strokeWidth="1" />
                <text x="30" y="112" fill="#fcd34d" fontSize="11" fontWeight="600">
                  DB: <tspan fill="#f59e0b" fontWeight="700">check_ins</tspan> (status: 'submitted')
                </text>
              </g>
            </g>

            {/* Column 2: Coach */}
            <g transform="translate(570, 140)">
              <rect x="0" y="0" width="460" height="850" rx="18" fill="#061c16" fillOpacity="0.7" stroke="#059669" strokeWidth="2" strokeOpacity="0.4" />
              <rect x="0" y="0" width="460" height="56" rx="18" fill="url(#coachGrad)" />
              <text x="230" y="35" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" letterSpacing="1">
                🏋️ COACH ROLE
              </text>
              <text x="230" y="85" fill="#6ee7b7" fontSize="12" fontWeight="600" textAnchor="middle">
                Programming, Live Monitoring & Feedback
              </text>

              {/* Coach Node 1: Program Builder */}
              <g transform="translate(25, 230)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="135" rx="14" fill="#0f172a" stroke="#059669" strokeWidth="1.5" />
                <rect x="15" y="15" width="28" height="28" rx="8" fill="#059669" fillOpacity="0.2" />
                <text x="29" y="34" fill="#34d399" fontSize="14" fontWeight="800" textAnchor="middle">3</text>
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Training & Nutrition Programming</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Selects exercises, configures multi-week splits, sets macro goals.
                </text>
                <rect x="20" y="95" width="370" height="26" rx="6" fill="#064e3b" stroke="#047857" strokeWidth="1" />
                <text x="30" y="112" fill="#6ee7b7" fontSize="11" fontWeight="600">
                  DB: <tspan fill="#34d399" fontWeight="700">training_programs, nutrition_plans</tspan>
                </text>
              </g>

              {/* Coach Node 2: Live Adherence Feed */}
              <g transform="translate(25, 470)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="120" rx="14" fill="#0f172a" stroke="#059669" strokeWidth="1.5" />
                <circle cx="29" cy="29" r="14" fill="#10b981" fillOpacity="0.2" />
                <circle cx="29" cy="29" r="6" fill="#10b981" />
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Live Adherence & Compliance</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Real-time sync: receives completion alerts & workout logs.
                </text>
                <rect x="20" y="80" width="370" height="26" rx="6" fill="#064e3b" stroke="#047857" strokeWidth="1" />
                <text x="30" y="97" fill="#6ee7b7" fontSize="11" fontWeight="600">
                  Real-time compliance calculation & notifications
                </text>
              </g>

              {/* Coach Node 3: Check-In Review & Adjustment */}
              <g transform="translate(25, 680)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="135" rx="14" fill="#0f172a" stroke="#059669" strokeWidth="2" />
                <rect x="15" y="15" width="28" height="28" rx="8" fill="#059669" fillOpacity="0.2" />
                <text x="29" y="34" fill="#34d399" fontSize="14" fontWeight="800" textAnchor="middle">7</text>
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Check-In Review & Feedback</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Analyzes metrics, sends video/text feedback & updates next week.
                </text>
                <rect x="20" y="95" width="370" height="26" rx="6" fill="#064e3b" stroke="#047857" strokeWidth="1" />
                <text x="30" y="112" fill="#6ee7b7" fontSize="11" fontWeight="600">
                  DB: <tspan fill="#34d399" fontWeight="700">check_ins (reviewed), messages</tspan>
                </text>
              </g>
            </g>

            {/* Column 3: Administrator */}
            <g transform="translate(1080, 140)">
              <rect x="0" y="0" width="460" height="850" rx="18" fill="#1b0c2e" fillOpacity="0.7" stroke="#7c3aed" strokeWidth="2" strokeOpacity="0.4" />
              <rect x="0" y="0" width="460" height="56" rx="18" fill="url(#adminGrad)" />
              <text x="230" y="35" fill="#ffffff" fontSize="18" fontWeight="800" textAnchor="middle" letterSpacing="1">
                🛡️ ADMINISTRATOR ROLE
              </text>
              <text x="230" y="85" fill="#d8b4fe" fontSize="12" fontWeight="600" textAnchor="middle">
                Platform Governance & Coach Pairing
              </text>

              {/* Admin Node 1: Review & Pair Coach */}
              <g transform="translate(25, 110)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="135" rx="14" fill="#0f172a" stroke="#7c3aed" strokeWidth="1.5" />
                <rect x="15" y="15" width="28" height="28" rx="8" fill="#7c3aed" fillOpacity="0.2" />
                <text x="29" y="34" fill="#c084fc" fontSize="14" fontWeight="800" textAnchor="middle">2</text>
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Client Approval & Coach Pairing</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Reviews registration queue, approves client, assigns coach.
                </text>
                <rect x="20" y="95" width="370" height="26" rx="6" fill="#3b0764" stroke="#6b21a8" strokeWidth="1" />
                <text x="30" y="112" fill="#d8b4fe" fontSize="11" fontWeight="600">
                  DB: <tspan fill="#c084fc" fontWeight="700">coach_client_assignments, conversations</tspan>
                </text>
              </g>

              {/* Admin Node 2: Schema & Health */}
              <g transform="translate(25, 330)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="125" rx="14" fill="#0f172a" stroke="#7c3aed" strokeWidth="1.5" />
                <circle cx="29" cy="29" r="14" fill="#a855f7" fillOpacity="0.2" />
                <path d="M22 29 L27 34 L36 24" fill="none" stroke="#a855f7" strokeWidth="2.5" />
                <text x="55" y="34" fill="#ffffff" fontSize="15" fontWeight="700">Database & System Health</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Maintains PostgreSQL schemas, table integrity, global audits.
                </text>
                <rect x="20" y="85" width="370" height="26" rx="6" fill="#3b0764" stroke="#6b21a8" strokeWidth="1" />
                <text x="30" y="102" fill="#d8b4fe" fontSize="11" fontWeight="600">
                  DB: <tspan fill="#c084fc" fontWeight="700">system_settings, audit_logs</tspan>
                </text>
              </g>

              {/* Admin Node 3: Global Metrics */}
              <g transform="translate(25, 530)" filter="url(#cardShadow)">
                <rect x="0" y="0" width="410" height="120" rx="14" fill="#0f172a" stroke="#7c3aed" strokeWidth="1.5" />
                <text x="20" y="35" fill="#ffffff" fontSize="15" fontWeight="700">Organization Overview</text>
                <text x="20" y="65" fill="#94a3b8" fontSize="12">
                  Monitors coach caseloads, athlete compliance rates, platform retention.
                </text>
                <rect x="20" y="80" width="370" height="26" rx="6" fill="#3b0764" stroke="#6b21a8" strokeWidth="1" />
                <text x="30" y="97" fill="#d8b4fe" fontSize="11" fontWeight="600">
                  Cross-roster analytics & exercise library oversight
                </text>
              </g>
            </g>

            {/* Connecting Flow Arrows */}
            {/* Arrow 1: Client Reg -> Admin Approval */}
            <path
              d="M 495 310 Q 780 260 1105 310"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              markerEnd="url(#arrow-purple)"
            />

            {/* Arrow 2: Admin Pairing -> Coach Programming */}
            <path
              d="M 1105 400 Q 1050 420 1005 420"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2.5"
              markerEnd="url(#arrow-emerald)"
            />

            {/* Arrow 3: Coach Programming -> Client Calendar */}
            <path
              d="M 595 440 Q 545 450 495 500"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              markerEnd="url(#arrow-blue)"
            />

            {/* Arrow 4: Client Active Logging -> Coach Live Adherence */}
            <path
              d="M 495 675 Q 545 675 595 675"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="2.5"
              markerEnd="url(#arrow-emerald)"
            />

            {/* Arrow 5: Client Weekly Check-In -> Coach Review */}
            <path
              d="M 495 890 Q 545 890 595 890"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="3"
              markerEnd="url(#arrow-amber)"
            />

            {/* Arrow 6: Coach Feedback -> Client Updates */}
            <path
              d="M 595 915 Q 545 935 495 915"
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeDasharray="6 4"
              markerEnd="url(#arrow-blue)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

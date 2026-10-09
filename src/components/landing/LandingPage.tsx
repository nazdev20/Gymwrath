import React from 'react';
import { ArrowRight, TrendingUp, Dumbbell, Target, Utensils } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

const PILLARS = [
  {
    number: '01',
    title: 'Set the target.',
    description: 'Define the goal, follow your training plan, and know what you are working toward.',
    icon: Target
  },
  {
    number: '02',
    title: 'Execute the plan.',
    description: 'Log sets, reps, nutrition, and daily movement. Put the work on record.',
    icon: Dumbbell
  },
  {
    number: '03',
    title: 'Prove the progress.',
    description: 'Review your history, recognize real personal records, and set the next target.',
    icon: TrendingUp
  }
];

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => (
  <div className="mx-auto w-full max-w-7xl space-y-12 py-5 sm:py-10">
    <section className="grid grid-cols-1 items-center gap-8 border-b border-slate-800 pb-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:gap-12 lg:pb-14">
      <div className="space-y-6">
        <div className="inline-flex items-center gap-2 border-l-2 border-emerald-500 pl-3 text-xs font-bold uppercase tracking-[0.2em] text-emerald-400">
          GymWrath · Training with intention
        </div>
        <h1 className="max-w-3xl text-4xl font-black leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
          Every rep
          <span className="block text-emerald-400">has a target.</span>
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          Most people train to pass the time. You’re here because you have a target.
          Turn raw drive into focused work—with a plan to follow, progress you can measure,
          and coaching that keeps the next step clear.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-emerald-400"
          >
            Lock in <ArrowRight className="h-4 w-4" />
          </button>
          <span className="text-xs text-slate-500">Training · Nutrition · Progress</span>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900 p-5 sm:p-6">
        <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">The GymWrath approach</p>
        <blockquote className="mt-5 max-w-md text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
          Channel the fire.
          <span className="block text-emerald-400">Own the result.</span>
        </blockquote>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-slate-400">
          It isn’t blind anger. It’s focus: a deliberate set, an honest log, a considered recovery,
          and showing up for the next session.
        </p>
        <div className="mt-7 flex items-center gap-3 border-t border-slate-800 pt-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
            <Utensils className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Fuel the target.</p>
            <p className="mt-0.5 text-xs text-slate-500">Make the work measurable.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="space-y-5">
      <div className="max-w-xl">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-400">A system for the work</p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Drive needs direction.</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          GymWrath connects the daily actions to the long-term goal—without pretending progress happens overnight.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-0 divide-y divide-slate-800 border-y border-slate-800 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {PILLARS.map(pillar => {
          const Icon = pillar.icon;
          return (
            <article key={pillar.number} className="py-5 sm:px-5 sm:py-6 first:sm:pl-0 last:sm:pr-0">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-slate-500">{pillar.number}</span>
                <Icon className="h-5 w-5 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white">{pillar.title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-400">{pillar.description}</p>
            </article>
          );
        })}
      </div>
    </section>

    <footer className="flex flex-col gap-4 border-t border-slate-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-bold tracking-tight text-white">GYMWRATH</p>
        <p className="mt-1 text-xs text-slate-500">Discipline over noise. Progress over promises.</p>
      </div>
      <button type="button" onClick={onGetStarted} className="inline-flex items-center gap-2 self-start text-sm font-semibold text-emerald-400 transition-colors hover:text-emerald-300 sm:self-auto">
        Sign in or register <ArrowRight className="h-4 w-4" />
      </button>
    </footer>
  </div>
);

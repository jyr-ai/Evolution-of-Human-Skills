import React, { useState } from 'react';
import { TransitionNode } from '../types/history';
import { ArrowRight, Activity, Clock, AlertTriangle, Eye, Sparkles } from 'lucide-react';

interface TransitionNodeBenchmarkProps {
  transitions: TransitionNode[];
  eraTitle: string;
}

export const TransitionNodeBenchmark: React.FC<TransitionNodeBenchmarkProps> = ({
  transitions,
  eraTitle,
}) => {
  const [activeNodeIndex, setActiveNodeIndex] = useState(0);
  const activeNode = transitions[activeNodeIndex] || transitions[0];

  const calculateDelta = (before: number, after: number) => {
    const delta = after - before;
    if (delta > 0) return `+${delta}%`;
    return `${delta}%`;
  };

  return (
    <section id="transition-nodes" className="py-12 border-b border-slate-800 bg-[#090e1a]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-mono text-orange-400 uppercase tracking-widest mb-1">
            Section D · UI Benchmarking
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Interactive Transition Nodes: {eraTitle}
          </h2>
          <p className="text-sm text-slate-400 max-w-3xl mt-1">
            Side-by-side occupational benchmarking measuring the cognitive, physical, tactile, and surveillance reallocation as machines replaced human tasks.
          </p>
        </div>

        {/* Transition Scenarios Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          {transitions.map((trans, idx) => {
            const isSelected = idx === activeNodeIndex;
            return (
              <button
                key={trans.id}
                onClick={() => setActiveNodeIndex(idx)}
                className={`p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-slate-900 border-orange-500/80 ring-1 ring-orange-500/50 shadow-lg'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div className="text-xs font-mono text-slate-400 mb-1">Scenario 0{idx + 1}</div>
                <div className="text-sm font-semibold text-white mb-1.5">{trans.roleTitle}</div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 line-clamp-1">
                  <span className="text-slate-300 font-mono truncate">{trans.oldRole.split(' ')[0]}</span>
                  <ArrowRight className="w-3 h-3 text-orange-400 shrink-0" />
                  <span className="text-orange-300 font-mono truncate">{trans.newRole.split(' ')[0]}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* The Side-by-Side Transition Workbench */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 overflow-hidden shadow-2xl p-6 lg:p-8">
          {/* Header of Workbench */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-orange-400">
                Benchmarked Trade
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mt-0.5">
                {activeNode.roleTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span>{activeNode.typicalTrainingTime}</span>
            </div>
          </div>

          {/* Side-by-Side Roles Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 my-8">
            {/* The Old Role (Pre-Shock) */}
            <div className="p-5 rounded-xl border border-slate-800 bg-slate-950/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  Pre-Shock Role
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                  Artisanal Baseline
                </span>
              </div>

              <h4 className="text-lg font-serif font-semibold text-slate-100">
                {activeNode.oldRole}
              </h4>

              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Core Craft Competency:
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {activeNode.oldSkillRequired}
                </p>
              </div>
            </div>

            {/* The New Role (Post-Shock) */}
            <div className="p-5 rounded-xl border border-orange-950/70 bg-gradient-to-br from-slate-950/80 to-orange-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-widest text-orange-400 font-bold">
                  Post-Shock Role
                </span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-950/80 text-orange-300 border border-orange-500/40">
                  Machine Hybrid
                </span>
              </div>

              <h4 className="text-lg font-serif font-semibold text-white">
                {activeNode.newRole}
              </h4>

              <div className="space-y-1.5">
                <div className="text-xs font-mono uppercase tracking-wider text-orange-300">
                  Reconfigured Machine Competency:
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans">
                  {activeNode.newSkillRequired}
                </p>
              </div>
            </div>
          </div>

          {/* Load Shift Metrics Visualizer */}
          <div className="pt-6 border-t border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-400" />
                <h4 className="text-sm font-mono uppercase tracking-wider text-slate-200 font-semibold">
                  Cognitive vs Physical Load Shift Metrics
                </h4>
              </div>
              <div className="text-xs text-slate-400 font-mono hidden sm:inline">
                Values benchmarked 0 – 100 load index
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Physical Muscular Load */}
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 font-sans">1. Physical & Muscular Strain</span>
                  <span
                    className={`font-mono font-bold ${
                      activeNode.physicalLoadShift.after > activeNode.physicalLoadShift.before
                        ? 'text-orange-400'
                        : 'text-blue-400'
                    }`}
                  >
                    Δ {calculateDelta(activeNode.physicalLoadShift.before, activeNode.physicalLoadShift.after)}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Pre-Shock: {activeNode.physicalLoadShift.before}%</span>
                    <span>Post-Shock: {activeNode.physicalLoadShift.after}%</span>
                  </div>
                  {/* Visual Bar Before vs After */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-slate-400 h-full"
                      style={{ width: `${activeNode.physicalLoadShift.before}%` }}
                    />
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-orange-500 to-amber-400 h-full"
                      style={{ width: `${activeNode.physicalLoadShift.after}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-sans italic">
                  {activeNode.physicalLoadShift.description}
                </p>
              </div>

              {/* 2. Cognitive Vigilance Load */}
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 font-sans">2. Cognitive & Vigilance Load</span>
                  <span
                    className={`font-mono font-bold ${
                      activeNode.cognitiveLoadShift.after > activeNode.cognitiveLoadShift.before
                        ? 'text-orange-400'
                        : 'text-blue-400'
                    }`}
                  >
                    Δ {calculateDelta(activeNode.cognitiveLoadShift.before, activeNode.cognitiveLoadShift.after)}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Pre-Shock: {activeNode.cognitiveLoadShift.before}%</span>
                    <span>Post-Shock: {activeNode.cognitiveLoadShift.after}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-slate-400 h-full"
                      style={{ width: `${activeNode.cognitiveLoadShift.before}%` }}
                    />
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-sky-400 h-full"
                      style={{ width: `${activeNode.cognitiveLoadShift.after}%` }}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-sans italic">
                  {activeNode.cognitiveLoadShift.description}
                </p>
              </div>

              {/* 3. Manual Dexterity Requirement */}
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 font-sans">3. Fine Tactile / Manual Dexterity</span>
                  <span
                    className={`font-mono font-bold ${
                      activeNode.dexterityShift.after > activeNode.dexterityShift.before
                        ? 'text-orange-400'
                        : 'text-blue-400'
                    }`}
                  >
                    Δ {calculateDelta(activeNode.dexterityShift.before, activeNode.dexterityShift.after)}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Pre-Shock: {activeNode.dexterityShift.before}%</span>
                    <span>Post-Shock: {activeNode.dexterityShift.after}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-slate-400 h-full"
                      style={{ width: `${activeNode.dexterityShift.before}%` }}
                    />
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-amber-500 h-full"
                      style={{ width: `${activeNode.dexterityShift.after}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* 4. Managerial Oversight & Surveillance Load */}
              <div className="p-4 rounded-lg bg-slate-950/40 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 font-sans flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>4. Surveillance & Oversight Load</span>
                  </span>
                  <span className="font-mono font-bold text-orange-400">
                    Δ {calculateDelta(activeNode.oversightLoadShift.before, activeNode.oversightLoadShift.after)}
                  </span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Pre-Shock: {activeNode.oversightLoadShift.before}%</span>
                    <span>Post-Shock: {activeNode.oversightLoadShift.after}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-slate-400 h-full"
                      style={{ width: `${activeNode.oversightLoadShift.before}%` }}
                    />
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-orange-500 h-full"
                      style={{ width: `${activeNode.oversightLoadShift.after}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Friction & Transition Resistance Note */}
            <div className="mt-4 p-4 rounded-xl bg-orange-950/20 border border-orange-500/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-orange-400 font-semibold">
                  Human Labor Friction & Transition Cost:
                </div>
                <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                  {activeNode.keyFriction}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

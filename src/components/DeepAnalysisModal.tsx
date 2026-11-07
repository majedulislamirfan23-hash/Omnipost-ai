import React from 'react';
import { 
  X, 
  Cpu, 
  TrendingUp, 
  Award, 
  AlertTriangle, 
  CheckCircle2, 
  Split, 
  Clock, 
  Layers 
} from 'lucide-react';
import { DeepAnalysisData } from '../types';

interface DeepAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DeepAnalysisData | null;
  isLoading: boolean;
}

export const DeepAnalysisModal: React.FC<DeepAnalysisModalProps> = ({
  isOpen,
  onClose,
  data,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">
                  Gemini 4 Argon Campaign & Algorithmic Audit
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Complex Reasoning
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Deep multi-dimensional virality, retention, and algorithm fit audit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 flex-1">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-8 h-8 border-3 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
              <div className="text-sm font-semibold text-slate-200">
                Running Strategic Algorithmic Audit with Gemini 4 Argon...
              </div>
              <p className="text-xs text-slate-400 max-w-md">
                Analyzing hook psychology, scroll-stopping mechanics, platform-specific feed algorithms, and conversion bottlenecks.
              </p>
            </div>
          ) : data ? (
            <>
              {/* Overall Verdict Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-indigo-500/10 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Executive Strategy Verdict
                  </span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  {data.overallVerdict}
                </p>
              </div>

              {/* 3 Core Metric Scores */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium">Virality & Hook Power</span>
                    <TrendingUp className="w-4 h-4 text-rose-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-white">{data.scores.virality}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${data.scores.virality}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium">Audience Resonance</span>
                    <Award className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-white">{data.scores.resonance}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-400 to-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${data.scores.resonance}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-medium">Algorithm Fit</span>
                    <Cpu className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-extrabold text-white">{data.scores.algorithmFit}</span>
                    <span className="text-xs text-slate-500">/ 100</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${data.scores.algorithmFit}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Key Growth Strengths</span>
                  </div>
                  <ul className="space-y-1.5">
                    {data.strengths.map((s, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Algorithmic Risks & Blindspots</span>
                  </div>
                  <ul className="space-y-1.5">
                    {data.risks.map((r, idx) => (
                      <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Platform-Specific Optimization Recommendations */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Platform-Specific Strategic Tweaks</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-blue-400 mb-1">LinkedIn</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {data.platformRecommendations.linkedin}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-sky-400 mb-1">Twitter / X</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {data.platformRecommendations.twitter}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-pink-400 mb-1">Instagram</div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {data.platformRecommendations.instagram}
                    </p>
                  </div>
                </div>
              </div>

              {/* A/B Testing Angles & Timing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                    <Split className="w-4 h-4 text-indigo-400" />
                    <span>Recommended A/B Testing Angles</span>
                  </div>
                  <div className="space-y-1.5">
                    {data.abTestAngles.map((angle, idx) => (
                      <div key={idx} className="p-2 rounded bg-slate-900 border border-slate-800/80 text-xs text-slate-300">
                        <span className="font-semibold text-indigo-400 mr-1.5">Angle {idx + 1}:</span>
                        {angle}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 mb-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span>Best Posting Timing & Schedule</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {data.bestTiming}
                    </p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200">
                    💡 Tip: Stagger your post releases by 2 hours across platforms to maximize cross-channel amplification without cannibalizing engagement.
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No audit available. Click "Algorithmic Audit" in the header to run with Gemini 4 Argon.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  X, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Share2, 
  Mail, 
  Sparkles, 
  Lock,
  Layers,
  FileText
} from 'lucide-react';

interface GuidelinesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuidelinesModal: React.FC<GuidelinesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Community & Content Creation Guidelines
              </h3>
              <p className="text-xs text-slate-400">
                Standards, platform policies, character limits, email hygiene & AI ethics
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
        <div className="p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Ethical AI Generation & Fair Use */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <ShieldCheck className="w-4 h-4" />
              <span>1. Ethical AI Content & Fair-Use Standards</span>
            </div>
            <p>
              OmniPost Studio is designed for authentic human-directed creativity. While Gemini AI assists in drafting copy and rendering concepts, creators maintain full editorial responsibility for published material.
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
              <li><strong className="text-slate-200">Attribution & IP Respect:</strong> Respect intellectual property and fair-use boundaries when referencing existing creative universes (e.g. Genshin Impact, Shangri-La Frontier). Presets are meant for illustrative inspiration and transformative parody/critique.</li>
              <li><strong className="text-slate-200">No Deceptive Impersonation:</strong> Never generate content impersonating real living individuals without explicit authorization.</li>
              <li><strong className="text-slate-200">Zero Hate & Safety Policy:</strong> Content generating harassment, discriminatory bias, malware, or non-consensual imagery is strictly prohibited and blocked by safety guardrails.</li>
            </ul>
          </div>

          {/* Section 2: Platform Character Limits & Algorithmic Rules */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Share2 className="w-4 h-4" />
              <span>2. Multi-Platform Specifications & Retention Rules</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* LinkedIn */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-blue-900/40 space-y-1.5">
                <div className="font-bold text-blue-400 flex items-center justify-between">
                  <span>LinkedIn</span>
                  <span className="text-[10px] bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-300">16:9 / 1:1</span>
                </div>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  <li>• <strong className="text-slate-200">Char Limit:</strong> 3,000 characters.</li>
                  <li>• <strong className="text-slate-200">Fold Cutoff:</strong> First 140 chars decide the "see more" click-through rate.</li>
                  <li>• <strong className="text-slate-200">Formatting:</strong> Generous whitespace, 1-2 sentence paragraphs.</li>
                  <li>• <strong className="text-slate-200">Hashtags:</strong> 3 to 5 targeted industry tags.</li>
                </ul>
              </div>

              {/* Twitter / X */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-sky-900/40 space-y-1.5">
                <div className="font-bold text-sky-400 flex items-center justify-between">
                  <span>Twitter / X</span>
                  <span className="text-[10px] bg-sky-500/10 px-1.5 py-0.5 rounded text-sky-300">16:9 / 3:2</span>
                </div>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  <li>• <strong className="text-slate-200">Char Limit:</strong> Strict 280 characters for the lead post.</li>
                  <li>• <strong className="text-slate-200">Thread Cadence:</strong> First tweet must stand alone; follow-ups provide immediate proof.</li>
                  <li>• <strong className="text-slate-200">Hashtags:</strong> 1 to 2 maximum to avoid algorithmic penalty.</li>
                </ul>
              </div>

              {/* Instagram */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-pink-900/40 space-y-1.5">
                <div className="font-bold text-pink-400 flex items-center justify-between">
                  <span>Instagram</span>
                  <span className="text-[10px] bg-pink-500/10 px-1.5 py-0.5 rounded text-pink-300">1:1 / 9:16</span>
                </div>
                <ul className="space-y-1 text-slate-400 text-[11px]">
                  <li>• <strong className="text-slate-200">Char Limit:</strong> 2,200 characters.</li>
                  <li>• <strong className="text-slate-200">Retention Sweet Spot:</strong> 120–250 words with compelling visual storytelling.</li>
                  <li>• <strong className="text-slate-200">Call to Action:</strong> Encourage "Save" or "Share to Story".</li>
                  <li>• <strong className="text-slate-200">Hashtags:</strong> 15 to 20 strategic tags.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Email Dispatch & Anti-Spam Hygiene */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Mail className="w-4 h-4" />
              <span>3. Email Dispatch & Anti-Spam Hygiene</span>
            </div>
            <p>
              When using the Email Dispatch tool to share campaign drafts with collaborators, clients, or stakeholders:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-slate-400">
              <li><strong className="text-slate-200">Permission-Based Sharing:</strong> Only send campaign reviews to recipients who have requested or consented to receive marketing materials.</li>
              <li><strong className="text-slate-200">Subject Line Integrity:</strong> Avoid clickbait, all-caps, or deceptive tags (e.g. "FREE MONEY", "$$$"). Keep subjects descriptive and informative.</li>
              <li><strong className="text-slate-200">CAN-SPAM & GDPR Compliance:</strong> Always include your company identity, physical mailing address, and clear opt-out mechanisms if forwarding drafts to broad distribution lists.</li>
            </ul>
          </div>

          {/* Section 4: AI Assistant Persona Interaction */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>4. AI Assistant Persona & Companion Interaction</span>
            </div>
            <p>
              The integrated Anime AI Assistants (Aria and Ren) are creative sounding boards and productivity companions.
            </p>
            <ul className="space-y-1 pl-4 list-disc text-slate-400">
              <li>Feel free to switch between Male and Female avatars at any point to fit your creative aesthetic.</li>
              <li>Toggle personality modes (Charismatic, Tactical, Playful) to adjust tone critique and dialogue nuance.</li>
              <li>Use the quick companion buttons to instantly spark fresh RPG worldbuilding, roast existing hooks, or refresh hashtags.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 flex justify-end bg-slate-900 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Understood & Agree
          </button>
        </div>
      </div>
    </div>
  );
};

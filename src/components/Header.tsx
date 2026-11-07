import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  History, 
  Download, 
  Cpu, 
  Image as ImageIcon, 
  Shield, 
  FileText, 
  Film, 
  User,
  BookOpen,
  Mail,
  Palette,
  LogIn,
  Check
} from 'lucide-react';
import { BackgroundTheme, UserProfile } from '../types';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenAnalysis?: () => void;
  onOpenReport?: () => void;
  onOpenSecurity?: () => void;
  onOpenGuidelines?: () => void;
  onOpenEmail?: () => void;
  onOpenLogin?: () => void;
  hasCampaign: boolean;
  onExportCampaign?: () => void;
  isAnalyzing?: boolean;
  userProfile?: UserProfile;
  backgroundTheme: BackgroundTheme;
  onChangeBackground: (theme: BackgroundTheme) => void;
  isLoggedIn?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHistory,
  onOpenAnalysis,
  onOpenReport,
  onOpenSecurity,
  onOpenGuidelines,
  onOpenEmail,
  onOpenLogin,
  hasCampaign,
  onExportCampaign,
  isAnalyzing,
  userProfile,
  backgroundTheme,
  onChangeBackground,
  isLoggedIn = true,
}) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const backgroundThemes: { id: BackgroundTheme; label: string; dot: string }[] = [
    { id: 'cyberpunk', label: 'Cyberpunk Neon', dot: 'bg-cyan-500' },
    { id: 'sakura', label: 'Sakura Twilight', dot: 'bg-pink-400' },
    { id: 'studio', label: 'Matte Slate Studio', dot: 'bg-slate-400' },
    { id: 'fantasy', label: 'Celestial Fantasy', dot: 'bg-purple-500' },
    { id: 'sunset', label: 'Sunset Lo-Fi Dusk', dot: 'bg-amber-500' },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Layers className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                OmniPost <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Studio</span>
              </h1>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Free AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Tailored copy & native-ratio images with anime AI guides
            </p>
          </div>
        </div>

        {/* Ambient Background Theme Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowThemeMenu(!showThemeMenu)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors shadow-sm"
            title="Change workspace background atmosphere"
          >
            <Palette className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden lg:inline capitalize">{backgroundTheme} Realm</span>
          </button>

          {showThemeMenu && (
            <div className="absolute left-0 mt-2 w-48 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-50 text-xs">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 px-2 py-1 font-semibold">
                Choice Backgrounds
              </div>
              {backgroundThemes.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => {
                    onChangeBackground(bg.id);
                    setShowThemeMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg transition-colors text-left ${
                    backgroundTheme === bg.id
                      ? 'bg-indigo-600/30 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${bg.dot}`} />
                    <span>{bg.label}</span>
                  </span>
                  {backgroundTheme === bg.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Guidelines Button */}
          {onOpenGuidelines && (
            <button
              onClick={onOpenGuidelines}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
              title="View Guidelines and Content Rules"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Guidelines</span>
            </button>
          )}

          {/* Email Dispatch & Contact Selector Button */}
          {hasCampaign && onOpenEmail && (
            <button
              onClick={onOpenEmail}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 transition-colors shadow-sm"
              title="Email Dispatch, Selection Process & Drafts"
            >
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Email Draft</span>
            </button>
          )}

          {hasCampaign && onOpenReport && (
            <button
              onClick={onOpenReport}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors shadow-sm"
              title="Open AI Knowledge & Strategy Intelligence Report"
            >
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">AI Report</span>
            </button>
          )}

          {hasCampaign && onOpenAnalysis && (
            <button
              onClick={onOpenAnalysis}
              disabled={isAnalyzing}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-colors shadow-sm disabled:opacity-50"
              title="Gemini 4 Argon strategy audit"
            >
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isAnalyzing ? 'Auditing...' : 'Audit'}</span>
            </button>
          )}

          {hasCampaign && onExportCampaign && (
            <button
              onClick={onExportCampaign}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Export all posts to Markdown"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}

          <button
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
            title="Saved campaign drafts"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          {/* Login / User Setting Button */}
          {onOpenLogin && (
            <button
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
              title="Login system & profile"
            >
              <User className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline">{userProfile?.name || 'Login'}</span>
            </button>
          )}

          {onOpenSecurity && (
            <button
              onClick={onOpenSecurity}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition-all"
              title="Security, 2FA, Vault & Hobby Power Controls"
            >
              <Shield className={`w-3.5 h-3.5 ${userProfile?.is2FAEnabled ? 'text-emerald-400' : 'text-indigo-400'}`} />
              <span className="hidden lg:inline">Security & 2FA</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

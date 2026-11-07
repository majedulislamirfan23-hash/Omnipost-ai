import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  Key, 
  ShieldCheck, 
  User, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  LogIn
} from 'lucide-react';
import { UserProfile } from '../types';
import { AnimeAvatar } from './AnimeAvatar';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  onLoginSuccess: (email: string, name: string) => void;
  onOpenSecuritySettings: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  onLoginSuccess,
  onOpenSecuritySettings,
}) => {
  if (!isOpen) return null;

  const [email, setEmail] = useState(userProfile.email || 'majedulislamirfan23@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(userProfile.name || 'Omni Creator');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [requires2FA, setRequires2FA] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccessNotice, setLoginSuccessNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (userProfile.is2FAEnabled && !requires2FA) {
      setRequires2FA(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setLoginSuccessNotice(true);
      onLoginSuccess(email.trim(), name.trim());
      setTimeout(() => {
        setLoginSuccessNotice(false);
        onClose();
      }, 1000);
    }, 600);
  };

  const handleInstantGuestLogin = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess('majedulislamirfan23@gmail.com', 'Alex Vance');
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
        {/* Top ambient color glow */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <LogIn className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Creator Account Login</h3>
              <p className="text-[11px] text-slate-400">Sign in to your free OmniPost AI Studio workspace</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {loginSuccessNotice ? (
            <div className="py-8 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">Welcome Back, {name}!</h4>
              <p className="text-xs text-slate-400">Entering your AI studio...</p>
            </div>
          ) : (
            <>
              {/* Anime Guide Greeting */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div className="shrink-0">
                  <AnimeAvatar gender="female" size="sm" expression="charming" />
                </div>
                <div className="text-xs text-slate-300 leading-snug">
                  <span className="font-bold text-pink-400">Aria: </span>
                  "Sign in to sync your saved campaigns, 2FA credentials, and custom brand voice, darling!"
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your.email@gmail.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              {/* Display Name */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Creator Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Your Name / Handle"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Master Password
                  </label>
                  <button
                    type="button"
                    onClick={onOpenSecuritySettings}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300"
                  >
                    Security Settings & 2FA
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2FA Verification Step if Enabled */}
              {requires2FA && (
                <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-700/50 space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-indigo-200 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Two-Factor Authentication Active</span>
                    </span>
                    <span className="text-[10px] text-slate-400">TOTP App</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code (e.g. 582910)"
                    className="w-full bg-slate-950 border border-indigo-500 rounded-xl px-3 py-2 text-center text-sm font-mono tracking-widest text-white focus:outline-none"
                    autoFocus
                  />
                  <p className="text-[10px] text-slate-400 text-center">
                    Enter code from Google Authenticator, Authy, or 1Password
                  </p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>{requires2FA ? 'Verify 2FA & Enter' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleInstantGuestLogin}
                  className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-medium border border-slate-700 transition-colors"
                >
                  ⚡ Continue with 1-Click Instant Login (Free)
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

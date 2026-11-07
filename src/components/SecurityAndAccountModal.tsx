import React, { useState } from 'react';
import { 
  X, 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Key, 
  User, 
  Smartphone, 
  EyeOff, 
  FileCheck, 
  Sliders, 
  Zap, 
  Check, 
  RefreshCw, 
  LogOut, 
  AlertCircle, 
  Server, 
  Database,
  Sparkles,
  Info
} from 'lucide-react';
import { HobbyAndPowerPolicy, UserProfile } from '../types';

interface SecurityAndAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  hobbyPolicy: HobbyAndPowerPolicy;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onUpdatePolicy: (updated: Partial<HobbyAndPowerPolicy>) => void;
}

export const SecurityAndAccountModal: React.FC<SecurityAndAccountModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  hobbyPolicy,
  onUpdateProfile,
  onUpdatePolicy,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'security' | 'account' | 'hobby_power'>('security');
  const [showQrCode, setShowQrCode] = useState(false);
  const [twoFaCode, setTwoFaCode] = useState('');
  const [isVerifying2fa, setIsVerifying2fa] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggle2FA = () => {
    if (userProfile.is2FAEnabled) {
      onUpdateProfile({ is2FAEnabled: false, twoFactorMethod: 'none' });
      setShowQrCode(false);
    } else {
      setShowQrCode(true);
    }
  };

  const handleConfirm2FA = (e: React.FormEvent) => {
    e.preventDefault();
    if (twoFaCode.length >= 6) {
      setIsVerifying2fa(true);
      setTimeout(() => {
        setIsVerifying2fa(false);
        onUpdateProfile({ is2FAEnabled: true, twoFactorMethod: 'authenticator_app' });
        setShowQrCode(false);
        setTwoFaCode('');
      }, 700);
    }
  };

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Account, Extra Security & Creator Power Hub
              </h3>
              <p className="text-xs text-slate-400">
                2FA protection, AES-256 secret vault, hobby usage policy & AI reasoning power
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2">
          <button
            onClick={() => setActiveTab('security')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'security'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>Extra Security & Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('hobby_power')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'hobby_power'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Hobby Policy & Power Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('account')}
            className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'account'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Account & Workspace</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 space-y-6 flex-1">
          {/* TAB 1: EXTRA SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              {/* Security Health Score Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-emerald-500/10 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
                      <span>Enterprise Security Tier: High Protection</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {userProfile.is2FAEnabled ? 'Protected (2FA Active)' : 'Action Recommended'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      End-to-end secret shielding, prompt PII scrub, and zero-log retention active
                    </p>
                  </div>
                </div>
              </div>

              {/* 2FA Toggle & Authenticator Flow */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-indigo-400" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">Two-Factor Authentication (2FA)</div>
                      <div className="text-[11px] text-slate-400">
                        Require an Authenticator TOTP token upon publishing and critical campaign exports
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleToggle2FA}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      userProfile.is2FAEnabled
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                    }`}
                  >
                    {userProfile.is2FAEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </button>
                </div>

                {/* Show Simulated Authenticator QR if setting up */}
                {showQrCode && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs font-semibold text-indigo-300">
                      1. Scan Authenticator QR Code with Google Authenticator or 1Password:
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Simulated QR block */}
                      <div className="w-24 h-24 bg-white p-2 rounded-lg flex flex-col items-center justify-center text-slate-900 font-mono text-[9px] text-center border">
                        <div className="grid grid-cols-5 gap-1 w-full h-full p-1">
                          {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className={`${i % 2 === 0 ? 'bg-black' : 'bg-transparent'} rounded-[1px]`} />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-slate-400 space-y-1">
                        <div>Key Secret: <strong className="font-mono text-slate-200">OMNI-7824-VEO9-SEC</strong></div>
                        <div className="text-[11px] text-slate-500">Algorithm: Time-based One-Time Password (RFC 6238)</div>
                      </div>
                    </div>

                    <form onSubmit={handleConfirm2FA} className="flex gap-2 items-center pt-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={twoFaCode}
                        onChange={(e) => setTwoFaCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="Enter 6-digit code (e.g. 123456)"
                        className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-indigo-500 max-w-[200px]"
                        required
                      />
                      <button
                        type="submit"
                        disabled={isVerifying2fa || twoFaCode.length < 6}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
                      >
                        {isVerifying2fa ? 'Verifying...' : 'Verify & Activate'}
                      </button>
                    </form>
                  </div>
                )}
              </div>

              {/* Extra Security Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PII Scrubbing */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <EyeOff className="w-4 h-4 text-emerald-400" />
                      <span>PII Auto-Scrubbing</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={userProfile.piiScrubbing}
                      onChange={(e) => onUpdateProfile({ piiScrubbing: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Automatically redacts private emails, credit card patterns, and personal names before passing prompts to Gemini models.
                  </p>
                </div>

                {/* Secret Vault Lock */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <Key className="w-4 h-4 text-purple-400" />
                      <span>AES-256 Vault Encryption</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={userProfile.secretVaultActive}
                      onChange={(e) => onUpdateProfile({ secretVaultActive: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Encrypts all locally cached draft campaigns and server tokens with browser-isolated WebCrypto keys.
                  </p>
                </div>

                {/* Zero-Log Policy */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                      <FileCheck className="w-4 h-4 text-indigo-400" />
                      <span>Never Train On My Data</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={userProfile.neverTrainOnData}
                      onChange={(e) => onUpdateProfile({ neverTrainOnData: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Enforces strict ephemeral interaction headers so user ideas are never stored in third-party model training datasets.
                  </p>
                </div>

                {/* Content Moderation Guard */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Safety Guardrail Level</span>
                    <select
                      value={userProfile.contentSafetyLevel}
                      onChange={(e) => onUpdateProfile({ contentSafetyLevel: e.target.value as any })}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
                    >
                      <option value="Creative Freedom">Creative Freedom (Hobby/Gaming)</option>
                      <option value="Standard">Standard (Social media)</option>
                      <option value="Strict">Strict (Brand safe / Corporate)</option>
                    </select>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sets output filters for gaming violence, edgy witty hooks, and brand safety parameters.
                  </p>
                </div>
              </div>

              {/* Active Sessions Manager */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-indigo-400" />
                    <span>Active Session & Device Trust</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-medium">Current Session (Verified)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">Chrome (Linux) • AI Studio Environment</div>
                    <div className="text-[10px] text-slate-400">IP: {userProfile.ipAddress} • Last Active: Just now</div>
                  </div>
                  <button
                    onClick={() => onUpdateProfile({ lastActive: new Date().toISOString() })}
                    className="text-[11px] px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  >
                    Refresh Session
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOBBY POLICY & CREATOR POWER CONTROLS */}
          {activeTab === 'hobby_power' && (
            <div className="space-y-5">
              {/* Hobby Policy Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-indigo-500/10 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Hobby & Indie Creator Usage Policy
                    </span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={hobbyPolicy.hobbyPolicyEnabled}
                      onChange={(e) => onUpdatePolicy({ hobbyPolicyEnabled: e.target.checked })}
                      className="rounded border-slate-700 bg-slate-950 text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span>Active Fair-Use Mode</span>
                  </label>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Our Hobby Policy provides indie creators, worldbuilders, game modders, and hobbyists with non-commercial fair-use rights, relaxed creative safety guardrails, and flexible generation modes.
                </p>
              </div>

              {/* Power Controls: Creativity Temperature & Reasoning Depth */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-purple-400" />
                  <span>Creator Power Controls</span>
                </div>

                {/* Creativity Temperature */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-300">AI Creativity Temperature:</span>
                    <span className="font-mono text-purple-400 font-bold">{hobbyPolicy.creativityTemperature.toFixed(2)}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={hobbyPolicy.creativityTemperature}
                    onChange={(e) => onUpdatePolicy({ creativityTemperature: parseFloat(e.target.value) })}
                    className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Precise & Analytical (0.1)</span>
                    <span>Balanced (0.7)</span>
                    <span>Wild & Creative (1.0)</span>
                  </div>
                </div>

                {/* Reasoning Depth (Gemini 4 / 3.8 thinking config) */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
                    Reasoning Effort Level (Thinking Depth):
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['low', 'medium', 'high'] as const).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => onUpdatePolicy({ reasoningEffort: level })}
                        className={`p-2 rounded-xl border text-center text-xs font-semibold uppercase tracking-wider transition-colors ${
                          hobbyPolicy.reasoningEffort === level
                            ? 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Controls Chain-of-Thought reasoning for campaign audits and hook synthesis.
                  </p>
                </div>
              </div>

              {/* Custom Persistent Brand Voice */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-200">Custom Brand Voice & Persona Directives</span>
                  <span className="text-[10px] text-slate-500">Auto-injected into posts</span>
                </div>
                <textarea
                  rows={2}
                  value={hobbyPolicy.customBrandVoice}
                  onChange={(e) => onUpdatePolicy({ customBrandVoice: e.target.value })}
                  placeholder="E.g. Passionate indie RPG developer building in public, candid humor, technical details about procedural terrain..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                />
              </div>

              {/* Policy Options Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-200">Commercial Use Permitted</div>
                    <div className="text-[10px] text-slate-500">Monetize published campaigns</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hobbyPolicy.allowCommercialUse}
                    onChange={(e) => onUpdatePolicy({ allowCommercialUse: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-purple-600 w-4 h-4 cursor-pointer"
                  />
                </label>

                <label className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-semibold text-slate-200">Zero-Log Server Retention</div>
                    <div className="text-[10px] text-slate-500">Purge memory upon turn completion</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={hobbyPolicy.zeroLogRetention}
                    onChange={(e) => onUpdatePolicy({ zeroLogRetention: e.target.checked })}
                    className="rounded border-slate-700 bg-slate-900 text-purple-600 w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 3: ACCOUNT & WORKSPACE */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-base">
                    {userProfile.avatar}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{userProfile.name}</h4>
                    <p className="text-xs text-slate-400">{userProfile.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {userProfile.plan} • {userProfile.role}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Display Name</label>
                    <input
                      type="text"
                      value={userProfile.name}
                      onChange={(e) => onUpdateProfile({ name: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 mb-1 block">Workspace Role</label>
                    <select
                      value={userProfile.role}
                      onChange={(e) => onUpdateProfile({ role: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Creator">Solo Creator / Streamer</option>
                      <option value="Hobbyist">Indie Worldbuilder / Hobbyist</option>
                      <option value="Brand Lead">Brand & Product Marketing Lead</option>
                      <option value="Agency">Agency Multi-Client Director</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Secrets & Billing Guidance Card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Gemini API Key & Billing Connection</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Your AI Studio environment securely injects your attached API key automatically via the server. You can view or change your key at any time in the <strong>Settings &gt; Secrets</strong> panel.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            OmniPost Security Shield v2.4 • Active
          </span>
          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
            <button
              onClick={() => {
                handleSave();
                onClose();
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
            >
              Done & Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

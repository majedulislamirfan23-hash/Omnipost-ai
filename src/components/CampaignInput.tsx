import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Settings2, 
  Wand2, 
  Sliders, 
  Image as ImageIcon,
  Check,
  ChevronDown,
  Layers,
  HelpCircle,
  AlertCircle,
  Copy,
  ClipboardPaste,
  Trash2,
  RefreshCcw
} from 'lucide-react';
import { AspectRatio, ImageModel, ImageResolution, Tone } from '../types';
import { ASPECT_RATIOS, IDEA_PRESETS, IMAGE_RESOLUTIONS, TONE_OPTIONS } from '../constants/presets';

interface CampaignInputProps {
  onGenerate: (params: {
    idea: string;
    tone: Tone;
    customTone?: string;
    audience?: string;
    imageModel: ImageModel;
    imageResolution: ImageResolution;
    linkedinRatio: AspectRatio;
    twitterRatio: AspectRatio;
    instagramRatio: AspectRatio;
    autoGenerateImages: boolean;
  }) => Promise<void>;
  isLoading: boolean;
  activeIdea?: string;
  onIdeaChange?: (newIdea: string) => void;
}

export const CampaignInput: React.FC<CampaignInputProps> = ({
  onGenerate,
  isLoading,
  activeIdea,
  onIdeaChange,
}) => {
  const DEFAULT_RPG_IDEA = 'An open-world action RPG inspired by Genshin Impact and Shangri-La Frontier that features procedurally generated infinite landscapes, physics-driven combat, and ultra-deep character customization down to gear craftsmanship, scars, and monster-hunting combat stances.';

  const [idea, setIdea] = useState(activeIdea || DEFAULT_RPG_IDEA);
  const [tone, setTone] = useState<Tone>('witty');
  const [customTone, setCustomTone] = useState('');
  const [audience, setAudience] = useState('Gamers, anime fans & RPG adventurers');
  
  const [copiedIdea, setCopiedIdea] = useState(false);
  const [pastedIdea, setPastedIdea] = useState(false);

  // Synchronize when external idea changes from AI Companion
  useEffect(() => {
    if (activeIdea !== undefined && activeIdea !== idea) {
      setIdea(activeIdea);
    }
  }, [activeIdea]);

  const handleIdeaChangeInternal = (val: string) => {
    setIdea(val);
    if (onIdeaChange) onIdeaChange(val);
  };

  const handlePasteIdea = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        handleIdeaChangeInternal(text.trim());
        setPastedIdea(true);
        setTimeout(() => setPastedIdea(false), 2000);
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleCopyIdea = async () => {
    if (!idea) return;
    try {
      await navigator.clipboard.writeText(idea);
      setCopiedIdea(true);
      setTimeout(() => setCopiedIdea(false), 2000);
    } catch (err) {
      console.error('Failed to copy idea:', err);
    }
  };

  const handleClearToZero = () => {
    handleIdeaChangeInternal('');
  };

  const handleRestoreRpgPreset = () => {
    handleIdeaChangeInternal(DEFAULT_RPG_IDEA);
    setTone('witty');
    setAudience('Gamers, anime fans & RPG adventurers');
  };
  
  // Image generation controls
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [imageModel, setImageModel] = useState<ImageModel>('gemini-3-pro-image-preview');
  const [imageResolution, setImageResolution] = useState<ImageResolution>('2K');
  const [linkedinRatio, setLinkedinRatio] = useState<AspectRatio>('16:9');
  const [twitterRatio, setTwitterRatio] = useState<AspectRatio>('16:9');
  const [instagramRatio, setInstagramRatio] = useState<AspectRatio>('1:1');
  const [autoGenerateImages, setAutoGenerateImages] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim() || isLoading) return;

    await onGenerate({
      idea: idea.trim(),
      tone,
      customTone: tone === 'custom' ? customTone.trim() : undefined,
      audience: audience.trim() || undefined,
      imageModel,
      imageResolution,
      linkedinRatio,
      twitterRatio,
      instagramRatio,
      autoGenerateImages,
    });
  };

  const handleApplyPreset = (preset: typeof IDEA_PRESETS[0]) => {
    handleIdeaChangeInternal(preset.idea);
    setTone(preset.tone);
    setAudience(preset.audience);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-sm">
      {/* Preset Idea Chips */}
      <div className="mb-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-indigo-400" />
            Quick Test Ideas:
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestoreRpgPreset}
              className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 underline"
              title="Restore Genshin Impact / Shangri-La Frontier preset"
            >
              RPG Open World Preset
            </button>
            <span className="text-slate-600">•</span>
            <button
              type="button"
              onClick={handleClearToZero}
              className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
              title="Start with flat zero blank slate"
            >
              Start Flat (Zero)
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {IDEA_PRESETS.map((preset) => {
            const isSelected = idea.includes(preset.title) || idea === preset.idea;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all text-left flex items-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-200'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400 bg-indigo-950/80 px-1.5 py-0.5 rounded border border-indigo-800/40">
                  {preset.badge}
                </span>
                <span className="font-medium truncate max-w-[200px]">{preset.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Core Idea Textarea with Copy, Paste (Pest), and Clear */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="idea-input" className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
              <span>Your Core Idea or Announcement</span>
              <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePasteIdea}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                title="Paste from clipboard"
              >
                <ClipboardPaste className="w-3 h-3 text-indigo-400" />
                <span>{pastedIdea ? 'Pasted!' : 'Paste Idea'}</span>
              </button>

              {idea && (
                <button
                  type="button"
                  onClick={handleCopyIdea}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px] font-medium flex items-center gap-1 transition-colors"
                  title="Copy idea text"
                >
                  {copiedIdea ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                  <span>{copiedIdea ? 'Copied' : 'Copy'}</span>
                </button>
              )}

              {idea && (
                <button
                  type="button"
                  onClick={handleClearToZero}
                  className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-rose-300 text-[11px] font-medium flex items-center gap-1 transition-colors"
                  title="Clear to zero"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear (Zero)</span>
                </button>
              )}

              <span className="text-xs text-slate-500 hidden sm:inline">{idea.length} chars</span>
            </div>
          </div>
          <div className="relative">
            <textarea
              id="idea-input"
              rows={3}
              value={idea}
              onChange={(e) => handleIdeaChangeInternal(e.target.value)}
              placeholder="Describe your product launch, story, feature, game, or thought (or click Paste Idea)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 resize-none transition-all shadow-inner"
              required
            />
          </div>
        </div>

        {/* Tone Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <span>Desired Tone:</span>
              <span className="text-indigo-400 font-normal">
                {TONE_OPTIONS.find((t) => t.id === tone)?.description || 'Custom tone'}
              </span>
            </label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {TONE_OPTIONS.map((t) => {
              const active = tone === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id)}
                  className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                    active
                      ? 'bg-gradient-to-b from-indigo-500/20 to-purple-500/10 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-base">{t.icon}</span>
                    {active && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <span className="text-xs font-medium leading-tight">{t.label}</span>
                </button>
              );
            })}
          </div>

          {tone === 'custom' && (
            <div className="mt-2">
              <input
                type="text"
                value={customTone}
                onChange={(e) => setCustomTone(e.target.value)}
                placeholder="E.g. Sarcastic cybersecurity veteran, lyrical poet, hyper-energetic twitch streamer..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}
        </div>

        {/* Target Audience & Collapsible Advanced Image Settings */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between pt-1">
          <div className="flex-1 w-full sm:max-w-md">
            <label className="text-xs font-semibold text-slate-400 mb-1 block">
              Target Audience (Optional):
            </label>
            <input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="E.g. Indie developers, RPG gamers, SaaS buyers, recruiters"
              className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
              <input
                type="checkbox"
                checked={autoGenerateImages}
                onChange={(e) => setAutoGenerateImages(e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
              />
              <span className="flex items-center gap-1">
                <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
                Auto-generate images
              </span>
            </label>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-700/60"
            >
              <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>Image & Studio Controls</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Advanced Image Studio Accordion */}
        {showAdvanced && (
          <div className="mt-3 p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-pink-400" />
                <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">
                  Image Generation & Aspect Ratio Studio Settings
                </h4>
              </div>
              <span className="text-[11px] text-slate-400">
                Models: gemini-3-pro-image-preview & gemini-nano-banana-2.1
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image Model Choice */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Studio Image Model:
                </label>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-3-pro-image-preview')}
                    className={`w-full p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                      imageModel === 'gemini-3-pro-image-preview'
                        ? 'bg-pink-500/10 border-pink-500/50 text-pink-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">Gemini 3 Pro Image Preview</div>
                      <div className="text-[10px] text-slate-400">Studio photorealism & prompt precision</div>
                    </div>
                    {imageModel === 'gemini-3-pro-image-preview' && <Check className="w-4 h-4 text-pink-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageModel('gemini-nano-banana-2.1')}
                    className={`w-full p-2 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${
                      imageModel === 'gemini-nano-banana-2.1'
                        ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">Gemini Nano Banana 2.1</div>
                      <div className="text-[10px] text-slate-400">High-fidelity multi-aspect generation</div>
                    </div>
                    {imageModel === 'gemini-nano-banana-2.1' && <Check className="w-4 h-4 text-indigo-400" />}
                  </button>
                </div>
              </div>

              {/* Image Resolution (1K, 2K, 4K) */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Default Resolution:
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {IMAGE_RESOLUTIONS.map((res) => {
                    const active = imageResolution === res.value;
                    return (
                      <button
                        key={res.value}
                        type="button"
                        onClick={() => setImageResolution(res.value)}
                        className={`p-2 rounded-lg border text-center transition-colors ${
                          active
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs">{res.value}</div>
                        <div className="text-[9px] text-slate-500 leading-none mt-0.5">{res.value === '1K' ? '1024px' : res.value === '2K' ? '2048px' : '4096px'}</div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  All images support 1K, 2K, and 4K outputs via Gemini 3 Pro and Nano Banana.
                </p>
              </div>

              {/* Per-Platform Optimal Aspect Ratios */}
              <div>
                <label className="text-xs font-medium text-slate-300 mb-1.5 block">
                  Platform Aspect Ratios:
                </label>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">LinkedIn:</span>
                    <select
                      value={linkedinRatio}
                      onChange={(e) => setLinkedinRatio(e.target.value as AspectRatio)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      {ASPECT_RATIOS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Twitter / X:</span>
                    <select
                      value={twitterRatio}
                      onChange={(e) => setTwitterRatio(e.target.value as AspectRatio)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      {ASPECT_RATIOS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Instagram:</span>
                    <select
                      value={instagramRatio}
                      onChange={(e) => setInstagramRatio(e.target.value as AspectRatio)}
                      className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-indigo-500"
                    >
                      {ASPECT_RATIOS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-sm bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:via-violet-500 hover:to-pink-500 text-white shadow-lg shadow-indigo-600/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Generating Multi-Platform Campaign & Tailored Visuals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Tailored Posts & Aspect-Ratio Imagery for All 3 Platforms</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

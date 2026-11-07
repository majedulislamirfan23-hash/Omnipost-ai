import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sliders, 
  Image as ImageIcon, 
  Layers, 
  Check, 
  Wand2 
} from 'lucide-react';
import { AspectRatio, ImageModel, ImageResolution, Platform } from '../types';
import { ASPECT_RATIOS, IMAGE_RESOLUTIONS } from '../constants/presets';

interface ImageRegenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
  currentPrompt: string;
  currentRatio: AspectRatio;
  currentResolution?: ImageResolution;
  currentModel?: ImageModel;
  onGenerate: (params: {
    platform: Platform;
    prompt: string;
    aspectRatio: AspectRatio;
    imageSize: ImageResolution;
    model: ImageModel;
  }) => Promise<void>;
  isGenerating: boolean;
}

export const ImageRegenerateModal: React.FC<ImageRegenerateModalProps> = ({
  isOpen,
  onClose,
  platform,
  currentPrompt,
  currentRatio,
  currentResolution = '2K',
  currentModel = 'gemini-3-pro-image-preview',
  onGenerate,
  isGenerating,
}) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState(currentPrompt);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(currentRatio);
  const [imageSize, setImageSize] = useState<ImageResolution>(currentResolution);
  const [model, setModel] = useState<ImageModel>(currentModel);

  const styleEnhancers = [
    { label: 'Cinematic Anime / Game Concept', tag: 'breathtaking anime key visual, dynamic lighting, high fantasy open world, Makoto Shinkai and Ufotable aesthetic, ultra-detailed textures, 8k resolution' },
    { label: 'Editorial Studio Photography', tag: 'shot on 35mm Hasselblad, clean studio lighting, soft natural bokeh, hyper-realistic, award winning photography' },
    { label: 'Futuristic Cyberpunk', tag: 'neon volumetric fog, high-contrast cyan and magenta rim light, sleek tech surfaces, cinematic unreal engine 5 render' },
    { label: 'Minimalist Vector Art', tag: 'clean modern vector illustration, bold geometric forms, vibrant refined color palette, editorial aesthetic' },
  ];

  const handleAddStyle = (tag: string) => {
    setPrompt((prev) => `${prev.trim()}, ${tag}`);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isGenerating) return;

    await onGenerate({
      platform,
      prompt: prompt.trim(),
      aspectRatio,
      imageSize,
      model,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">
                Visual Studio - {platform.toUpperCase()}
              </h3>
              <p className="text-xs text-slate-400">
                Configure aspect ratios (1:1 to 21:9), resolution (1K, 2K, 4K) & model
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

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-5 flex-1">
          {/* Prompt input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-200">
                Visual Prompt
              </label>
              <span className="text-[11px] text-slate-500">Be descriptive with lighting & framing</span>
            </div>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe scene composition, lighting, camera angle, and subject..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
              required
            />

            {/* Quick Style Enhancer Chips */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 flex items-center gap-1 mr-1">
                <Wand2 className="w-3 h-3 text-pink-400" />
                Add Style:
              </span>
              {styleEnhancers.map((enhancer, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddStyle(enhancer.tag)}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition-colors"
                >
                  + {enhancer.label}
                </button>
              ))}
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-2 block">
              Image Generation Model
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModel('gemini-3-pro-image-preview')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                  model === 'gemini-3-pro-image-preview'
                    ? 'bg-pink-500/10 border-pink-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-100">gemini-3-pro-image-preview</div>
                  <div className="text-[11px] text-pink-300 font-medium">Studio Quality Pro</div>
                  <div className="text-[10px] text-slate-500 mt-1">High prompt comprehension & studio fidelity</div>
                </div>
                {model === 'gemini-3-pro-image-preview' && <Check className="w-4 h-4 text-pink-400 shrink-0" />}
              </button>

              <button
                type="button"
                onClick={() => setModel('gemini-nano-banana-2.1')}
                className={`p-3 rounded-xl border text-left transition-all flex items-start justify-between ${
                  model === 'gemini-nano-banana-2.1'
                    ? 'bg-indigo-500/10 border-indigo-500 text-white'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-100">gemini-nano-banana-2.1</div>
                  <div className="text-[11px] text-indigo-300 font-medium">Nano Banana 2.1</div>
                  <div className="text-[10px] text-slate-500 mt-1">Versatile high-res generation & search grounding</div>
                </div>
                {model === 'gemini-nano-banana-2.1' && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
              </button>
            </div>
          </div>

          {/* Aspect Ratio Selector (All 8 supported ratios) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-200">
                Aspect Ratio
              </label>
              <span className="text-[11px] text-indigo-400">
                Selected: {aspectRatio} ({ASPECT_RATIOS.find((r) => r.value === aspectRatio)?.label})
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ASPECT_RATIOS.map((r) => {
                const isSelected = aspectRatio === r.value;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setAspectRatio(r.value)}
                    className={`p-2.5 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-pink-500/15 border-pink-500 text-white shadow-sm shadow-pink-500/10'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xs font-bold font-mono">{r.value}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-pink-400" />}
                    </div>
                    <span className="text-[10px] text-slate-400 leading-tight truncate">{r.helper}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Image Size / Resolution (1K, 2K, 4K) */}
          <div>
            <label className="text-xs font-semibold text-slate-200 mb-2 block">
              Image Size / Resolution
            </label>
            <div className="grid grid-cols-3 gap-2">
              {IMAGE_RESOLUTIONS.map((res) => {
                const isSelected = imageSize === res.value;
                return (
                  <button
                    key={res.value}
                    type="button"
                    onClick={() => setImageSize(res.value)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-white font-bold'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="text-sm font-bold text-slate-100">{res.value}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{res.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white shadow-lg shadow-pink-500/20 disabled:opacity-50 flex items-center gap-2 transition-all"
            >
              {isGenerating ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Rendering Image...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate New Image</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

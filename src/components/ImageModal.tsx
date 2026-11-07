import React from 'react';
import { X, Download, Copy, Check } from 'lucide-react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  prompt: string;
  aspectRatio: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  prompt,
  aspectRatio,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !imageUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `omnipost-studio-${aspectRatio.replace(':', 'x')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyPrompt = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative max-w-5xl w-full max-h-[92vh] flex flex-col bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Top bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
              Ratio: {aspectRatio}
            </span>
            <span className="text-xs text-slate-400 truncate max-w-sm">
              Studio Image Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download High-Res</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image body */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950">
          <img
            src={imageUrl}
            alt="Generated Visual asset"
            className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl"
          />
        </div>

        {/* Prompt details drawer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-4">
          <p className="text-xs text-slate-300 leading-relaxed truncate flex-1">
            <span className="text-slate-500 font-semibold mr-1.5">Prompt:</span>
            {prompt}
          </p>
          <button
            onClick={handleCopyPrompt}
            className="shrink-0 text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Prompt</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

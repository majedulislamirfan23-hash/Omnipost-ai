import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Wand2, 
  RefreshCw, 
  Maximize2, 
  Download, 
  Clock, 
  MessageCircle, 
  Repeat, 
  Heart, 
  Share, 
  Bookmark, 
  Send, 
  MoreHorizontal, 
  Hash, 
  Flame, 
  Sliders, 
  ExternalLink,
  ChevronDown,
  Layers,
  Image as ImageIcon,
  Film,
  Video,
  Play,
  Pause
} from 'lucide-react';
import { AspectRatio, ImageModel, ImageResolution, Platform } from '../types';

interface PlatformCardProps {
  platform: Platform;
  title: string;
  badgeColor: string;
  content: {
    hook?: string;
    text?: string;
    caption?: string;
    singleTweet?: string;
    threadTweets?: string[];
    headline?: string;
    callToAction?: string;
    hashtags: string[];
    imagePrompt: string;
    recommendedRatio: AspectRatio;
    imageUrl?: string;
    imageSize?: ImageResolution;
    imageModel?: ImageModel;
    imageStatus?: 'idle' | 'generating' | 'completed' | 'error';
    isQuotaFallback?: boolean;
    quotaMessage?: string;
    videoUrl?: string;
    videoStatus?: 'idle' | 'generating' | 'completed' | 'error';
  };
  onUpdateContent: (platform: Platform, newText: string) => void;
  onQuickEdit: (platform: Platform, action: string, tone?: string) => Promise<void>;
  onOpenRegenerateImage: (platform: Platform) => void;
  onOpenImageLightbox: (imageUrl: string, prompt: string, ratio: string) => void;
  onDirectGenerateImage: (platform: Platform) => void;
  onAnimateToVideo?: (platform: Platform, imageUrl: string, prompt: string, ratio: AspectRatio) => void;
  isQuickEditing: boolean;
}

export const PlatformCard: React.FC<PlatformCardProps> = ({
  platform,
  title,
  badgeColor,
  content,
  onUpdateContent,
  onQuickEdit,
  onOpenRegenerateImage,
  onOpenImageLightbox,
  onDirectGenerateImage,
  onAnimateToVideo,
  isQuickEditing,
}) => {
  const [copied, setCopied] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [viewMode, setViewMode] = useState<'mockup' | 'text'>('mockup');
  const [showVideo, setShowVideo] = useState(false);
  const [showAiMenu, setShowAiMenu] = useState(false);
  const [selectedThreadIndex, setSelectedThreadIndex] = useState(0);

  // Derive active text based on platform
  const rawText = platform === 'twitter' 
    ? (content.singleTweet || '') 
    : platform === 'instagram' 
      ? (content.caption || '') 
      : (content.text || '');

  const [editText, setEditText] = useState(rawText);

  // Update local edit text when external content changes
  React.useEffect(() => {
    setEditText(rawText);
  }, [rawText]);

  const handleCopy = async (textToCopy: string, isTagOnly = false) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      if (isTagOnly) {
        setCopiedHashtags(true);
        setTimeout(() => setCopiedHashtags(false), 2000);
      } else {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSaveEdit = () => {
    onUpdateContent(platform, editText);
    setIsEditing(false);
  };

  const handleDownloadImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!content.imageUrl) return;
    const link = document.createElement('a');
    link.href = content.imageUrl;
    link.download = `${platform}-omnipost-${content.recommendedRatio.replace(':', 'x')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Character calculations
  const charCount = rawText.length;
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
  const readTimeSeconds = Math.max(1, Math.round((wordCount / 200) * 60));

  // Twitter char limit calculation
  const twitterMax = 280;
  const twitterRemaining = twitterMax - charCount;
  const isOverTwitterLimit = platform === 'twitter' && twitterRemaining < 0;

  return (
    <div className="flex flex-col bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl hover:border-slate-700/80 transition-all duration-300">
      {/* Header bar */}
      <div className="px-4 py-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${badgeColor}`} />
          <h3 className="font-bold text-sm text-white tracking-wide">{title}</h3>
          <span className="text-[11px] font-mono text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700/40">
            {content.recommendedRatio}
          </span>
        </div>

        {/* View toggle & Action buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
            <button
              onClick={() => setViewMode('mockup')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                viewMode === 'mockup' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mockup
            </button>
            <button
              onClick={() => setViewMode('text')}
              className={`px-2 py-0.5 rounded font-medium transition-colors ${
                viewMode === 'text' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Editor
            </button>
          </div>

          <button
            onClick={() => handleCopy(rawText + '\n\n' + content.hashtags.join(' '))}
            className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-colors"
            title="Copy full post and hashtags"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main card body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        {/* Mockup Preview or Editor */}
        {viewMode === 'mockup' ? (
          <div className="space-y-3">
            {/* Platform Mockup Container */}
            {platform === 'linkedin' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200 shadow-inner">
                {/* Author profile mockup */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                      IN
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 flex items-center gap-1">
                        <span>Creative Director</span>
                        <span className="text-[10px] text-slate-400 font-normal">• 1st</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Storytelling & Product Innovation</div>
                      <div className="text-[9px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-2.5 h-2.5" /> 1h • Edited • 🌐
                      </div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>

                {/* Hook Highlight */}
                {content.hook && (
                  <div className="mb-2 p-2 rounded-lg bg-blue-500/10 border-l-2 border-blue-500 text-blue-200 font-medium text-xs leading-relaxed">
                    💡 <span className="font-semibold">Opening Hook:</span> {content.hook}
                  </div>
                )}

                {/* Post body with preserved whitespace */}
                <div className="text-slate-200 leading-relaxed whitespace-pre-line font-sans text-xs">
                  {rawText}
                </div>

                {/* Hashtags */}
                {content.hashtags && content.hashtags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {content.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-blue-400 hover:underline cursor-pointer text-xs font-medium">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                )}

                {/* Engagement bar mockup */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">👍 💡 ❤️ 142</span>
                  <span>18 comments • 4 reposts</span>
                </div>
              </div>
            )}

            {platform === 'twitter' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200 shadow-inner">
                {/* Author profile mockup */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                      𝕏
                    </div>
                    <div>
                      <div className="font-bold text-slate-100 flex items-center gap-1">
                        <span>Studio Launch</span>
                        <span className="text-sky-400 text-xs">✓</span>
                      </div>
                      <div className="text-[10px] text-slate-400">@omnistudio</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>

                {/* Tweet text */}
                <div className="text-slate-100 leading-relaxed whitespace-pre-line text-sm">
                  {rawText}
                </div>

                {/* Hashtags */}
                {content.hashtags && content.hashtags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {content.hashtags.map((tag, idx) => (
                      <span key={idx} className="text-sky-400 hover:underline cursor-pointer text-xs">
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </span>
                    ))}
                  </div>
                )}

                {/* Thread preview tab if available */}
                {content.threadTweets && content.threadTweets.length > 0 && (
                  <div className="mt-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                      <span className="font-semibold text-sky-400">🧵 Thread Follow-ups ({content.threadTweets.length} tweets)</span>
                      <button
                        onClick={() => handleCopy(content.threadTweets?.join('\n\n---\n\n') || '')}
                        className="text-[10px] hover:text-white underline"
                      >
                        Copy Thread
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {content.threadTweets.map((t, idx) => (
                        <div key={idx} className="text-[11px] text-slate-300 pl-2 border-l border-sky-500/40 py-0.5">
                          <span className="text-slate-500 mr-1">{idx + 2}/</span> {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Engagement icons */}
                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400 text-xs px-2">
                  <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                    <MessageCircle className="w-3.5 h-3.5" /> 34
                  </span>
                  <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                    <Repeat className="w-3.5 h-3.5" /> 12
                  </span>
                  <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                    <Heart className="w-3.5 h-3.5" /> 289
                  </span>
                  <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                    <Bookmark className="w-3.5 h-3.5" /> 45
                  </span>
                </div>
              </div>
            )}

            {platform === 'instagram' && (
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 text-xs text-slate-200 shadow-inner">
                {/* Author profile mockup with story ring */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                      <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center font-bold text-white text-[10px]">
                        IG
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-100 text-xs">omni.studio</div>
                      <div className="text-[10px] text-slate-400">Original audio</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-4 h-4 text-slate-500" />
                </div>

                {/* Instagram Call to Action */}
                {content.callToAction && (
                  <div className="mb-2 px-2.5 py-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-300 font-medium text-xs flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-pink-400" />
                    <span>{content.callToAction}</span>
                  </div>
                )}

                {/* Caption */}
                <div className="text-slate-200 leading-relaxed whitespace-pre-line text-xs">
                  <span className="font-semibold text-white mr-1.5">omni.studio</span>
                  {rawText}
                </div>

                {/* Hashtags container */}
                {content.hashtags && content.hashtags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        Hashtags ({content.hashtags.length})
                      </span>
                      <button
                        onClick={() => handleCopy(content.hashtags.join(' '), true)}
                        className="text-[10px] text-pink-400 hover:text-pink-300 underline"
                      >
                        {copiedHashtags ? 'Copied!' : 'Copy Tags Only'}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1 max-h-20 overflow-y-auto pr-1">
                      {content.hashtags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300"
                        >
                          {tag.startsWith('#') ? tag : `#${tag}`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Editor View */
          <div className="space-y-2">
            <textarea
              rows={8}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 resize-none font-mono leading-relaxed"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setEditText(rawText);
                  setIsEditing(false);
                }}
                className="px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200"
              >
                Reset
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium"
              >
                Apply Changes
              </button>
            </div>
          </div>
        )}

        {/* Character & Reading Metrics */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-3">
            <span>{charCount} chars</span>
            <span>{wordCount} words</span>
            {platform === 'linkedin' && (
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3" /> ~{readTimeSeconds}s read
              </span>
            )}
          </div>

          {platform === 'twitter' && (
            <div className="flex items-center gap-1.5">
              <span className={`font-mono font-medium ${isOverTwitterLimit ? 'text-rose-400' : 'text-slate-300'}`}>
                {twitterRemaining}
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 ${
                  isOverTwitterLimit
                    ? 'border-rose-500 bg-rose-500/20'
                    : twitterRemaining < 20
                    ? 'border-amber-400 bg-amber-400/20'
                    : 'border-sky-400 bg-sky-400/20'
                }`}
              />
            </div>
          )}
        </div>

        {/* Tailored Image Section with Aspect Ratio */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-300 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
              <span>Native Aspect Image ({content.recommendedRatio})</span>
            </span>
            <div className="flex items-center gap-1.5">
              {content.videoUrl && (
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className={`text-[11px] px-2 py-0.5 rounded font-medium flex items-center gap-1 transition-colors ${
                    showVideo
                      ? 'bg-purple-600 text-white'
                      : 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30'
                  }`}
                >
                  <Film className="w-3 h-3" />
                  <span>{showVideo ? 'Image Mode' : 'Video Reel'}</span>
                </button>
              )}

              {onAnimateToVideo && content.imageUrl && (
                <button
                  onClick={() => onAnimateToVideo(platform, content.imageUrl!, content.imagePrompt, content.recommendedRatio)}
                  className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-purple-500/10"
                  title="Turn this visual into a motion video clip (gemini-omni-1.2-flash)"
                >
                  <Film className="w-3 h-3" />
                  <span>Animate Reel</span>
                </button>
              )}

              <button
                onClick={() => onOpenRegenerateImage(platform)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-indigo-500/10"
                title="Customize aspect ratio, resolution (1K/2K/4K) and prompt"
              >
                <Sliders className="w-3 h-3" />
                <span>Adjust</span>
              </button>
            </div>
          </div>

          {/* Image / Video Display Card */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden group">
            {showVideo && content.videoUrl ? (
              <div className="relative flex flex-col items-center justify-center bg-slate-950">
                <video
                  src={content.videoUrl}
                  autoPlay
                  loop
                  controls
                  className="w-full object-cover max-h-[260px]"
                  style={{
                    aspectRatio: content.recommendedRatio.replace(':', '/'),
                  }}
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur-sm text-[10px] font-mono text-purple-300 border border-purple-500/30">
                  Omni Flash Reel • {content.recommendedRatio}
                </div>
              </div>
            ) : content.imageUrl ? (
              <div 
                className="relative cursor-pointer overflow-hidden flex items-center justify-center bg-slate-950"
                onClick={() => onOpenImageLightbox(content.imageUrl!, content.imagePrompt, content.recommendedRatio)}
              >
                <img
                  src={content.imageUrl}
                  alt={`${platform} tailored asset`}
                  className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{
                    maxHeight: '260px',
                    aspectRatio: content.recommendedRatio.replace(':', '/'),
                  }}
                />

                {/* Overlay actions */}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenImageLightbox(content.imageUrl!, content.imagePrompt, content.recommendedRatio);
                    }}
                    className="p-2 rounded-lg bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700"
                    title="Fullscreen Lightbox"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  {onAnimateToVideo && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnimateToVideo(platform, content.imageUrl!, content.imagePrompt, content.recommendedRatio);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-purple-600 text-white hover:bg-purple-500 border border-purple-400 text-xs font-semibold flex items-center gap-1.5 shadow"
                      title="Animate to Video Reel"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>Animate Reel</span>
                    </button>
                  )}

                  <button
                    onClick={handleDownloadImage}
                    className="p-2 rounded-lg bg-slate-900/90 text-white hover:bg-slate-800 border border-slate-700"
                    title="Download High-Res Image"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* Aspect ratio & resolution badge */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/10">
                  <span>{content.recommendedRatio}</span>
                  <span>•</span>
                  <span>{content.imageSize || '2K'}</span>
                  {content.isQuotaFallback && (
                    <>
                      <span>•</span>
                      <span className="text-indigo-300">Visual Concept</span>
                    </>
                  )}
                </div>
              </div>
            ) : content.imageStatus === 'generating' ? (
              <div className="h-44 flex flex-col items-center justify-center gap-2.5 p-4 text-center">
                <div className="w-6 h-6 border-2 border-pink-500/30 border-t-pink-500 rounded-full animate-spin" />
                <div className="text-xs font-medium text-slate-300">
                  Generating {content.recommendedRatio} visual...
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  Using gemini-3-pro-image-preview
                </div>
              </div>
            ) : (
              <div className="h-36 flex flex-col items-center justify-center gap-2 p-4 text-center border-dashed border border-slate-800/80 rounded-xl">
                <ImageIcon className="w-6 h-6 text-slate-600" />
                <div className="text-xs text-slate-400">No image generated yet</div>
                <button
                  onClick={() => onDirectGenerateImage(platform)}
                  className="px-3 py-1.5 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>Generate Image ({content.recommendedRatio})</span>
                </button>
              </div>
            )}
          </div>

          {content.imageUrl && content.isQuotaFallback && (
            <div className="p-2 rounded-lg bg-indigo-950/60 border border-indigo-800/40 text-[11px] text-indigo-200 flex items-start gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <div className="leading-tight">
                <span className="font-semibold text-slate-100">Native Visual Card Generated:</span> Gemini 3 Pro studio image generation requires a billing-enabled key (free-tier quota is 0). To generate photorealistic AI photos, select a paid key in <span className="text-pink-300 font-medium">Settings &gt; Secrets</span>.
              </div>
            </div>
          )}
        </div>

        {/* Gemini 3.1 Flash-Lite Quick Polish Toolbar */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Gemini 3.1 Flash-Lite Quick Polish:</span>
            </span>
            {isQuickEditing && (
              <span className="text-[10px] text-indigo-400 animate-pulse">Polishing...</span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            <button
              onClick={() => onQuickEdit(platform, 'shorten')}
              disabled={isQuickEditing}
              className="text-[11px] px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 text-center truncate disabled:opacity-50"
              title="Condense by 35-50% while keeping punchiness"
            >
              ✂️ Make Shorter
            </button>
            <button
              onClick={() => onQuickEdit(platform, 'expand')}
              disabled={isQuickEditing}
              className="text-[11px] px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 text-center truncate disabled:opacity-50"
              title="Add narrative detail and depth"
            >
              📖 Expand
            </button>
            <button
              onClick={() => onQuickEdit(platform, 'hooks')}
              disabled={isQuickEditing}
              className="text-[11px] px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 text-center truncate disabled:opacity-50"
              title="Generate 3 viral hook alternatives"
            >
              🎣 3 Viral Hooks
            </button>
            <button
              onClick={() => onQuickEdit(platform, 'optimize_hashtags')}
              disabled={isQuickEditing}
              className="text-[11px] px-2 py-1 rounded bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-slate-700/40 text-center truncate disabled:opacity-50"
              title="Generate refreshed high-relevance hashtags"
            >
              #️⃣ Fresh Tags
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

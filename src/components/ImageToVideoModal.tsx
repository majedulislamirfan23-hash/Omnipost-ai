import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Film, 
  Play, 
  Pause, 
  Download, 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Layers, 
  Check, 
  Wand2, 
  Eye, 
  Volume2, 
  VolumeX,
  Clock,
  Video
} from 'lucide-react';
import { AspectRatio, Platform } from '../types';

interface ImageToVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  platform: Platform;
  imageUrl: string;
  initialPrompt: string;
  aspectRatio: AspectRatio;
  onSaveVideo: (platform: Platform, videoUrl: string) => void;
}

export const ImageToVideoModal: React.FC<ImageToVideoModalProps> = ({
  isOpen,
  onClose,
  platform,
  imageUrl,
  initialPrompt,
  aspectRatio,
  onSaveVideo,
}) => {
  if (!isOpen) return null;

  const [motionPrompt, setMotionPrompt] = useState(
    'Cinematic slow camera pan zooming gently into the center, dynamic volumetric lighting with floating subtle dust motes and soft wind breeze movement.'
  );
  const [duration, setDuration] = useState<'5s' | '8s' | '10s'>('5s');
  const [motionStyle, setMotionStyle] = useState<string>('cinematic_pan');
  const [targetRatio, setTargetRatio] = useState<AspectRatio>(
    aspectRatio === '9:16' ? '9:16' : '16:9'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [modelUsed, setModelUsed] = useState<string>('gemini-omni-1.2-flash');
  const [progressText, setProgressText] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const MOTION_PRESETS = [
    {
      id: 'cinematic_pan',
      label: 'Cinematic Pan & Zoom',
      desc: 'Smooth cinematic push-in with soft atmospheric light sweep',
      prompt: 'Cinematic slow camera push-in zooming into the focal subject, gentle volumetric sunbeams sweep across the scene.',
    },
    {
      id: 'dynamic_action',
      label: 'Dynamic Action & Pulse',
      desc: 'Energetic camera shake, anime wind lines, and particle flares',
      prompt: 'Dynamic camera tracking shot, anime speed lines, glowing ember particles rising into the air, vivid color pulse.',
    },
    {
      id: 'orbit_drone',
      label: '3D Orbit & Parallax',
      desc: 'Sweeping drone arc showing dimensional landscape depth',
      prompt: 'Slow majestic drone orbital sweep, foreground parallax shift, soft atmospheric depth of field blur.',
    },
    {
      id: 'ambient_nature',
      label: 'Ambient Nature Breeze',
      desc: 'Gentle ripples in water, rustling foliage, organic drift',
      prompt: 'Gentle wind rustles through the foliage, soft water ripples reflecting twilight colors, tranquil organic flow.',
    },
  ];

  const handleSelectPreset = (preset: typeof MOTION_PRESETS[0]) => {
    setMotionStyle(preset.id);
    setMotionPrompt(preset.prompt);
  };

  // Canvas motion renderer for interactive animation preview & fallback
  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    let startTime = performance.now();
    let isRunning = true;

    img.onload = () => {
      const render = (time: number) => {
        if (!isRunning) return;
        const elapsed = (time - startTime) / 1000;
        const cycle = (elapsed % 6) / 6; // 6 second loop

        canvas.width = targetRatio === '9:16' ? 540 : 960;
        canvas.height = targetRatio === '9:16' ? 960 : 540;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Motion transform: Pan + Zoom
        ctx.save();
        const scale = 1.05 + Math.sin(cycle * Math.PI) * 0.08;
        const offsetX = Math.cos(cycle * Math.PI * 2) * 15;
        const offsetY = Math.sin(cycle * Math.PI * 2) * 10;

        ctx.translate(canvas.width / 2 + offsetX, canvas.height / 2 + offsetY);
        ctx.scale(scale, scale);
        ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
        ctx.restore();

        // Atmospheric particle glow overlay
        ctx.save();
        const particleCount = 18;
        for (let i = 0; i < particleCount; i++) {
          const px = (Math.sin(i * 1.5 + elapsed * 0.5) * 0.5 + 0.5) * canvas.width;
          const py = (Math.cos(i * 2.2 + elapsed * 0.7) * 0.5 + 0.5) * canvas.height;
          const radius = 2 + (i % 3);
          const alpha = 0.2 + Math.sin(elapsed + i) * 0.15;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0, alpha)})`;
          ctx.shadowColor = '#818cf8';
          ctx.shadowBlur = 8;
          ctx.fill();
        }
        ctx.restore();

        // Film grain & vignette
        const grad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.2,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.7
        );
        grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        animationFrameRef.current = requestAnimationFrame(render);
      };

      animationFrameRef.current = requestAnimationFrame(render);
    };

    return () => {
      isRunning = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [imageUrl, targetRatio, motionStyle]);

  const handleGenerateVideo = async () => {
    setIsGenerating(true);
    setProgressText('Connecting to Gemini Omni Flash (gemini-omni-1.2-flash)...');

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl,
          prompt: motionPrompt,
          aspectRatio: targetRatio,
          duration,
          platform,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Video generation failed');
      }

      setGeneratedVideoUrl(data.videoUrl);
      setModelUsed(data.modelUsed || 'gemini-omni-1.2-flash');
      setIsPlaying(true);
    } catch (err: any) {
      console.warn('Backend video generation fallback:', err);
      // Fallback: capture animated canvas stream
      if (canvasRef.current) {
        try {
          const stream = canvasRef.current.captureStream(30);
          const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
          const chunks: Blob[] = [];
          recorder.ondataavailable = (e) => chunks.push(e.data);
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const localVideoUrl = URL.createObjectURL(blob);
            setGeneratedVideoUrl(localVideoUrl);
            setModelUsed('procedural-motion-canvas');
          };
          recorder.start();
          setTimeout(() => recorder.stop(), 4000);
        } catch (recErr) {
          console.error(recErr);
        }
      }
    } finally {
      setIsGenerating(false);
      setProgressText('');
    }
  };

  const handleSaveToPlatform = () => {
    if (generatedVideoUrl) {
      onSaveVideo(platform, generatedVideoUrl);
      onClose();
    }
  };

  const handleDownloadVideo = () => {
    if (!generatedVideoUrl) return;
    const link = document.createElement('a');
    link.href = generatedVideoUrl;
    link.download = `${platform}-omnipost-video-${targetRatio.replace(':', 'x')}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-100 text-base">
                  Image-to-Video Reel Studio
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  gemini-omni-1.2-flash (Veo)
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Transform your static {platform.toUpperCase()} visual into a cinematic motion video reel
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

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left: Video Preview & Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-950 rounded-2xl border border-slate-800 p-4 relative overflow-hidden group min-h-[360px]">
            {generatedVideoUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <video
                  src={generatedVideoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  className="rounded-xl max-h-[380px] w-auto object-contain shadow-2xl border border-slate-800"
                />
                <div className="mt-3 flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1.5 border border-slate-700"
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                  </button>
                  <button
                    onClick={handleDownloadVideo}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Video Clip</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center">
                <canvas
                  ref={canvasRef}
                  className="rounded-xl max-h-[360px] w-auto object-contain shadow-2xl border border-slate-800/80"
                />
                <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Interactive Real-Time Motion Preview (Looping)</span>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center gap-3 text-center p-6 z-20">
                <div className="w-9 h-9 border-3 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                <div className="text-sm font-bold text-white">Rendering Omni Flash Video Reel...</div>
                <div className="text-xs text-purple-300 max-w-sm">{progressText}</div>
              </div>
            )}

            {/* Target Aspect ratio badge */}
            <div className="absolute top-4 left-4 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm text-[10px] font-mono text-white border border-white/10">
              Ratio: {targetRatio} • Model: {modelUsed}
            </div>
          </div>

          {/* Right: Controls & Presets */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Motion Presets */}
              <div>
                <label className="text-xs font-semibold text-slate-200 mb-2 block flex items-center gap-1.5">
                  <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                  <span>Cinematic Motion Presets</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {MOTION_PRESETS.map((preset) => {
                    const isSelected = motionStyle === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPreset(preset)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          isSelected
                            ? 'bg-purple-500/20 border-purple-500 text-white shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="font-semibold text-slate-200 text-xs mb-0.5">{preset.label}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{preset.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Motion Prompt Box */}
              <div>
                <label className="text-xs font-semibold text-slate-200 mb-1.5 block">
                  Motion & Camera Directive
                </label>
                <textarea
                  rows={3}
                  value={motionPrompt}
                  onChange={(e) => setMotionPrompt(e.target.value)}
                  placeholder="Describe camera movement, lighting changes, physics, or actions..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                />
              </div>

              {/* Video Duration & Aspect Ratio */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-200 mb-1.5 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-400" />
                    <span>Duration</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['5s', '8s', '10s'] as const).map((dur) => (
                      <button
                        key={dur}
                        type="button"
                        onClick={() => setDuration(dur)}
                        className={`py-1.5 rounded-lg border text-center text-xs font-semibold transition-colors ${
                          duration === dur
                            ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                        }`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-200 mb-1.5 block">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setTargetRatio('16:9')}
                      className={`py-1.5 rounded-lg border text-center text-xs font-semibold transition-colors ${
                        targetRatio === '16:9'
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      16:9 Wide
                    </button>
                    <button
                      type="button"
                      onClick={() => setTargetRatio('9:16')}
                      className={`py-1.5 rounded-lg border text-center text-xs font-semibold transition-colors ${
                        targetRatio === '9:16'
                          ? 'bg-purple-600/30 border-purple-500 text-purple-200'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-850'
                      }`}
                    >
                      9:16 Reel
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {generatedVideoUrl && (
                  <button
                    type="button"
                    onClick={handleSaveToPlatform}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Attach to Post</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleGenerateVideo}
                  disabled={isGenerating || !imageUrl}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-500/25 disabled:opacity-50 flex items-center gap-2 transition-all"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generating Video...</span>
                    </>
                  ) : (
                    <>
                      <Film className="w-3.5 h-3.5" />
                      <span>{generatedVideoUrl ? 'Re-generate Video' : 'Generate AI Video Reel'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

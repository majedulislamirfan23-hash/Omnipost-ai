import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  MessageCircle, 
  Zap, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  ChevronRight,
  User,
  Sliders,
  Check,
  Send,
  Eye,
  Smile
} from 'lucide-react';
import { AnimeAvatar, AssistantGender, AvatarExpression } from './AnimeAvatar';

interface AiCompanionBodyProps {
  gender: AssistantGender;
  onGenderChange: (newGender: AssistantGender) => void;
  onSelectIdeaPreset: (ideaText: string, tone?: string) => void;
  onTriggerQuickPolish?: () => void;
  hasCampaign: boolean;
  campaignTitle?: string;
}

export const AiCompanionBody: React.FC<AiCompanionBodyProps> = ({
  gender,
  onGenderChange,
  onSelectIdeaPreset,
  onTriggerQuickPolish,
  hasCampaign,
  campaignTitle,
}) => {
  const [expression, setExpression] = useState<AvatarExpression>('charming');
  const [dialogue, setDialogue] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [personalityMode, setPersonalityMode] = useState<'alluring' | 'tactical' | 'playful'>('alluring');
  const [customWhisper, setCustomWhisper] = useState('');
  const [isTypingSpeech, setIsTypingSpeech] = useState(false);

  // Female dialogue lines
  const femaleDialogues = {
    alluring: [
      "Darling, let's create something so bold they won't be able to look away.",
      "A gorgeous hook is irresistible. Give me an idea, and I'll turn it into pure gold.",
      "Looking sharp today. Ready to turn your thoughts into viral art?",
      "That open-world RPG concept? Deliciously ambitious. Let's make it legendary.",
    ],
    tactical: [
      "Target locked. LinkedIn needs prestige; X needs punch; Instagram needs visual ecstasy.",
      "Algorithmic retention hinges on the first 3 seconds. Let's craft an undeniable hook.",
      "High-converting copy isn't luck—it's precision. What angle are we deploying?",
    ],
    playful: [
      "Don't be shy! Hit that generate button and watch me work magic.",
      "Copy, paste, conquer! Let's make your feed look effortlessly elite.",
      "Ooh, that's a spicy idea! Let's drop it like a blockbuster launch trailer.",
    ],
  };

  // Male dialogue lines
  const maleDialogues = {
    alluring: [
      "Stick with me. We're about to make the entire timeline stop and stare.",
      "Confidence isn't loud, it's undeniable. Let's build your next flagship campaign.",
      "You've got the vision, I've got the execution. Let's show them how it's done.",
    ],
    tactical: [
      "Every word is currency. Cut the fluff, sharpen the edge, own the conversation.",
      "Optimal character velocity achieved. Let's cross-post across all channels seamlessly.",
      "Strategically speaking, this hook will outperform 98% of corporate noise.",
    ],
    playful: [
      "Ready to break the algorithm together? Just say the word.",
      "Paste your wildest thought in the box. I'll take care of the rest.",
      "Let's turn that idea into a multi-platform sensation.",
    ],
  };

  // Cycle speech on gender or personality change
  useEffect(() => {
    const list = gender === 'female' ? femaleDialogues[personalityMode] : maleDialogues[personalityMode];
    const randomPick = list[Math.floor(Math.random() * list.length)];
    setDialogue(randomPick);
  }, [gender, personalityMode]);

  // Update speech when campaign changes
  useEffect(() => {
    if (hasCampaign && campaignTitle) {
      setExpression('excited');
      if (gender === 'female') {
        setDialogue(`✨ "Gorgeous! '${campaignTitle}' is drafted and looking irresistible. Check out the tailored visuals below, darling."`);
      } else {
        setDialogue(`⚡ "Mission accomplished: '${campaignTitle}' is ready for deployment across LinkedIn, X, and Instagram."`);
      }
    }
  }, [hasCampaign, campaignTitle, gender]);

  const handleInspireClick = () => {
    setExpression('intrigued');
    const presets = [
      "An open-world action RPG inspired by Genshin Impact and Shangri-La Frontier featuring procedural infinite landscapes, physics combat, and deep character customization.",
      "A high-stakes AI agency breaking revenue records with autonomous growth workflows and zero headcount overhead.",
      "A luxury minimalist cyber-cafe where cyberpunk aesthetics meet artisan matcha and holographic gaming booths.",
    ];
    const picked = presets[Math.floor(Math.random() * presets.length)];
    onSelectIdeaPreset(picked, 'witty');
    setDialogue(
      gender === 'female' 
        ? "Here's a concept with irresistible charisma. Let's generate it!" 
        : "Loaded a tactical, high-converting concept. Ready when you are."
    );
  };

  const handleRoastClick = () => {
    setExpression('smug');
    if (!hasCampaign) {
      setDialogue(
        gender === 'female'
          ? "I can't roast a blank slate, darling! Give me an idea first—I promise I won't bite too hard."
          : "Nothing in the pipeline yet. Put an idea on the board so I can stress-test it."
      );
    } else {
      setDialogue(
        gender === 'female'
          ? "Your hook is bold, but let's make it even more sultry. Polish the first line with Gemini 3.1 Flash-Lite!"
          : "The structure is solid, but the CTA could strike harder. Tighten the close for maximum conversion."
      );
    }
  };

  const assistantName = gender === 'female' ? 'Aria' : 'Ren';
  const assistantTitle = gender === 'female' 
    ? 'Alluring Anime Muse & Creative Director' 
    : 'Midnight Tactician & Anime Strategist';

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative">
      {/* Top subtle highlight bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${gender === 'female' ? 'from-rose-500 via-pink-500 to-purple-600' : 'from-cyan-500 via-sky-500 to-indigo-600'}`} />

      <div className="p-5 md:p-6 flex flex-col md:flex-row items-center gap-6">
        {/* Left: Anime Avatar Body */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <div className="relative group cursor-pointer" onClick={() => setExpression(expression === 'charming' ? 'smug' : 'charming')}>
            <AnimeAvatar gender={gender} expression={expression} size="lg" />
            <div className="absolute -bottom-2 px-2.5 py-0.5 rounded-full bg-slate-950/90 border border-slate-700/80 text-[10px] font-semibold text-slate-300 flex items-center gap-1 shadow-md">
              <span className={`w-1.5 h-1.5 rounded-full ${gender === 'female' ? 'bg-pink-400' : 'bg-cyan-400'} animate-ping`} />
              <span>{assistantName}</span>
              <span className="text-slate-500">•</span>
              <span className="capitalize text-slate-400">{expression}</span>
            </div>
          </div>

          {/* Gender Selector Button Group (Male / Female Selection) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full max-w-[200px]">
            <button
              onClick={() => onGenderChange('female')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                gender === 'female'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Female (Aria)</span>
            </button>
            <button
              onClick={() => onGenderChange('male')}
              className={`flex-1 py-1.5 px-2 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all ${
                gender === 'male'
                  ? 'bg-gradient-to-r from-cyan-600 to-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Male (Ren)</span>
            </button>
          </div>
        </div>

        {/* Right: Interactive Dialogue & Quick Assistant Actions */}
        <div className="flex-1 w-full space-y-4">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base tracking-tight flex items-center gap-1.5">
                  <span>{assistantName}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                    gender === 'female' ? 'bg-pink-500/10 text-pink-300 border border-pink-500/20' : 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                  }`}>
                    Anime AI Assistant
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {assistantTitle}
              </p>
            </div>

            {/* Personality Mode Selector */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setPersonalityMode('alluring')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  personalityMode === 'alluring' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🔥 Charismatic
              </button>
              <button
                onClick={() => setPersonalityMode('tactical')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  personalityMode === 'tactical' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🧠 Tactical
              </button>
              <button
                onClick={() => setPersonalityMode('playful')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  personalityMode === 'playful' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ✨ Playful
              </button>
            </div>
          </div>

          {/* Interactive Anime Speech Bubble */}
          <div className={`relative p-4 rounded-xl border text-xs leading-relaxed font-sans shadow-inner ${
            gender === 'female' 
              ? 'bg-rose-950/20 border-rose-900/40 text-rose-100' 
              : 'bg-cyan-950/20 border-cyan-900/40 text-cyan-100'
          }`}>
            <div className="flex items-start gap-2.5">
              <MessageCircle className={`w-4 h-4 shrink-0 mt-0.5 ${gender === 'female' ? 'text-pink-400' : 'text-cyan-400'}`} />
              <div className="space-y-1">
                <span className="font-semibold text-[11px] uppercase tracking-wider text-slate-400">
                  {assistantName}'s Direct Note:
                </span>
                <p className="text-slate-100 text-sm font-medium italic">
                  "{dialogue}"
                </p>
              </div>
            </div>
          </div>

          {/* Quick Companion Prompt Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              onClick={handleInspireClick}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                gender === 'female'
                  ? 'bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border-pink-500/30'
                  : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspire an RPG / Creative Idea</span>
            </button>

            <button
              onClick={handleRoastClick}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Critique My Hook</span>
            </button>

            <button
              onClick={() => {
                const expressions: AvatarExpression[] = ['charming', 'smug', 'focused', 'excited', 'intrigued'];
                const next = expressions[(expressions.indexOf(expression) + 1) % expressions.length];
                setExpression(next);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-colors"
              title="Change anime assistant expression"
            >
              <Smile className="w-3.5 h-3.5 text-slate-400" />
              <span>Pose: <span className="capitalize text-slate-200">{expression}</span></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

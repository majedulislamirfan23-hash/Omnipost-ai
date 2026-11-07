import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Layers, 
  Grid, 
  Columns3, 
  Cpu, 
  Download, 
  Share2, 
  Wand2, 
  ExternalLink,
  Info,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { 
  AspectRatio, 
  BackgroundTheme,
  CampaignData, 
  DeepAnalysisData, 
  HobbyAndPowerPolicy,
  ImageModel, 
  ImageResolution, 
  Platform, 
  Tone,
  UserProfile
} from './types';
import { Header } from './components/Header';
import { CampaignInput } from './components/CampaignInput';
import { PlatformCard } from './components/PlatformCard';
import { DeepAnalysisModal } from './components/DeepAnalysisModal';
import { ImageRegenerateModal } from './components/ImageRegenerateModal';
import { ImageModal } from './components/ImageModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ImageToVideoModal } from './components/ImageToVideoModal';
import { SecurityAndAccountModal } from './components/SecurityAndAccountModal';
import { AiKnowledgeReportModal } from './components/AiKnowledgeReportModal';
import { AiCompanionBody } from './components/AiCompanionBody';
import { AssistantGender } from './components/AnimeAvatar';
import { GuidelinesModal } from './components/GuidelinesModal';
import { EmailDispatchModal } from './components/EmailDispatchModal';
import { LoginModal } from './components/LoginModal';

const LOCAL_STORAGE_KEY = 'omnipost_studio_campaigns';
const USER_PROFILE_KEY = 'omnipost_user_profile';
const HOBBY_POLICY_KEY = 'omnipost_hobby_policy';
const BACKGROUND_THEME_KEY = 'omnipost_bg_theme';
const ASSISTANT_GENDER_KEY = 'omnipost_assistant_gender';

const DEFAULT_PROFILE: UserProfile = {
  id: 'usr_omnipost_elite',
  name: 'Alex Vance',
  email: 'creator@omnipost.studio',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
  role: 'Creator',
  plan: 'Pro Studio AI',
  is2FAEnabled: true,
  twoFactorMethod: 'authenticator_app',
  secretVaultActive: true,
  apiKeyConfigured: true,
  contentSafetyLevel: 'Standard',
  piiScrubbing: true,
  neverTrainOnData: true,
  sessionTimeoutMinutes: 60,
  lastActive: new Date().toISOString(),
  ipAddress: '192.0.2.42 (Encrypted Proxy)',
};

const DEFAULT_POLICY: HobbyAndPowerPolicy = {
  hobbyPolicyEnabled: true,
  hobbyPlanName: 'Community Fair-Use Tier',
  dailyGenerationQuota: 50,
  generationsUsedToday: 4,
  customBrandVoice: '',
  creativityTemperature: 0.7,
  reasoningEffort: 'medium',
  watermarkVideos: false,
  zeroLogRetention: true,
  exportFormat: 'markdown',
  allowCommercialUse: true,
};

export default function App() {
  const [campaign, setCampaign] = useState<CampaignData | null>(null);
  const [history, setHistory] = useState<CampaignData[]>([]);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(false);
  const [deepAnalysisData, setDeepAnalysisData] = useState<DeepAnalysisData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [quickEditingPlatform, setQuickEditingPlatform] = useState<Platform | null>(null);

  // Security, Account, 2FA & Policy Modals
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [hobbyPolicy, setHobbyPolicy] = useState<HobbyAndPowerPolicy>(DEFAULT_POLICY);

  // Choice Backgrounds & Single AI Body Assistant Selection
  const [backgroundTheme, setBackgroundTheme] = useState<BackgroundTheme>('cyberpunk');
  const [assistantGender, setAssistantGender] = useState<AssistantGender>('female');

  // Customer Guidelines, Email Dispatch & Login system modals
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Active idea sharing between AI Companion and CampaignInput
  const [activeIdeaInput, setActiveIdeaInput] = useState<string>(
    'An open-world action RPG inspired by Genshin Impact and Shangri-La Frontier that features procedurally generated infinite landscapes, physics-driven combat, and ultra-deep character customization down to gear craftsmanship, scars, and monster-hunting combat stances.'
  );

  // Video Reel Studio Modal
  const [videoModalData, setVideoModalData] = useState<{
    platform: Platform;
    imageUrl: string;
    prompt: string;
    ratio: AspectRatio;
  } | null>(null);

  // Active view tab (all columns vs single platform tab)
  const [activePlatformTab, setActivePlatformTab] = useState<'all' | Platform>('all');

  // Modals state
  const [regeneratePlatform, setRegeneratePlatform] = useState<Platform | null>(null);
  const [isGeneratingModalImage, setIsGeneratingModalImage] = useState(false);
  const [lightboxData, setLightboxData] = useState<{
    url: string;
    prompt: string;
    ratio: string;
  } | null>(null);

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Load history, profile, policy, background, and gender from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setHistory(parsed);
        // Pre-load latest if exists
        if (parsed.length > 0 && !campaign) {
          setCampaign(parsed[0]);
        }
      }

      const savedProfile = localStorage.getItem(USER_PROFILE_KEY);
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }

      const savedPolicy = localStorage.getItem(HOBBY_POLICY_KEY);
      if (savedPolicy) {
        setHobbyPolicy(JSON.parse(savedPolicy));
      }

      const savedTheme = localStorage.getItem(BACKGROUND_THEME_KEY) as BackgroundTheme;
      if (savedTheme) {
        setBackgroundTheme(savedTheme);
      }

      const savedGender = localStorage.getItem(ASSISTANT_GENDER_KEY) as AssistantGender;
      if (savedGender) {
        setAssistantGender(savedGender);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage data:', e);
    }
  }, []);

  // Save history to localStorage
  const saveCampaignToHistory = (newCampaign: CampaignData) => {
    setHistory((prev) => {
      const filtered = prev.filter((c) => c.id !== newCampaign.id);
      const updated = [newCampaign, ...filtered].slice(0, 20); // retain last 20
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage limit reached for campaigns:', err);
      }
      return updated;
    });
  };

  // Helper to trigger image generation for a single platform
  const generatePlatformImage = async (
    platformName: Platform,
    prompt: string,
    aspectRatio: AspectRatio,
    imageSize: ImageResolution,
    imageModel: ImageModel
  ): Promise<{ imageUrl: string; isQuotaFallback?: boolean; quotaMessage?: string } | null> => {
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          imageSize,
          modelPreference: imageModel,
          platform: platformName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Image generation failed');
      }

      return {
        imageUrl: data.imageUrl,
        isQuotaFallback: data.quotaExceeded,
        quotaMessage: data.quotaMessage,
      };
    } catch (err: any) {
      console.error(`Error generating image for ${platformName}:`, err);
      showToast(`Image generation for ${platformName} failed: ${err.message}`, 'error');
      return null;
    }
  };

  // Main campaign generation
  const handleGenerateCampaign = async (params: {
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
  }) => {
    setIsLoadingCampaign(true);
    setDeepAnalysisData(null);

    try {
      const res = await fetch('/api/generate-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idea: params.idea,
          tone: params.tone,
          customTone: params.customTone,
          audience: params.audience,
          brandVoice: hobbyPolicy.customBrandVoice || undefined,
          creativityTemperature: hobbyPolicy.creativityTemperature,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate campaign posts');
      }

      const generated = data.campaign;
      const newCampaignId = `camp_${Date.now()}`;

      // Assemble base campaign object
      const newCampaign: CampaignData = {
        id: newCampaignId,
        createdAt: new Date().toISOString(),
        originalIdea: params.idea,
        tone: params.tone === 'custom' && params.customTone ? params.customTone : params.tone,
        audience: params.audience,
        campaignTitle: generated.campaignTitle || 'Cross-Platform Campaign',
        coreAngle: generated.coreAngle || '',
        targetAudienceSummary: generated.targetAudienceSummary,
        linkedin: {
          ...generated.linkedin,
          recommendedRatio: params.linkedinRatio,
          imageSize: params.imageResolution,
          imageModel: params.imageModel,
          imageStatus: params.autoGenerateImages ? 'generating' : 'idle',
        },
        twitter: {
          ...generated.twitter,
          recommendedRatio: params.twitterRatio,
          imageSize: params.imageResolution,
          imageModel: params.imageModel,
          imageStatus: params.autoGenerateImages ? 'generating' : 'idle',
        },
        instagram: {
          ...generated.instagram,
          recommendedRatio: params.instagramRatio,
          imageSize: params.imageResolution,
          imageModel: params.imageModel,
          imageStatus: params.autoGenerateImages ? 'generating' : 'idle',
        },
      };

      setCampaign(newCampaign);
      showToast('Posts drafted successfully!', 'success');

      // If auto-generate images is enabled, run image generations concurrently
      if (params.autoGenerateImages) {
        showToast('Rendering studio visuals...', 'info');
        const [linkedinRes, twitterRes, instagramRes] = await Promise.all([
          generatePlatformImage(
            'linkedin',
            generated.linkedin.imagePrompt,
            params.linkedinRatio,
            params.imageResolution,
            params.imageModel
          ),
          generatePlatformImage(
            'twitter',
            generated.twitter.imagePrompt,
            params.twitterRatio,
            params.imageResolution,
            params.imageModel
          ),
          generatePlatformImage(
            'instagram',
            generated.instagram.imagePrompt,
            params.instagramRatio,
            params.imageResolution,
            params.imageModel
          ),
        ]);

        const completedCampaign: CampaignData = {
          ...newCampaign,
          linkedin: {
            ...newCampaign.linkedin,
            imageUrl: linkedinRes?.imageUrl || undefined,
            isQuotaFallback: linkedinRes?.isQuotaFallback,
            quotaMessage: linkedinRes?.quotaMessage,
            imageStatus: linkedinRes?.imageUrl ? 'completed' : 'error',
          },
          twitter: {
            ...newCampaign.twitter,
            imageUrl: twitterRes?.imageUrl || undefined,
            isQuotaFallback: twitterRes?.isQuotaFallback,
            quotaMessage: twitterRes?.quotaMessage,
            imageStatus: twitterRes?.imageUrl ? 'completed' : 'error',
          },
          instagram: {
            ...newCampaign.instagram,
            imageUrl: instagramRes?.imageUrl || undefined,
            isQuotaFallback: instagramRes?.isQuotaFallback,
            quotaMessage: instagramRes?.quotaMessage,
            imageStatus: instagramRes?.imageUrl ? 'completed' : 'error',
          },
        };

        setCampaign(completedCampaign);
        saveCampaignToHistory(completedCampaign);
        if (linkedinRes?.isQuotaFallback) {
          showToast('Generated native visual cards (Free tier quota 0 for photo models)', 'info');
        } else {
          showToast('Full campaign & studio images generated!');
        }
      } else {
        saveCampaignToHistory(newCampaign);
        showToast('Campaign posts drafted for LinkedIn, X & Instagram!');
      }
    } catch (err: any) {
      console.error('Campaign generation failed:', err);
      showToast(err.message || 'Generation failed', 'error');
    } finally {
      setIsLoadingCampaign(false);
    }
  };

  // Direct single platform image generation
  const handleDirectGenerateImage = async (platform: Platform) => {
    if (!campaign) return;

    const platformData = campaign[platform];
    setCampaign((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [platform]: {
          ...prev[platform],
          imageStatus: 'generating',
        },
      };
    });

    const imgRes = await generatePlatformImage(
      platform,
      platformData.imagePrompt,
      platformData.recommendedRatio,
      platformData.imageSize || '2K',
      platformData.imageModel || 'gemini-3-pro-image-preview'
    );

    setCampaign((prev) => {
      if (!prev) return null;
      const updated = {
        ...prev,
        [platform]: {
          ...prev[platform],
          imageUrl: imgRes?.imageUrl || prev[platform].imageUrl,
          isQuotaFallback: imgRes?.isQuotaFallback,
          quotaMessage: imgRes?.quotaMessage,
          imageStatus: imgRes?.imageUrl ? 'completed' : 'error',
        },
      };
      saveCampaignToHistory(updated);
      return updated;
    });

    if (imgRes?.imageUrl) {
      if (imgRes.isQuotaFallback) {
        showToast(`${platform.toUpperCase()} visual card generated (Free tier limit 0 for photos)`, 'info');
      } else {
        showToast(`${platform.toUpperCase()} studio image rendered!`);
      }
    }
  };

  // Quick edit with Gemini 3.1 Flash-Lite
  const handleQuickEdit = async (platform: Platform, action: string, tone?: string) => {
    if (!campaign) return;

    setQuickEditingPlatform(platform);
    const activeText = platform === 'twitter' 
      ? campaign.twitter.singleTweet 
      : platform === 'instagram' 
        ? campaign.instagram.caption 
        : campaign.linkedin.text;

    try {
      const res = await fetch('/api/quick-edit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: activeText,
          action,
          tone,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Quick edit failed');
      }

      const revisedText = data.resultText;

      setCampaign((prev) => {
        if (!prev) return null;
        let updatedPlatformData = { ...prev[platform] };

        if (platform === 'twitter') {
          updatedPlatformData = { ...updatedPlatformData, singleTweet: revisedText };
        } else if (platform === 'instagram') {
          updatedPlatformData = { ...updatedPlatformData, caption: revisedText };
        } else {
          updatedPlatformData = { ...updatedPlatformData, text: revisedText };
        }

        const updatedCampaign = {
          ...prev,
          [platform]: updatedPlatformData,
        };
        saveCampaignToHistory(updatedCampaign);
        return updatedCampaign;
      });

      showToast(`Applied ${action.replace('_', ' ')} with Gemini 3.1 Flash-Lite!`);
    } catch (err: any) {
      console.error('Quick edit error:', err);
      showToast(err.message || 'Quick edit failed', 'error');
    } finally {
      setQuickEditingPlatform(null);
    }
  };

  // Direct manual text edit save
  const handleUpdateContent = (platform: Platform, newText: string) => {
    if (!campaign) return;
    setCampaign((prev) => {
      if (!prev) return null;
      let updatedPlatformData = { ...prev[platform] };
      if (platform === 'twitter') {
        updatedPlatformData = { ...updatedPlatformData, singleTweet: newText };
      } else if (platform === 'instagram') {
        updatedPlatformData = { ...updatedPlatformData, caption: newText };
      } else {
        updatedPlatformData = { ...updatedPlatformData, text: newText };
      }
      const updatedCampaign = {
        ...prev,
        [platform]: updatedPlatformData,
      };
      saveCampaignToHistory(updatedCampaign);
      return updatedCampaign;
    });
    showToast('Post updated');
  };

  // Deep Analysis with Gemini 4 Argon
  const handleRunDeepAnalysis = async () => {
    if (!campaign) return;
    setIsAnalyzing(true);
    setIsAnalysisOpen(true);

    try {
      const res = await fetch('/api/deep-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignData: campaign,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Algorithmic audit failed');
      }

      setDeepAnalysisData(data.analysis);
      showToast('Gemini 4 Argon audit completed!');
    } catch (err: any) {
      console.error('Audit failed:', err);
      showToast(err.message || 'Audit failed', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Regenerate image modal action
  const handleModalRegenerateImage = async (params: {
    platform: Platform;
    prompt: string;
    aspectRatio: AspectRatio;
    imageSize: ImageResolution;
    model: ImageModel;
  }) => {
    if (!campaign) return;

    setIsGeneratingModalImage(true);
    const imgRes = await generatePlatformImage(
      params.platform,
      params.prompt,
      params.aspectRatio,
      params.imageSize,
      params.model
    );
    setIsGeneratingModalImage(false);

    if (imgRes?.imageUrl) {
      setCampaign((prev) => {
        if (!prev) return null;
        const updated = {
          ...prev,
          [params.platform]: {
            ...prev[params.platform],
            imageUrl: imgRes.imageUrl,
            isQuotaFallback: imgRes.isQuotaFallback,
            quotaMessage: imgRes.quotaMessage,
            imagePrompt: params.prompt,
            recommendedRatio: params.aspectRatio,
            imageSize: params.imageSize,
            imageModel: params.model,
            imageStatus: 'completed' as const,
          },
        };
        saveCampaignToHistory(updated);
        return updated;
      });
      if (imgRes.isQuotaFallback) {
        showToast(`Generated native visual card (${params.aspectRatio})`, 'info');
      } else {
        showToast(`Generated new ${params.aspectRatio} visual asset!`);
      }
    }
  };

  // Export full campaign to Markdown file
  const handleExportCampaign = () => {
    if (!campaign) return;

    const markdownContent = `# ${campaign.campaignTitle}
**Original Idea:** ${campaign.originalIdea}  
**Tone:** ${campaign.tone} | **Audience:** ${campaign.audience || 'General'}  
**Generated On:** ${new Date(campaign.createdAt).toLocaleString()}  

---

## 1. LinkedIn (Long-Form Reflection)
**Headline:** ${campaign.linkedin.headline}  
**Opening Hook:** ${campaign.linkedin.hook}  
**Recommended Visual Ratio:** ${campaign.linkedin.recommendedRatio}  
**Image Prompt:** ${campaign.linkedin.imagePrompt}  

### Post Body:
${campaign.linkedin.text}

**Hashtags:** ${campaign.linkedin.hashtags.join(' ')}

---

## 2. Twitter / X (Punchy & High-Engagement)
**Opening Hook:** ${campaign.twitter.hook}  
**Recommended Visual Ratio:** ${campaign.twitter.recommendedRatio}  
**Image Prompt:** ${campaign.twitter.imagePrompt}  

### Main Tweet:
${campaign.twitter.singleTweet}

${campaign.twitter.threadTweets && campaign.twitter.threadTweets.length > 0 ? `### Thread Follow-ups:\n${campaign.twitter.threadTweets.map((t, idx) => `${idx + 2}/ ${t}`).join('\n\n')}\n` : ''}
**Hashtags:** ${campaign.twitter.hashtags.join(' ')}

---

## 3. Instagram (Visual Story & High-Retention)
**Opening Hook:** ${campaign.instagram.hook}  
**Call to Action:** ${campaign.instagram.callToAction}  
**Recommended Visual Ratio:** ${campaign.instagram.recommendedRatio}  
**Image Prompt:** ${campaign.instagram.imagePrompt}  

### Caption:
${campaign.instagram.caption}

**Hashtags:**  
${campaign.instagram.hashtags.join(' ')}
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${campaign.campaignTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-campaign.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Exported campaign to Markdown!');
  };

  const getThemeBackgroundClass = (theme: BackgroundTheme) => {
    switch (theme) {
      case 'cyberpunk':
        return 'bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(14,165,233,0.15),rgba(255,255,255,0))]';
      case 'sakura':
        return 'bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(244,114,182,0.18),rgba(255,255,255,0))]';
      case 'studio':
        return 'bg-zinc-950';
      case 'fantasy':
        return 'bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(168,85,247,0.2),rgba(255,255,255,0))]';
      case 'sunset':
        return 'bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.18),rgba(255,255,255,0))]';
      default:
        return 'bg-slate-950';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBackgroundClass(backgroundTheme)} text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200 transition-colors duration-500`}>
      {/* Toast banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-2.5 text-xs font-medium backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-800 text-rose-200'
                : toast.type === 'info'
                ? 'bg-slate-900/90 border-slate-700 text-slate-200'
                : 'bg-emerald-950/90 border-emerald-800 text-emerald-200'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            ) : toast.type === 'info' ? (
              <Sparkles className="w-4 h-4 text-indigo-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* App Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAnalysis={handleRunDeepAnalysis}
        onOpenReport={() => setIsReportModalOpen(true)}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onOpenGuidelines={() => setIsGuidelinesOpen(true)}
        onOpenEmail={() => setIsEmailModalOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        hasCampaign={!!campaign}
        onExportCampaign={handleExportCampaign}
        isAnalyzing={isAnalyzing}
        userProfile={userProfile}
        backgroundTheme={backgroundTheme}
        onChangeBackground={(theme) => {
          setBackgroundTheme(theme);
          try {
            localStorage.setItem(BACKGROUND_THEME_KEY, theme);
          } catch (err) {
            console.warn(err);
          }
          showToast(`Atmosphere switched to ${theme.toUpperCase()} realm!`, 'info');
        }}
        isLoggedIn={isLoggedIn}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Centered Cute / Seductive Anime AI Guide (Male/Female Selection) */}
        <AiCompanionBody
          gender={assistantGender}
          onGenderChange={(g) => {
            setAssistantGender(g);
            try {
              localStorage.setItem(ASSISTANT_GENDER_KEY, g);
            } catch (err) {
              console.warn(err);
            }
            showToast(`Active guide: ${g === 'female' ? 'Aria (Crimson Muse)' : 'Ren (Tactician)'}`, 'info');
          }}
          onSelectIdeaPreset={(ideaText) => {
            setActiveIdeaInput(ideaText);
            showToast('AI Companion loaded concept into editor!', 'success');
          }}
          hasCampaign={!!campaign}
          campaignTitle={campaign?.campaignTitle}
        />

        {/* Campaign Creation Input Section with Paste/Copy/Clear */}
        <CampaignInput
          onGenerate={handleGenerateCampaign}
          isLoading={isLoadingCampaign}
          activeIdea={activeIdeaInput}
          onIdeaChange={(newIdea) => setActiveIdeaInput(newIdea)}
        />

        {/* Generated Output Showcase Section */}
        {campaign ? (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Campaign Summary Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 backdrop-blur-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Active Campaign
                  </span>
                  <span className="text-xs text-slate-400">Tone: <strong className="text-slate-200 capitalize">{campaign.tone}</strong></span>
                  {campaign.audience && (
                    <span className="text-xs text-slate-400 hidden sm:inline">• Audience: <strong className="text-slate-200">{campaign.audience}</strong></span>
                  )}
                </div>
                <h2 className="text-lg font-bold text-white mt-1">
                  {campaign.campaignTitle}
                </h2>
                {campaign.coreAngle && (
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    🎯 Angle: {campaign.coreAngle}
                  </p>
                )}
              </div>

              {/* View layout toggles */}
              <div className="flex items-center gap-2">
                <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setActivePlatformTab('all')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                      activePlatformTab === 'all'
                        ? 'bg-slate-800 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Columns3 className="w-3.5 h-3.5" />
                    <span>3-Column Studio</span>
                  </button>
                  <button
                    onClick={() => setActivePlatformTab('linkedin')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      activePlatformTab === 'linkedin'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => setActivePlatformTab('twitter')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      activePlatformTab === 'twitter'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Twitter / X
                  </button>
                  <button
                    onClick={() => setActivePlatformTab('instagram')}
                    className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                      activePlatformTab === 'instagram'
                        ? 'bg-pink-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Instagram
                  </button>
                </div>
              </div>
            </div>

            {/* Grid of Platform Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* LinkedIn Card */}
              {(activePlatformTab === 'all' || activePlatformTab === 'linkedin') && (
                <div className={activePlatformTab !== 'all' ? 'lg:col-span-3 max-w-2xl mx-auto w-full' : ''}>
                  <PlatformCard
                    platform="linkedin"
                    title="LinkedIn Post (Long-form)"
                    badgeColor="bg-blue-500"
                    content={campaign.linkedin}
                    onUpdateContent={handleUpdateContent}
                    onQuickEdit={handleQuickEdit}
                    onOpenRegenerateImage={(plat) => setRegeneratePlatform(plat)}
                    onOpenImageLightbox={(url, prompt, ratio) => setLightboxData({ url, prompt, ratio })}
                    onDirectGenerateImage={handleDirectGenerateImage}
                    onAnimateToVideo={(plat, img, prompt, ratio) => setVideoModalData({ platform: plat, imageUrl: img, prompt, ratio })}
                    isQuickEditing={quickEditingPlatform === 'linkedin'}
                  />
                </div>
              )}

              {/* Twitter / X Card */}
              {(activePlatformTab === 'all' || activePlatformTab === 'twitter') && (
                <div className={activePlatformTab !== 'all' ? 'lg:col-span-3 max-w-2xl mx-auto w-full' : ''}>
                  <PlatformCard
                    platform="twitter"
                    title="Twitter / X (Punchy & 280-char)"
                    badgeColor="bg-sky-400"
                    content={campaign.twitter}
                    onUpdateContent={handleUpdateContent}
                    onQuickEdit={handleQuickEdit}
                    onOpenRegenerateImage={(plat) => setRegeneratePlatform(plat)}
                    onOpenImageLightbox={(url, prompt, ratio) => setLightboxData({ url, prompt, ratio })}
                    onDirectGenerateImage={handleDirectGenerateImage}
                    onAnimateToVideo={(plat, img, prompt, ratio) => setVideoModalData({ platform: plat, imageUrl: img, prompt, ratio })}
                    isQuickEditing={quickEditingPlatform === 'twitter'}
                  />
                </div>
              )}

              {/* Instagram Card */}
              {(activePlatformTab === 'all' || activePlatformTab === 'instagram') && (
                <div className={activePlatformTab !== 'all' ? 'lg:col-span-3 max-w-2xl mx-auto w-full' : ''}>
                  <PlatformCard
                    platform="instagram"
                    title="Instagram (Visual + Hashtags)"
                    badgeColor="bg-pink-500"
                    content={campaign.instagram}
                    onUpdateContent={handleUpdateContent}
                    onQuickEdit={handleQuickEdit}
                    onOpenRegenerateImage={(plat) => setRegeneratePlatform(plat)}
                    onOpenImageLightbox={(url, prompt, ratio) => setLightboxData({ url, prompt, ratio })}
                    onDirectGenerateImage={handleDirectGenerateImage}
                    onAnimateToVideo={(plat, img, prompt, ratio) => setVideoModalData({ platform: plat, imageUrl: img, prompt, ratio })}
                    isQuickEditing={quickEditingPlatform === 'instagram'}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Empty / Onboarding State */
          <div className="py-16 text-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 shadow-lg">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-base font-bold text-white">
                Ready to Generate Your Multi-Platform Campaign
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click one of the quick test ideas above (e.g. the procedural open-world RPG inspired by Genshin Impact & Shangri-La Frontier) or type your own concept, pick your tone, and generate tailored posts and optimal aspect-ratio images simultaneously.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Image Regeneration Modal */}
      {regeneratePlatform && campaign && (
        <ImageRegenerateModal
          isOpen={!!regeneratePlatform}
          onClose={() => setRegeneratePlatform(null)}
          platform={regeneratePlatform}
          currentPrompt={campaign[regeneratePlatform].imagePrompt}
          currentRatio={campaign[regeneratePlatform].recommendedRatio}
          currentResolution={campaign[regeneratePlatform].imageSize || '2K'}
          currentModel={campaign[regeneratePlatform].imageModel || 'gemini-3-pro-image-preview'}
          onGenerate={handleModalRegenerateImage}
          isGenerating={isGeneratingModalImage}
        />
      )}

      {/* Lightbox Modal */}
      {lightboxData && (
        <ImageModal
          isOpen={!!lightboxData}
          onClose={() => setLightboxData(null)}
          imageUrl={lightboxData.url}
          prompt={lightboxData.prompt}
          aspectRatio={lightboxData.ratio}
        />
      )}

      {/* Deep Analysis Modal */}
      <DeepAnalysisModal
        isOpen={isAnalysisOpen}
        onClose={() => setIsAnalysisOpen(false)}
        data={deepAnalysisData}
        isLoading={isAnalyzing}
      />

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        campaigns={history}
        onSelectCampaign={(c) => setCampaign(c)}
        onDeleteCampaign={(id) => {
          setHistory((prev) => {
            const next = prev.filter((item) => item.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
            return next;
          });
        }}
        onClearAll={() => {
          setHistory([]);
          localStorage.removeItem(LOCAL_STORAGE_KEY);
        }}
      />

      {/* Video Reel Studio Modal */}
      {videoModalData && (
        <ImageToVideoModal
          isOpen={!!videoModalData}
          onClose={() => setVideoModalData(null)}
          platform={videoModalData.platform}
          imageUrl={videoModalData.imageUrl}
          initialPrompt={videoModalData.prompt}
          aspectRatio={videoModalData.ratio}
          onSaveVideo={(platform, videoUrl) => {
            setCampaign((prev) => {
              if (!prev) return null;
              const updated = {
                ...prev,
                [platform]: {
                  ...prev[platform],
                  videoUrl,
                  videoStatus: 'completed' as const,
                },
              };
              saveCampaignToHistory(updated);
              return updated;
            });
            showToast(`Reel saved for ${platform.toUpperCase()}!`, 'success');
          }}
        />
      )}

      {/* Account, 2FA Security, Vault & Hobby Power Modal */}
      <SecurityAndAccountModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        userProfile={userProfile}
        hobbyPolicy={hobbyPolicy}
        onUpdateProfile={(updated) => {
          setUserProfile((prev) => {
            const next = { ...prev, ...updated };
            try {
              localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(next));
            } catch (err) {
              console.warn(err);
            }
            return next;
          });
          showToast('Account security preferences updated', 'success');
        }}
        onUpdatePolicy={(updated) => {
          setHobbyPolicy((prev) => {
            const next = { ...prev, ...updated };
            try {
              localStorage.setItem(HOBBY_POLICY_KEY, JSON.stringify(next));
            } catch (err) {
              console.warn(err);
            }
            return next;
          });
          showToast('Hobby & Creator Power settings saved', 'success');
        }}
      />

      {/* AI Knowledge & Strategy Intelligence Report */}
      <AiKnowledgeReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        campaign={campaign}
      />

      {/* Guidelines Modal */}
      <GuidelinesModal
        isOpen={isGuidelinesOpen}
        onClose={() => setIsGuidelinesOpen(false)}
      />

      {/* Email Dispatch & Contact Selection Modal */}
      <EmailDispatchModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        campaign={campaign}
      />

      {/* Creator Login System & Settings Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        userProfile={userProfile}
        onLoginSuccess={(email, name) => {
          setUserProfile((prev) => {
            const next = { ...prev, email, name };
            try {
              localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(next));
            } catch (e) {
              console.warn(e);
            }
            return next;
          });
          setIsLoggedIn(true);
          showToast(`Signed in as ${name} (${email})`, 'success');
        }}
        onOpenSecuritySettings={() => {
          setIsLoginModalOpen(false);
          setIsSecurityModalOpen(true);
        }}
      />
    </div>
  );
}

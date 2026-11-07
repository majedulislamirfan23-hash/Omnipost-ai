export type Platform = 'linkedin' | 'twitter' | 'instagram';

export type Tone = 
  | 'professional'
  | 'witty'
  | 'urgent'
  | 'inspiring'
  | 'casual'
  | 'contrarian'
  | 'custom';

export type AspectRatio = '1:1' | '2:3' | '3:2' | '3:4' | '4:3' | '9:16' | '16:9' | '21:9';

export type BackgroundTheme = 'cyberpunk' | 'sakura' | 'studio' | 'fantasy' | 'sunset';

export type ImageResolution = '1K' | '2K' | '4K';

export type ImageModel = 'gemini-3-pro-image-preview' | 'gemini-nano-banana-2.1';

export interface LinkedInPost {
  headline: string;
  text: string;
  hook: string;
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
}

export interface TwitterPost {
  singleTweet: string;
  threadTweets?: string[];
  hook: string;
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
}

export interface InstagramPost {
  hook: string;
  caption: string;
  callToAction: string;
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
}

export interface CampaignData {
  id: string;
  createdAt: string;
  originalIdea: string;
  tone: string;
  audience?: string;
  campaignTitle: string;
  coreAngle: string;
  targetAudienceSummary?: string;
  linkedin: LinkedInPost;
  twitter: TwitterPost;
  instagram: InstagramPost;
}

export interface DeepAnalysisData {
  overallVerdict: string;
  scores: {
    virality: number;
    resonance: number;
    algorithmFit: number;
  };
  strengths: string[];
  risks: string[];
  platformRecommendations: {
    linkedin: string;
    twitter: string;
    instagram: string;
  };
  abTestAngles: string[];
  bestTiming: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'Creator' | 'Brand Lead' | 'Agency' | 'Hobbyist';
  plan: 'Pro Studio AI' | 'Free Tier';
  is2FAEnabled: boolean;
  twoFactorMethod: 'authenticator_app' | 'security_key' | 'none';
  secretVaultActive: boolean;
  apiKeyConfigured: boolean;
  contentSafetyLevel: 'Standard' | 'Strict' | 'Creative Freedom';
  piiScrubbing: boolean;
  neverTrainOnData: boolean;
  sessionTimeoutMinutes: number;
  lastActive: string;
  ipAddress: string;
}

export interface HobbyAndPowerPolicy {
  hobbyPolicyEnabled: boolean;
  hobbyPlanName: string;
  dailyGenerationQuota: number;
  generationsUsedToday: number;
  customBrandVoice: string;
  creativityTemperature: number; // 0.0 - 1.0
  reasoningEffort: 'low' | 'medium' | 'high';
  watermarkVideos: boolean;
  zeroLogRetention: boolean;
  exportFormat: 'markdown' | 'json' | 'html';
  allowCommercialUse: boolean;
}


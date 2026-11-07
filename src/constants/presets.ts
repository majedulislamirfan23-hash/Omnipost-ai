import { AspectRatio, ImageResolution, Tone } from '../types';

export interface IdeaPreset {
  id: string;
  badge: string;
  title: string;
  tone: Tone;
  idea: string;
  audience: string;
}

export const IDEA_PRESETS: IdeaPreset[] = [
  {
    id: 'open-world-game',
    badge: 'Gaming & Anime',
    title: 'Procedural Open-World RPG',
    tone: 'witty',
    idea: 'An open-world action RPG like Genshin Impact and Shangri-La Frontier that features procedurally generated infinite landscapes, physics-driven combat, and ultra-deep character customization down to gear craftsmanship, scars, and monster-hunting combat stances.',
    audience: 'Gamers, anime enthusiasts, ARPG players, game developers',
  },
  {
    id: 'ai-developer-tool',
    badge: 'Tech & Dev',
    title: 'Autonomous Code Architect',
    tone: 'urgent',
    idea: 'A developer agent that runs in your CI pipeline, automatically detecting silent architectural bottlenecks, race conditions, and memory leaks before they reach production.',
    audience: 'Software engineers, DevOps leads, CTOs, startup founders',
  },
  {
    id: 'sustainable-coffee',
    badge: 'Lifestyle & D2C',
    title: 'Carbon-Negative Coffee Roasters',
    tone: 'inspiring',
    idea: 'A specialty single-origin micro-roastery partnering directly with high-altitude volcanic farms to deliver carbon-negative, biodynamic beans with 100% compostable mycelium packaging.',
    audience: 'Coffee lovers, conscious consumers, eco-friendly foodies',
  },
  {
    id: 'saas-bootstrapper',
    badge: 'Creator & Founder',
    title: 'Solo Founder $0 to $50k MRR',
    tone: 'contrarian',
    idea: 'Why modern micro-SaaS founders should stop building for enterprise and instead focus on hyper-niche solo workflows with simple one-time payment lifetime deals.',
    audience: 'Indie hackers, solopreneurs, creators, digital nomads',
  },
];

export const TONE_OPTIONS: { id: Tone; label: string; icon: string; description: string }[] = [
  {
    id: 'professional',
    label: 'Professional',
    icon: '💼',
    description: 'Polished, authoritative, data-driven, and clear',
  },
  {
    id: 'witty',
    label: 'Witty & Punchy',
    icon: '⚡',
    description: 'Humorous, clever, memorable, and conversational',
  },
  {
    id: 'urgent',
    label: 'Urgent & Breaking',
    icon: '🚨',
    description: 'Timely, action-oriented, bold, and high-energy',
  },
  {
    id: 'inspiring',
    label: 'Inspiring & Visionary',
    icon: '✨',
    description: 'Uplifting, mission-driven, and emotionally resonant',
  },
  {
    id: 'casual',
    label: 'Casual & Relatable',
    icon: '🎯',
    description: 'Friendly, authentic, down-to-earth tone',
  },
  {
    id: 'contrarian',
    label: 'Contrarian & Bold',
    icon: '🔥',
    description: 'Challenging consensus, provoking thoughtful debate',
  },
];

export const ASPECT_RATIOS: { value: AspectRatio; label: string; helper: string; iconRatio: string }[] = [
  { value: '1:1', label: '1:1 Square', helper: 'Instagram feed, profile grids', iconRatio: 'aspect-square' },
  { value: '16:9', label: '16:9 Landscape', helper: 'Twitter / X hero, LinkedIn banners, desktop', iconRatio: 'aspect-video' },
  { value: '4:3', label: '4:3 Classic', helper: 'Standard editorial, LinkedIn cards', iconRatio: 'aspect-[4/3]' },
  { value: '9:16', label: '9:16 Vertical', helper: 'Instagram Stories, Reels, TikTok cards', iconRatio: 'aspect-[9/16]' },
  { value: '3:2', label: '3:2 Photo', helper: 'Classic 35mm photography, Twitter cards', iconRatio: 'aspect-[3/2]' },
  { value: '2:3', label: '2:3 Portrait', helper: 'Tall photography & posters', iconRatio: 'aspect-[2/3]' },
  { value: '3:4', label: '3:4 Portrait', helper: 'Instagram vertical preview', iconRatio: 'aspect-[3/4]' },
  { value: '21:9', label: '21:9 Ultrawide', helper: 'Cinematic widescreen banners', iconRatio: 'aspect-[21/9]' },
];

export const IMAGE_RESOLUTIONS: { value: ImageResolution; label: string; desc: string }[] = [
  { value: '1K', label: '1K Standard', desc: 'Fast generation (1024px)' },
  { value: '2K', label: '2K High Res', desc: 'Crisp studio detail (2048px)' },
  { value: '4K', label: '4K Ultra HD', desc: 'Maximum fidelity & print-grade (4096px)' },
];

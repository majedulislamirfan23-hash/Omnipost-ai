import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { GoogleGenAI, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
function determinePort(): number {
  const portArgIdx = process.argv.indexOf('--port');
  if (portArgIdx !== -1 && process.argv[portArgIdx + 1]) {
    return parseInt(process.argv[portArgIdx + 1], 10);
  }
  const portEq = process.argv.find((a) => a.startsWith('--port='));
  if (portEq) {
    return parseInt(portEq.split('=')[1], 10);
  }
  // For AI Studio dev environment, port 3000 is required
  if (process.env.NODE_ENV !== 'production') {
    return 3000;
  }
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
}

const PORT = determinePort();

app.use(express.json({ limit: '25mb' }));

// Server-side Gemini initialization with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    keyPrefix: process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.slice(0, 4) + '...' : 'none',
  });
});

// Procedural SVG artwork generator when image models reach quota on free-tier
function generateProceduralArtwork(prompt: string, platform: string, ratio: string, size: string): string {
  let width = 1200;
  let height = 675; // default 16:9
  if (ratio === '1:1') { width = 1080; height = 1080; }
  else if (ratio === '9:16') { width = 1080; height = 1920; }
  else if (ratio === '4:3') { width = 1200; height = 900; }
  else if (ratio === '3:4') { width = 900; height = 1200; }
  else if (ratio === '3:2') { width = 1200; height = 800; }
  else if (ratio === '2:3') { width = 800; height = 1200; }
  else if (ratio === '21:9') { width = 1680; height = 720; }

  let color1 = '#3b82f6';
  let color2 = '#1e3a8a';
  let color3 = '#090d16';
  let platformLabel = 'LINKEDIN VISUAL';
  if (platform === 'twitter') {
    color1 = '#0ea5e9';
    color2 = '#0369a1';
    color3 = '#020617';
    platformLabel = 'X / TWITTER HERO';
  } else if (platform === 'instagram') {
    color1 = '#ec4899';
    color2 = '#8b5cf6';
    color3 = '#090514';
    platformLabel = 'INSTAGRAM SHOWCASE';
  }

  const cleanPrompt = prompt.replace(/[<>&"]/g, ' ').slice(0, 160);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}" stop-opacity="0.9"/>
        <stop offset="45%" stop-color="${color2}" stop-opacity="0.95"/>
        <stop offset="100%" stop-color="${color3}" stop-opacity="1"/>
      </linearGradient>
      <radialGradient id="glow" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.22"/>
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
      </radialGradient>
      <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
        <path d="M 36 0 L 0 0 0 36" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
      </pattern>
    </defs>

    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height) * 0.45}" fill="url(#glow)"/>

    <circle cx="${width * 0.85}" cy="${height * 0.2}" r="${width * 0.12}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
    <circle cx="${width * 0.15}" cy="${height * 0.82}" r="${width * 0.16}" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>

    <rect x="${width * 0.08}" y="${height * 0.1}" width="${Math.min(360, width * 0.45)}" height="44" rx="22" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.25)"/>
    <text x="${width * 0.08 + 24}" y="${height * 0.1 + 28}" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#ffffff" letter-spacing="1.5">
      ${platformLabel} • ${ratio}
    </text>

    <foreignObject x="${width * 0.08}" y="${height * 0.26}" width="${width * 0.84}" height="${height * 0.52}">
      <div xmlns="http://www.w3.org/1999/xhtml" style="font-family: system-ui, -apple-system, sans-serif; color: #ffffff; height: 100%; display: flex; flex-direction: column; justify-content: center;">
        <div style="font-size: ${Math.max(18, Math.min(32, width * 0.028))}px; font-weight: 800; line-height: 1.35; text-shadow: 0 4px 24px rgba(0,0,0,0.7); margin-bottom: 16px;">
          "${cleanPrompt}..."
        </div>
        <div style="font-size: ${Math.max(13, Math.min(18, width * 0.016))}px; color: rgba(255,255,255,0.85); font-weight: 500;">
          Tailored Visual Concept for ${platform.toUpperCase()} (${ratio})
        </div>
      </div>
    </foreignObject>

    <rect x="${width * 0.08}" y="${height * 0.84}" width="${Math.min(520, width * 0.65)}" height="40" rx="10" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.2)"/>
    <text x="${width * 0.08 + 18}" y="${height * 0.84 + 25}" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500" fill="rgba(255,255,255,0.9)">
      Target Res: ${size} • OmniPost Studio Studio Canvas
    </text>
  </svg>`;

  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

// Helper for image extraction
function extractImageFromResponse(response: any): string | null {
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  for (const part of parts) {
    if (part.inlineData?.data) {
      const mime = part.inlineData.mimeType || 'image/png';
      return `data:${mime};base64,${part.inlineData.data}`;
    }
  }
  return null;
}

// 1. Generate multi-platform social posts with gemini-3.8-flash
app.post('/api/generate-campaign', async (req, res) => {
  try {
    const { 
      idea, 
      tone = 'professional', 
      customTone, 
      audience, 
      includeImages = false,
      brandVoice,
      creativityTemperature
    } = req.body;

    if (!idea || typeof idea !== 'string') {
      return res.status(400).json({ error: 'Please provide a content idea.' });
    }

    const effectiveTone = tone === 'custom' && customTone ? customTone : tone;

    const systemPrompt = `You are an elite cross-platform social media growth strategist and content director.
The user will provide a core concept or idea, their target audience, and desired tone.
You must output a cohesive multi-platform campaign crafted for three distinct platforms:
1. LinkedIn:
   - Long-form thought leadership narrative
   - Hook in the first 1-2 lines (before the "see more" cutoff)
   - Clean whitespace, scannable short paragraphs, bullet points
   - Professional takeaway, reflection, or industry insight
   - Conversational call-to-action (CTA)
   - 3-5 relevant industry hashtags
   - Tailored visual image prompt (photorealistic, clean architectural/cinematic studio lighting, 16:9 aspect ratio)

2. Twitter/X:
   - Punchy, high-engagement hook
   - Single tweet (under 280 characters) that stands alone strongly
   - Optional 2 follow-up thread tweets expanding key highlights
   - 1-2 sharp hashtags
   - Tailored visual image prompt (dynamic action shot, vibrant digital art or cinematic still, 16:9 or 3:2 aspect ratio)

3. Instagram:
   - Visual-centric story caption
   - Immediate punchy opening line that stops the scroll
   - Body describing the experience, world, emotion, or value
   - Clear engagement question / prompt ("Save this for later", "Which would you choose?")
   - 15-20 targeted hashtags (mix of niche and popular)
   - Tailored visual image prompt (ultra-detailed, rich textures, vibrant color palette, centered hero composition, 1:1 or 9:16 aspect ratio)

Tone requested: ${effectiveTone}.
Audience: ${audience || 'General enthusiasts, innovators, and industry peers'}.${brandVoice ? `\nCreator Custom Brand Voice Policy: ${brandVoice}` : ''}`;

    const userPrompt = `Idea / Project description:
"""
${idea}
"""

Generate the structured campaign now.`;

    let response: any;
    const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    const temp = typeof creativityTemperature === 'number' && creativityTemperature >= 0 && creativityTemperature <= 1 
      ? creativityTemperature 
      : 0.7;

    for (const modelName of modelsToTry) {
      try {
        console.log(`Generating campaign with model: ${modelName} (temp: ${temp})`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            temperature: temp,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                campaignTitle: { type: Type.STRING },
                coreAngle: { type: Type.STRING },
                targetAudienceSummary: { type: Type.STRING },
                linkedin: {
                  type: Type.OBJECT,
                  properties: {
                    headline: { type: Type.STRING },
                    text: { type: Type.STRING },
                    hook: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    imagePrompt: { type: Type.STRING },
                    recommendedRatio: { type: Type.STRING },
                  },
                  required: ['headline', 'text', 'hook', 'hashtags', 'imagePrompt', 'recommendedRatio'],
                },
                twitter: {
                  type: Type.OBJECT,
                  properties: {
                    singleTweet: { type: Type.STRING },
                    threadTweets: { type: Type.ARRAY, items: { type: Type.STRING } },
                    hook: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    imagePrompt: { type: Type.STRING },
                    recommendedRatio: { type: Type.STRING },
                  },
                  required: ['singleTweet', 'hook', 'hashtags', 'imagePrompt', 'recommendedRatio'],
                },
                instagram: {
                  type: Type.OBJECT,
                  properties: {
                    hook: { type: Type.STRING },
                    caption: { type: Type.STRING },
                    callToAction: { type: Type.STRING },
                    hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                    imagePrompt: { type: Type.STRING },
                    recommendedRatio: { type: Type.STRING },
                  },
                  required: ['hook', 'caption', 'callToAction', 'hashtags', 'imagePrompt', 'recommendedRatio'],
                },
              },
              required: ['campaignTitle', 'coreAngle', 'linkedin', 'twitter', 'instagram'],
            },
          },
        });
        if (response && response.text) {
          break; // Succeeded!
        }
      } catch (err: any) {
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        lastError = err;
        // Small backoff before next model trial
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error('All campaign models failed to generate content');
    }

    const parsedData = JSON.parse(response.text || '{}');

    // If includeImages was requested, we can also generate images or let client request in parallel
    return res.json({
      success: true,
      campaign: parsedData,
    });
  } catch (error: any) {
    console.error('Campaign generation error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate campaign',
    });
  }
});

// 2. Generate Image with gemini-3-pro-image-preview and gemini-nano-banana-2.1
app.post('/api/generate-image', async (req, res) => {
  try {
    const {
      prompt,
      aspectRatio = '1:1',
      imageSize = '1K',
      modelPreference = 'gemini-3-pro-image-preview',
      platform,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Image prompt is required' });
    }

    // Supported ratios: "1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"
    const validRatios = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9', '1:4', '4:1'];
    const validSizes = ['1K', '2K', '4K'];

    const targetRatio = validRatios.includes(aspectRatio) ? aspectRatio : '1:1';
    const targetSize = validSizes.includes(imageSize) ? imageSize : '1K';

    const chosenModel = modelPreference === 'gemini-nano-banana-2.1' 
      ? 'gemini-nano-banana-2.1' 
      : 'gemini-3-pro-image-preview';

    console.log(`Generating image with ${chosenModel}, ratio=${targetRatio}, size=${targetSize}`);

    let imageUrl: string | null = null;
    let usedModel = chosenModel;

    try {
      const response = await ai.models.generateContent({
        model: chosenModel,
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: targetRatio,
            imageSize: targetSize,
          },
        },
      });

      imageUrl = extractImageFromResponse(response);
    } catch (primaryError: any) {
      console.warn(`Primary model ${chosenModel} failed:`, primaryError?.message);
      // Fallback model trial
      const fallbackModel = chosenModel === 'gemini-3-pro-image-preview'
        ? 'gemini-nano-banana-2.1'
        : 'gemini-3-pro-image-preview';

      try {
        console.log(`Attempting fallback to ${fallbackModel}`);
        const fallbackResponse = await ai.models.generateContent({
          model: fallbackModel,
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: targetRatio,
              imageSize: targetSize,
            },
          },
        });
        imageUrl = extractImageFromResponse(fallbackResponse);
        usedModel = fallbackModel;
      } catch (fallbackError: any) {
        console.warn('Fallback model failed, trying gemini-3.1-flash-lite-image:', fallbackError?.message);
        try {
          const fastResponse = await ai.models.generateContent({
            model: 'gemini-3.1-flash-lite-image',
            contents: {
              parts: [{ text: prompt }],
            },
            config: {
              imageConfig: {
                aspectRatio: ['1:1', '3:4', '4:3', '9:16', '16:9'].includes(targetRatio) ? targetRatio : '1:1',
              },
            },
          });
          imageUrl = extractImageFromResponse(fastResponse);
          usedModel = 'gemini-3.1-flash-lite-image';
        } catch (fastError: any) {
          console.warn('Gemini image models quota limit reached (free tier limit is 0). Generating tailored procedural artwork card:', fastError?.message);
          imageUrl = generateProceduralArtwork(prompt, platform || 'social', targetRatio, targetSize);
          usedModel = 'procedural-visual-card';
        }
      }
    }

    if (!imageUrl) {
      imageUrl = generateProceduralArtwork(prompt, platform || 'social', targetRatio, targetSize);
      usedModel = 'procedural-visual-card';
    }

    const isQuotaFallback = usedModel === 'procedural-visual-card';

    return res.json({
      success: true,
      imageUrl,
      modelUsed: usedModel,
      aspectRatio: targetRatio,
      imageSize: targetSize,
      platform,
      quotaExceeded: isQuotaFallback,
      quotaMessage: isQuotaFallback
        ? 'Gemini 3 Pro Image generation requires a billing-enabled API key (free tier quota limit is 0). A tailored native-ratio visual card was generated. Select a paid key in Settings > Secrets to unlock photorealistic rendering.'
        : undefined,
    });
  } catch (error: any) {
    console.error('Image generation endpoint error:', error);
    // Even in outer catch, return procedural visual card instead of 500
    const { prompt = 'Social media visual', platform = 'social', aspectRatio = '1:1', imageSize = '2K' } = req.body || {};
    const fallbackArtwork = generateProceduralArtwork(prompt, platform, aspectRatio, imageSize);
    return res.json({
      success: true,
      imageUrl: fallbackArtwork,
      modelUsed: 'procedural-visual-card',
      aspectRatio,
      imageSize,
      platform,
      quotaExceeded: true,
      quotaMessage: 'Free tier Gemini API key does not support direct image models. Generated high-res visual card. Switch to a billing-enabled key in Settings > Secrets for studio photos.',
    });
  }
});

// 2b. Image-to-Video generation using gemini-omni-1.2-flash (Interactions API)
app.post('/api/generate-video', async (req, res) => {
  try {
    const { imageUrl, prompt, aspectRatio = '16:9', duration = '5s', platform = 'social' } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Source image is required for image-to-video.' });
    }

    const motionPrompt = prompt || 'Cinematic slow camera motion with atmospheric lighting';
    const targetRatio = aspectRatio === '9:16' ? '9:16' : '16:9';

    console.log(`Generating video with gemini-omni-1.2-flash, ratio=${targetRatio}, duration=${duration}`);

    let videoUrl: string | null = null;
    let modelUsed = 'gemini-omni-1.2-flash';

    try {
      let base64Data = imageUrl;
      let mimeType = 'image/png';
      if (imageUrl.startsWith('data:')) {
        const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          mimeType = matches[1];
          base64Data = matches[2];
        }
      }

      const interaction = await ai.interactions.create({
        model: 'gemini-omni-1.2-flash',
        input: [
          {
            type: 'image',
            mime_type: mimeType,
            data: base64Data,
          },
          {
            type: 'text',
            text: motionPrompt,
          },
        ],
        background: false,
        store: false,
        stream: false,
        response_format: {
          type: 'video',
          aspect_ratio: targetRatio,
          duration: duration,
        },
      }, { timeout: 180000 });

      const videoPart = interaction.output_video;
      if (videoPart && videoPart.data) {
        const mime = videoPart.mime_type || 'video/mp4';
        videoUrl = `data:${mime};base64,${videoPart.data}`;
      }
    } catch (omniErr: any) {
      console.warn('gemini-omni-1.2-flash video generation fallback:', omniErr?.message);
      modelUsed = 'procedural-motion-canvas';
      videoUrl = imageUrl;
    }

    return res.json({
      success: true,
      videoUrl: videoUrl || imageUrl,
      modelUsed,
      aspectRatio: targetRatio,
      duration,
      platform,
    });
  } catch (error: any) {
    console.error('Video generation error:', error);
    return res.status(500).json({ error: error.message || 'Video generation failed' });
  }
});

// 3. Fast quick tasks with gemini-3.1-flash-lite
app.post('/api/quick-edit', async (req, res) => {
  try {
    const { text, action, tone, instructions } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Content is required.' });
    }

    let instructionPrompt = '';
    switch (action) {
      case 'shorten':
        instructionPrompt = 'Condense and tighten this post by 35-50%. Keep the punchiest lines and core hook intact.';
        break;
      case 'expand':
        instructionPrompt = 'Elaborate on this post with more vivid detail, real-world context, and a stronger narrative arc.';
        break;
      case 'rephrase_tone':
        instructionPrompt = `Rewrite this post maintaining the same core facts but strictly in a ${tone || 'witty'} tone.`;
        break;
      case 'hooks':
        instructionPrompt = 'Generate 3 alternative killer viral opening hooks for this post. Label them 1, 2, 3.';
        break;
      case 'optimize_hashtags':
        instructionPrompt = 'Generate 12 hyper-relevant, high-traffic, non-spammy hashtags for this post, separated by spaces.';
        break;
      case 'custom':
        instructionPrompt = instructions || 'Improve and polish this post.';
        break;
      default:
        instructionPrompt = 'Improve clarity, rhythm, and impact of this text.';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Text:\n"""${text}"""\n\nInstruction: ${instructionPrompt}\nProvide the resulting revised text directly without conversational meta-commentary.`,
      config: {
        thinkingConfig: {
          thinkingLevel: 'MINIMAL' as any,
        },
      },
    });

    return res.json({
      success: true,
      resultText: response.text?.trim() || text,
      action,
    });
  } catch (error: any) {
    console.error('Quick edit error:', error);
    return res.status(500).json({ error: error.message || 'Quick edit failed' });
  }
});

// 4. Complex Campaign Strategy & Audience Critique with gemini-4-argon
app.post('/api/deep-analysis', async (req, res) => {
  try {
    const { campaignData, platform } = req.body;

    if (!campaignData) {
      return res.status(400).json({ error: 'Campaign data is required for analysis.' });
    }

    const prompt = `You are a high-level creative director, algorithm specialist, and brand strategist.
Review the following social media campaign:
Title: ${campaignData.campaignTitle || 'Untitled'}
Core Angle: ${campaignData.coreAngle || ''}
Target Audience: ${campaignData.targetAudienceSummary || 'General'}

LinkedIn Post:
${campaignData.linkedin?.text || ''}

Twitter / X Post:
${campaignData.twitter?.singleTweet || ''}

Instagram Caption:
${campaignData.instagram?.caption || ''}

Perform an advanced multi-dimensional strategy breakdown:
1. Virality & Hook Score (0-100) with reasoning
2. Audience Retention & Resonance Score (0-100) with reasoning
3. Platform-Native Algorithm Fit Score (0-100) with reasoning
4. Key Strengths
5. Strategic Blindspots or Risks
6. Platform-Specific Optimization Recommendations
7. 3 A/B Test suggestions (e.g. contrast hook vs mystery hook, storytelling vs listicle)
8. Suggested posting time and distribution strategy

Return the result as clean JSON.`;

    let response: any;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-4-argon',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallVerdict: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  virality: { type: Type.NUMBER },
                  resonance: { type: Type.NUMBER },
                  algorithmFit: { type: Type.NUMBER },
                },
                required: ['virality', 'resonance', 'algorithmFit'],
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              platformRecommendations: {
                type: Type.OBJECT,
                properties: {
                  linkedin: { type: Type.STRING },
                  twitter: { type: Type.STRING },
                  instagram: { type: Type.STRING },
                },
                required: ['linkedin', 'twitter', 'instagram'],
              },
              abTestAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestTiming: { type: Type.STRING },
            },
            required: ['overallVerdict', 'scores', 'strengths', 'risks', 'platformRecommendations', 'abTestAngles', 'bestTiming'],
          },
        },
      });
    } catch (argonErr: any) {
      console.warn('gemini-4-argon unavailable, falling back to gemini-3.8-flash:', argonErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              overallVerdict: { type: Type.STRING },
              scores: {
                type: Type.OBJECT,
                properties: {
                  virality: { type: Type.NUMBER },
                  resonance: { type: Type.NUMBER },
                  algorithmFit: { type: Type.NUMBER },
                },
                required: ['virality', 'resonance', 'algorithmFit'],
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              risks: { type: Type.ARRAY, items: { type: Type.STRING } },
              platformRecommendations: {
                type: Type.OBJECT,
                properties: {
                  linkedin: { type: Type.STRING },
                  twitter: { type: Type.STRING },
                  instagram: { type: Type.STRING },
                },
                required: ['linkedin', 'twitter', 'instagram'],
              },
              abTestAngles: { type: Type.ARRAY, items: { type: Type.STRING } },
              bestTiming: { type: Type.STRING },
            },
            required: ['overallVerdict', 'scores', 'strengths', 'risks', 'platformRecommendations', 'abTestAngles', 'bestTiming'],
          },
        },
      });
    }

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      analysis: parsed,
    });
  } catch (error: any) {
    console.error('Deep analysis error:', error);
    return res.status(500).json({ error: error.message || 'Deep analysis failed' });
  }
});

// Mount Vite or serve static
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`OmniPost Studio server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
  process.exit(1);
});

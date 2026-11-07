import React from 'react';

export type AssistantGender = 'female' | 'male';
export type AvatarExpression = 'charming' | 'smug' | 'focused' | 'excited' | 'intrigued';

interface AnimeAvatarProps {
  gender: AssistantGender;
  expression?: AvatarExpression;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const AnimeAvatar: React.FC<AnimeAvatarProps> = ({
  gender,
  expression = 'charming',
  className = '',
  size = 'lg',
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36 md:w-44 md:h-44',
    xl: 'w-52 h-52 md:w-64 md:h-64',
  }[size];

  if (gender === 'female') {
    // Aria: Stunning Crimson/Silver Anime Muse with alluring eyes, rose-gold tones, choker, charismatic gaze
    return (
      <div className={`relative ${sizeClasses} ${className} flex items-center justify-center select-none`}>
        {/* Ambient background glow aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 via-pink-500/20 to-purple-600/30 blur-xl animate-pulse" />
        
        {/* Main anime vector canvas */}
        <svg
          viewBox="0 0 320 360"
          className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Skin gradient */}
            <linearGradient id="ariaSkin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fff2eb" />
              <stop offset="60%" stopColor="#fde2d6" />
              <stop offset="100%" stopColor="#f8cdba" />
            </linearGradient>

            {/* Hair base gradient */}
            <linearGradient id="ariaHair" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffd2df" />
              <stop offset="35%" stopColor="#f472b6" />
              <stop offset="75%" stopColor="#c026d3" />
              <stop offset="100%" stopColor="#7e22ce" />
            </linearGradient>

            {/* Front hair highlight */}
            <linearGradient id="ariaHairHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f472b6" stopOpacity="0.1" />
            </linearGradient>

            {/* Eye iris gradient */}
            <radialGradient id="ariaEye" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#ff70a6" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="85%" stopColor="#4a044e" />
              <stop offset="100%" stopColor="#2e0238" />
            </radialGradient>

            {/* Outfit gradient */}
            <linearGradient id="ariaOutfit" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#311042" />
            </linearGradient>

            {/* Gold jewelry gradient */}
            <linearGradient id="goldJewel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Back hair layers flowing outward */}
          <path
            d="M 60 120 C 30 170 20 250 50 340 C 75 350 110 320 120 280 C 100 240 85 180 95 130 Z"
            fill="url(#ariaHair)"
            opacity="0.9"
          />
          <path
            d="M 260 120 C 290 170 300 250 270 340 C 245 350 210 320 200 280 C 220 240 235 180 225 130 Z"
            fill="url(#ariaHair)"
            opacity="0.9"
          />

          {/* Shoulders & Sleek Top */}
          <path
            d="M 80 320 Q 160 290 240 320 L 265 360 L 55 360 Z"
            fill="url(#ariaOutfit)"
            stroke="#a855f7"
            strokeWidth="1.5"
          />
          {/* Subtle cleavage / clavicle aesthetic neckline */}
          <path
            d="M 125 315 Q 160 345 195 315"
            fill="#f8cdba"
            stroke="#e11d48"
            strokeWidth="1"
            opacity="0.6"
          />
          <path
            d="M 140 280 Q 160 288 180 280"
            stroke="#e29578"
            strokeWidth="1.5"
            fill="none"
            opacity="0.7"
          />

          {/* Slender Anime Neck */}
          <path
            d="M 142 220 L 140 290 Q 160 295 180 290 L 178 220 Z"
            fill="url(#ariaSkin)"
          />
          {/* Neck shadow */}
          <path
            d="M 142 220 Q 160 242 178 220 L 178 238 Q 160 255 140 238 Z"
            fill="#e29578"
            opacity="0.5"
          />

          {/* Stylish Cyberpunk/Gothic Choker with Glowing Gem */}
          <path
            d="M 140 252 Q 160 260 180 252 L 180 262 Q 160 270 140 262 Z"
            fill="#09090b"
            stroke="#ec4899"
            strokeWidth="1"
          />
          <circle cx="160" cy="261" r="5" fill="url(#goldJewel)" />
          <circle cx="160" cy="261" r="2.5" fill="#f43f5e" className="animate-pulse" />

          {/* Jaw / Face outline */}
          <path
            d="M 102 145 C 102 205 130 252 160 252 C 190 252 218 205 218 145 C 218 95 190 70 160 70 C 130 70 102 95 102 145 Z"
            fill="url(#ariaSkin)"
          />

          {/* Anime Blush on Cheeks (Adds charm/seductive appeal) */}
          <ellipse cx="120" cy="188" rx="14" ry="7" fill="#fb7185" opacity="0.45" />
          <ellipse cx="200" cy="188" rx="14" ry="7" fill="#fb7185" opacity="0.45" />
          <line x1="114" y1="187" x2="124" y2="189" stroke="#f43f5e" strokeWidth="1" opacity="0.5" />
          <line x1="196" y1="189" x2="206" y2="187" stroke="#f43f5e" strokeWidth="1" opacity="0.5" />

          {/* Delicate Anime Nose */}
          <path
            d="M 160 178 L 157 190 L 162 191"
            stroke="#e29578"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Expressive Seductive Mouth */}
          {expression === 'charming' || expression === 'smug' ? (
            <path
              d="M 150 210 Q 162 220 174 212"
              stroke="#e11d48"
              strokeWidth="2.5"
              fill="#fb7185"
              strokeLinecap="round"
            />
          ) : expression === 'excited' ? (
            <path
              d="M 151 208 Q 160 224 169 208 Z"
              fill="#e11d48"
              stroke="#9f1239"
              strokeWidth="1.5"
            />
          ) : (
            <path
              d="M 152 212 Q 160 216 168 212"
              stroke="#e11d48"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Left Eye (Alluring, with thick lashes & gradient iris) */}
          <g transform="translate(0, 0)">
            {/* Sclera */}
            <path
              d="M 115 160 Q 128 152 143 162 Q 128 174 115 160 Z"
              fill="#ffffff"
            />
            {/* Iris */}
            <ellipse cx="129" cy="163" rx="8" ry="9" fill="url(#ariaEye)" />
            {/* Pupil */}
            <ellipse cx="129" cy="164" rx="4" ry="4.5" fill="#18021e" />
            {/* Catchlights */}
            <circle cx="127" cy="160" r="2.8" fill="#ffffff" />
            <circle cx="132" cy="166" r="1.4" fill="#ffffff" />
            {/* Thick Upper Eyelash (Seductive winged eyeliner) */}
            <path
              d="M 112 161 Q 126 148 145 158 C 146 156 142 147 127 149 Z"
              fill="#18181b"
            />
            <path
              d="M 143 158 L 148 154"
              stroke="#18181b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Slender Eyebrow */}
            <path
              d="M 114 146 Q 128 138 143 145"
              stroke="#c026d3"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Right Eye (Matching alluring wink or open gaze) */}
          <g transform="translate(0, 0)">
            {/* Sclera */}
            <path
              d="M 177 162 Q 192 152 205 160 Q 192 174 177 162 Z"
              fill="#ffffff"
            />
            {/* Iris */}
            <ellipse cx="191" cy="163" rx="8" ry="9" fill="url(#ariaEye)" />
            {/* Pupil */}
            <ellipse cx="191" cy="164" rx="4" ry="4.5" fill="#18021e" />
            {/* Catchlights */}
            <circle cx="189" cy="160" r="2.8" fill="#ffffff" />
            <circle cx="194" cy="166" r="1.4" fill="#ffffff" />
            {/* Thick Upper Eyelash */}
            <path
              d="M 175 158 Q 194 148 208 161 C 206 147 192 149 177 156 Z"
              fill="#18181b"
            />
            <path
              d="M 206 160 L 211 155"
              stroke="#18181b"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Slender Eyebrow */}
            <path
              d="M 177 145 Q 192 138 206 146"
              stroke="#c026d3"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </g>

          {/* Glamorous Hair Bangs & Front Strands */}
          <path
            d="M 100 130 C 85 100 120 40 160 40 C 200 40 235 100 220 130 C 215 100 185 65 160 65 C 135 65 105 100 100 130 Z"
            fill="url(#ariaHair)"
          />
          {/* Sweeping Center Bang */}
          <path
            d="M 155 65 Q 165 110 170 148 Q 160 125 150 95 Z"
            fill="url(#ariaHair)"
          />
          {/* Left Framing Locks */}
          <path
            d="M 115 75 Q 95 130 92 205 Q 105 160 120 110 Z"
            fill="url(#ariaHair)"
          />
          <path
            d="M 98 120 Q 82 175 80 250 Q 92 195 108 140 Z"
            fill="url(#ariaHair)"
            opacity="0.85"
          />
          {/* Right Framing Locks */}
          <path
            d="M 205 75 Q 225 130 228 205 Q 215 160 200 110 Z"
            fill="url(#ariaHair)"
          />
          <path
            d="M 222 120 Q 238 175 240 250 Q 228 195 212 140 Z"
            fill="url(#ariaHair)"
            opacity="0.85"
          />

          {/* Hair Sheen & Highlights */}
          <path
            d="M 120 70 Q 160 52 200 70 Q 160 60 120 70 Z"
            fill="url(#ariaHairHighlight)"
          />

          {/* Sparkling Cyber/Anime Hair Clip */}
          <polygon
            points="220,95 230,85 240,95 230,105"
            fill="url(#goldJewel)"
            stroke="#ffffff"
            strokeWidth="1"
          />
          <circle cx="230" cy="95" r="3" fill="#ec4899" />
        </svg>

        {/* Live floating cyber sparks */}
        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-400 blur-[1px] animate-ping" />
        <div className="absolute bottom-6 left-3 w-1.5 h-1.5 rounded-full bg-purple-400 blur-[0.5px] animate-bounce" />
      </div>
    );
  }

  // Ren: Dashing Midnight Anime Rogue / Strategist with sharp gaze, cyan/amber highlights, handsome high-collar
  return (
    <div className={`relative ${sizeClasses} ${className} flex items-center justify-center select-none`}>
      {/* Ambient background glow aura */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/25 via-sky-500/20 to-indigo-600/30 blur-xl animate-pulse" />

      {/* Main anime vector canvas */}
      <svg
        viewBox="0 0 320 360"
        className="w-full h-full relative z-10 drop-shadow-2xl overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Skin gradient */}
          <linearGradient id="renSkin" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef3ec" />
            <stop offset="60%" stopColor="#f8ded0" />
            <stop offset="100%" stopColor="#eec3ae" />
          </linearGradient>

          {/* Hair base gradient */}
          <linearGradient id="renHair" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="40%" stopColor="#0f172a" />
            <stop offset="85%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Hair cyan highlight */}
          <linearGradient id="renHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Eye iris gradient */}
          <radialGradient id="renEye" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="85%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          {/* Coat & Suit gradient */}
          <linearGradient id="renCoat" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#090d16" />
            <stop offset="60%" stopColor="#111827" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Back hair spikes */}
        <polygon points="70,120 40,160 85,170" fill="url(#renHair)" />
        <polygon points="50,155 30,210 75,200" fill="url(#renHair)" />
        <polygon points="250,120 280,160 235,170" fill="url(#renHair)" />
        <polygon points="270,155 290,210 245,200" fill="url(#renHair)" />

        {/* Shoulders & High Collar Coat */}
        <path
          d="M 60 330 Q 160 300 260 330 L 285 360 L 35 360 Z"
          fill="url(#renCoat)"
          stroke="#0284c7"
          strokeWidth="1.5"
        />
        {/* Open collar shirt & handsome clavicle */}
        <polygon points="135,310 160,345 185,310 175,290 145,290" fill="#f8ded0" />
        <path d="M 148 318 Q 160 326 172 318" stroke="#eec3ae" strokeWidth="1.5" fill="none" />
        {/* Lapel collar sharp lines */}
        <path
          d="M 125 285 L 145 340 L 160 348 L 175 340 L 195 285 L 210 320 L 110 320 Z"
          fill="#020617"
          stroke="#38bdf8"
          strokeWidth="1"
        />

        {/* Strong Male Neck */}
        <path
          d="M 140 215 L 138 290 Q 160 295 182 290 L 180 215 Z"
          fill="url(#renSkin)"
        />
        {/* Neck shadow */}
        <path
          d="M 140 215 Q 160 238 180 215 L 180 235 Q 160 252 138 235 Z"
          fill="#d8a48f"
          opacity="0.45"
        />

        {/* Sharp Anime Jawline */}
        <path
          d="M 104 140 C 104 195 132 248 160 248 C 188 248 216 195 216 140 C 216 90 188 68 160 68 C 132 68 104 90 104 140 Z"
          fill="url(#renSkin)"
        />

        {/* Nose - Sharp, Defined Anime Profile */}
        <path
          d="M 160 170 L 157 188 L 164 188"
          stroke="#c98a72"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />

        {/* Confident / Smirking Mouth */}
        {expression === 'smug' || expression === 'charming' ? (
          <path
            d="M 152 210 Q 163 216 173 208"
            stroke="#991b1b"
            strokeWidth="2.2"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 152 210 Q 160 213 168 210"
            stroke="#991b1b"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Left Piercing Eye (Sharp, determined anime gaze) */}
        <g>
          {/* Sclera */}
          <path
            d="M 118 158 Q 130 152 144 160 Q 130 169 118 158 Z"
            fill="#ffffff"
          />
          {/* Iris */}
          <ellipse cx="131" cy="160" rx="7.5" ry="8" fill="url(#renEye)" />
          {/* Pupil */}
          <ellipse cx="131" cy="160" rx="3.5" ry="4" fill="#090d16" />
          {/* Catchlight */}
          <circle cx="129" cy="157" r="2.2" fill="#ffffff" />
          {/* Upper Lash Line (Sharp, intense) */}
          <path
            d="M 115 158 Q 130 148 147 157"
            stroke="#090d16"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Sharp Eyebrow */}
          <path
            d="M 114 144 Q 130 137 146 142"
            stroke="#0f172a"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Right Piercing Eye */}
        <g>
          {/* Sclera */}
          <path
            d="M 176 160 Q 190 152 202 158 Q 190 169 176 160 Z"
            fill="#ffffff"
          />
          {/* Iris */}
          <ellipse cx="189" cy="160" rx="7.5" ry="8" fill="url(#renEye)" />
          {/* Pupil */}
          <ellipse cx="189" cy="160" rx="3.5" ry="4" fill="#090d16" />
          {/* Catchlight */}
          <circle cx="187" cy="157" r="2.2" fill="#ffffff" />
          {/* Upper Lash Line */}
          <path
            d="M 173 157 Q 190 148 205 158"
            stroke="#090d16"
            strokeWidth="3.2"
            fill="none"
            strokeLinecap="round"
          />
          {/* Sharp Eyebrow */}
          <path
            d="M 174 142 Q 190 137 206 144"
            stroke="#0f172a"
            strokeWidth="2.8"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Cyber Earring on Left Ear */}
        <circle cx="102" cy="175" r="2.5" fill="#38bdf8" />
        <line x1="102" y1="177" x2="102" y2="186" stroke="#38bdf8" strokeWidth="1.5" />

        {/* Textured Disheveled Anime Hair */}
        <path
          d="M 100 120 C 85 85 115 35 160 35 C 205 35 235 85 220 120 C 210 95 185 60 160 60 C 135 60 110 95 100 120 Z"
          fill="url(#renHair)"
        />
        {/* Layered spiky bangs */}
        <polygon points="120,60 135,115 142,65" fill="url(#renHair)" />
        <polygon points="140,65 158,135 165,70" fill="url(#renHair)" />
        <polygon points="160,65 178,125 185,68" fill="url(#renHair)" />
        <polygon points="180,68 198,110 205,72" fill="url(#renHair)" />

        {/* Cyan tipped lock */}
        <polygon points="152,95 158,135 163,105" fill="url(#renHighlight)" />

        {/* Sideburn locks */}
        <polygon points="102,120 96,180 110,140" fill="url(#renHair)" />
        <polygon points="218,120 224,180 210,140" fill="url(#renHair)" />
      </svg>

      {/* Live floating cyan sparks */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-cyan-400 blur-[1px] animate-ping" />
      <div className="absolute bottom-6 right-3 w-1.5 h-1.5 rounded-full bg-sky-400 blur-[0.5px] animate-bounce" />
    </div>
  );
};

import React from "react";

export function GaneshaBlessing({ className = "" }: { className?: string }) {
  return (
    <div className={`ganesha-blessing-wrap ${className}`}>
      <div className="ganesha-emblem">
        <svg viewBox="0 0 100 100" className="ganesha-svg" aria-hidden="true">
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdf1c8" />
              <stop offset="40%" stopColor="#d4af37" />
              <stop offset="70%" stopColor="#aa7c11" />
              <stop offset="100%" stopColor="#f3e5ab" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#7d1d33" floodOpacity="0.4" />
            </filter>
          </defs>
          {/* Ornate halo */}
          <circle cx="50" cy="50" r="46" fill="none" stroke="url(#goldGrad)" strokeWidth="1.2" strokeDasharray="3 2" />
          <circle cx="50" cy="50" r="42" fill="none" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.7" />
          
          {/* Stylized Minimalist Royal Ganesha */}
          {/* Crown (Mukut) */}
          <path
            d="M50 14 L55 24 L52 24 L56 31 L44 31 L48 24 L45 24 Z"
            fill="url(#goldGrad)"
            filter="url(#goldGlow)"
          />
          {/* Tilak / Trishul */}
          <path d="M50 25 L50 33 M48 27 Q50 30 52 27" stroke="url(#goldGrad)" strokeWidth="1" fill="none" />
          {/* Head & Ears */}
          <path
            d="M36 34 Q30 35 28 42 Q26 49 33 51 Q37 52 38 48 Q39 40 46 38"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M64 34 Q70 35 72 42 Q74 49 67 51 Q63 52 62 48 Q61 40 54 38"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          {/* Brow and Trunk (Vakratunda) */}
          <path
            d="M44 37 Q50 36 56 37 Q53 47 52 56 Q51 68 59 71 Q64 73 65 68 Q66 63 60 62"
            fill="none"
            stroke="url(#goldGrad)"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
          {/* Auspicious Modak / Lotus in hand */}
          <ellipse cx="34" cy="58" rx="4" ry="5" fill="url(#goldGrad)" />
          {/* Tusk (Ekdanta) */}
          <path d="M44 50 L41 53" stroke="url(#goldGrad)" strokeWidth="1.8" strokeLinecap="round" />
          {/* Small lotus petal below */}
          <path d="M48 76 Q50 72 52 76 Q50 80 48 76 Z" fill="url(#goldGrad)" />
        </svg>
      </div>
      <div className="ganesha-mantra">
        <span className="shree-ganesh">॥ श्री गणेशाय नमः ॥</span>
        <span className="shubh-vivah">|| मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः ||</span>
      </div>
    </div>
  );
}

export function RoyalFiligreeDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`royal-filigree-divider ${className}`} aria-hidden="true">
      <svg viewBox="0 0 420 32" className="filigree-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="divGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
            <stop offset="25%" stopColor="#d4af37" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#f3e5ab" stopOpacity="1" />
            <stop offset="75%" stopColor="#d4af37" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Left flourish */}
        <path d="M30 16 H170 M70 16 Q85 11 100 16 Q115 21 130 16 M140 16 Q150 12 160 16" stroke="url(#divGold)" strokeWidth="1" fill="none" />
        <circle cx="90" cy="16" r="1.5" fill="#d4af37" />
        <circle cx="130" cy="16" r="1.5" fill="#d4af37" />
        
        {/* Center Royal Motif - Paisley & Lotus */}
        <g transform="translate(210, 16)">
          <path d="M-22 0 C-18 -8 -8 -12 0 -14 C8 -12 18 -8 22 0 C18 8 8 12 0 14 C-8 12 -18 8 -22 0 Z" fill="none" stroke="url(#divGold)" strokeWidth="1" />
          <circle cx="0" cy="0" r="4.5" fill="url(#divGold)" />
          <circle cx="-10" cy="0" r="1.8" fill="#d4af37" />
          <circle cx="10" cy="0" r="1.8" fill="#d4af37" />
          <path d="M0 -11 L0 -7 M0 7 L0 11 M-7 0 L-11 0 M7 0 L11 0" stroke="#f3e5ab" strokeWidth="1.2" />
        </g>
        
        {/* Right flourish */}
        <path d="M250 16 H390 M290 16 Q305 11 320 16 Q335 21 350 16 M360 16 Q370 12 380 16" stroke="url(#divGold)" strokeWidth="1" fill="none" />
        <circle cx="290" cy="16" r="1.5" fill="#d4af37" />
        <circle cx="330" cy="16" r="1.5" fill="#d4af37" />
      </svg>
    </div>
  );
}

export function RoyalCornerFlourish({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const transforms: Record<string, string> = {
    "top-left": "",
    "top-right": "scale(-1, 1) translate(-60, 0)",
    "bottom-left": "scale(1, -1) translate(0, -60)",
    "bottom-right": "scale(-1, -1) translate(-60, -60)",
  };

  return (
    <div className={`royal-corner-flourish corner-${position}`} aria-hidden="true">
      <svg viewBox="0 0 60 60" className="corner-svg">
        <g transform={transforms[position]}>
          <path d="M4 56 V16 Q4 4 16 4 H56" fill="none" stroke="#d4af37" strokeWidth="1.4" opacity="0.85" />
          <path d="M9 56 V20 Q9 9 20 9 H56" fill="none" stroke="#f3e5ab" strokeWidth="0.8" opacity="0.6" />
          <path d="M16 16 Q28 16 28 28 Q28 40 40 40" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.75" />
          <circle cx="16" cy="16" r="3" fill="#d4af37" />
          <circle cx="28" cy="28" r="2" fill="#f3e5ab" />
          <circle cx="4" cy="4" r="2.5" fill="#d4af37" />
        </g>
      </svg>
    </div>
  );
}

export function RoyalArchFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`royal-arch-frame ${className}`}>
      <div className="royal-arch-top">
        <svg viewBox="0 0 200 48" className="arch-cusp-svg" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient id="archGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#aa7c11" />
              <stop offset="50%" stopColor="#f3e5ab" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
          </defs>
          {/* Traditional 5-foil Indian cusped arch profile */}
          <path
            d="M0 48 C20 48 24 28 42 28 C56 28 62 14 78 14 C90 14 96 0 100 0 C104 0 110 14 122 14 C138 14 144 28 158 28 C176 28 180 48 200 48"
            fill="none"
            stroke="url(#archGold)"
            strokeWidth="2"
          />
        </svg>
      </div>
      <div className="royal-arch-body">
        {children}
      </div>
    </div>
  );
}

export function RoyalPeacockIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`royal-icon ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="peacockGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e5ab" />
          <stop offset="100%" stopColor="#c6a15b" />
        </linearGradient>
      </defs>
      {/* Crown */}
      <circle cx="14" cy="9" r="1.2" fill="url(#peacockGold)" />
      <circle cx="17" cy="8" r="1.2" fill="url(#peacockGold)" />
      <circle cx="20" cy="9" r="1.2" fill="url(#peacockGold)" />
      <path d="M14 9 L16 13 M17 8 L17 13 M20 9 L18 13" stroke="url(#peacockGold)" strokeWidth="0.8" />
      {/* Body and Neck */}
      <path
        d="M17 13 C14 15 13 18 14 22 C15 25 18 27 21 27 C24 27 27 25 28 22 C28 18 25 15 22 14"
        fill="none"
        stroke="url(#peacockGold)"
        strokeWidth="1.8"
      />
      <circle cx="16" cy="16" r="1" fill="#fff" />
      {/* Tail feathers fan */}
      <path
        d="M21 27 Q31 22 36 15 M21 27 Q34 27 38 21 M21 27 Q33 32 37 28 M21 27 Q30 35 34 34 M21 27 Q25 36 28 37"
        stroke="url(#peacockGold)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <circle cx="36" cy="15" r="2" fill="none" stroke="url(#peacockGold)" strokeWidth="1" />
      <circle cx="38" cy="21" r="2" fill="none" stroke="url(#peacockGold)" strokeWidth="1" />
      <circle cx="37" cy="28" r="2" fill="none" stroke="url(#peacockGold)" strokeWidth="1" />
      <circle cx="34" cy="34" r="2" fill="none" stroke="url(#peacockGold)" strokeWidth="1" />
    </svg>
  );
}

export function RoyalKalashIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`royal-icon ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="kalashGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdf1c8" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      {/* Coconut (Nariyal) */}
      <path d="M20 7 Q24 11 20 16 Q16 11 20 7 Z" fill="url(#kalashGold)" />
      {/* Mango leaves (Aam ke Patte) */}
      <path d="M20 14 Q14 10 10 13 Q14 16 19 16" fill="url(#kalashGold)" opacity="0.85" />
      <path d="M20 14 Q26 10 30 13 Q26 16 21 16" fill="url(#kalashGold)" opacity="0.85" />
      {/* Kalash Pot Rim */}
      <rect x="15" y="16" width="10" height="3" rx="1.5" fill="url(#kalashGold)" />
      {/* Kalash Belly */}
      <path
        d="M15 19 C12 21 10 25 12 30 C13 32 16 34 20 34 C24 34 27 32 28 30 C30 25 28 21 25 19 Z"
        fill="none"
        stroke="url(#kalashGold)"
        strokeWidth="1.8"
      />
      {/* Swastika / Sacred mark on Kalash */}
      <path d="M20 23 V29 M17 26 H23 M17 23 H20 M20 29 H23 M20 23 V26 M23 26 V29" stroke="url(#kalashGold)" strokeWidth="1" />
      {/* Base */}
      <rect x="16" y="34" width="8" height="2" rx="1" fill="url(#kalashGold)" />
    </svg>
  );
}

export function RoyalDholIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`royal-icon ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="dholGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e5ab" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      {/* Barrel */}
      <ellipse cx="14" cy="20" rx="4" ry="10" fill="none" stroke="url(#dholGold)" strokeWidth="1.8" />
      <ellipse cx="26" cy="20" rx="4" ry="10" fill="none" stroke="url(#dholGold)" strokeWidth="1.8" />
      <path d="M14 10 H26 M14 30 H26" stroke="url(#dholGold)" strokeWidth="1.8" />
      {/* Cross ropes */}
      <path d="M14 10 L26 20 L14 30 M14 20 L26 10 M14 20 L26 30" stroke="url(#dholGold)" strokeWidth="1" opacity="0.75" />
      {/* Drumsticks */}
      <line x1="8" y1="8" x2="16" y2="18" stroke="#f3e5ab" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="18" x2="32" y2="8" stroke="#f3e5ab" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function RoyalShehnaiIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`royal-icon ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="shehnaiGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f3e5ab" />
          <stop offset="100%" stopColor="#d4af37" />
        </linearGradient>
      </defs>
      {/* Shehnai pipe */}
      <path d="M10 30 L25 15 L27 17 L12 32 Z" fill="url(#shehnaiGold)" />
      {/* Bell / flared opening */}
      <path d="M25 15 C28 12 32 10 35 12 C36 15 34 19 31 22 Z" fill="url(#shehnaiGold)" />
      {/* Finger holes */}
      <circle cx="16" cy="24" r="0.9" fill="#580a1c" />
      <circle cx="19" cy="21" r="0.9" fill="#580a1c" />
      <circle cx="22" cy="18" r="0.9" fill="#580a1c" />
    </svg>
  );
}

export function RoyalHavanKundIcon({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className={`royal-icon ${className}`} aria-hidden="true">
      <defs>
        <linearGradient id="fireGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
        <linearGradient id="kundGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#aa7c11" />
          <stop offset="50%" stopColor="#f3e5ab" />
          <stop offset="100%" stopColor="#aa7c11" />
        </linearGradient>
      </defs>
      {/* Flames */}
      <path
        d="M20 6 Q23 12 21 16 Q25 13 24 10 Q28 15 25 21 Q21 24 20 21 Q19 24 15 21 Q12 15 16 10 Q15 13 19 16 Q17 12 20 6 Z"
        fill="url(#fireGrad)"
      />
      {/* Stepped Kund Layers */}
      <path d="M12 21 H28 L26 25 H14 Z" fill="url(#kundGold)" />
      <path d="M10 25 H30 L28 29 H12 Z" fill="url(#kundGold)" opacity="0.9" />
      <path d="M8 29 H32 L30 33 H10 Z" fill="url(#kundGold)" opacity="0.8" />
    </svg>
  );
}

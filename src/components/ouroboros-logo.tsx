'use client';

export default function OuroborosLogo({ size = 24, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="ouroboros-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <filter id="ouroboros-glow">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ouroboros body - snake eating its own tail forming a circle */}
      <path
        d="
          M 50 15
          C 30 15, 12 22, 8 38
          C 4 54, 10 66, 20 74
          C 30 82, 42 86, 50 85
          C 62 84, 75 78, 82 66
          C 89 54, 92 40, 88 28
          C 85 20, 78 14, 68 12
          C 58 10, 48 12, 42 18
          C 36 24, 33 32, 34 40
          C 35 48, 40 54, 46 58
          C 52 62, 56 62, 54 58
          C 52 54, 48 48, 48 42
          C 48 36, 50 30, 54 26
          C 58 22, 63 20, 68 22
          C 73 24, 77 30, 79 38
          C 81 46, 80 54, 75 62
          C 70 70, 62 76, 52 77
          C 42 78, 32 74, 24 66
          C 16 58, 12 46, 16 32
          C 20 18, 32 10, 50 10
          Z
        "
        fill="none"
        stroke="url(#ouroboros-grad)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ouroboros-glow)"
      />

      {/* Head with open mouth */}
      <ellipse cx="42" cy="17" rx="6" ry="4.5" fill="#0a0e17" stroke="url(#ouroboros-grad)" strokeWidth="2.5" />
      {/* Upper jaw */}
      <path d="M 37 15 L 42 10 L 47 15" fill="none" stroke="url(#ouroboros-grad)" strokeWidth="2" strokeLinecap="round" />
      {/* Lower jaw */}
      <path d="M 38 19 L 42.5 23 L 46.5 18.5" fill="none" stroke="url(#ouroboros-grad)" strokeWidth="2" strokeLinecap="round" />

      {/* Eye */}
      <circle cx="39" cy="13.5" r="1.8" fill="#ef4444" />
      <circle cx="38.6" cy="13.2" r="0.6" fill="#fff" opacity="0.6" />

      {/* Tail tapering into mouth */}
      <path
        d="M 47 19 L 50 25"
        stroke="#06b6d4"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

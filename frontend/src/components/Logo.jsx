import React from 'react'

// ===== مكون اللوغو SVG (الأصلي من ملف logo-svg.txt) =====
const Logo = ({ className = '', size = 48 }) => {
  return (
    <svg
      className={className}
      width={size}
      height={size * 0.5625}
      viewBox="0 0 800 450"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>LL Laptop Logo</title>
      <defs>
        <linearGradient id="ll-purple" x1="0" y1="0" x2="800" y2="397" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#4B00D8"/>
          <stop offset="0.55" stopColor="#5A00FF"/>
          <stop offset="1" stopColor="#3F00B8"/>
        </linearGradient>
      </defs>

      <g transform="translate(12 27)">
        {/* LAYER 1 — FIRST / LEFT L */}
        <path
          d="M 289 112 L 241 226 L 354 220"
          fill="none"
          stroke="url(#ll-purple)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* LAYER 2 — SECOND / RIGHT L */}
        <path
          d="M 308 140 L 264 258 L 372 251"
          fill="none"
          stroke="url(#ll-purple)"
          strokeWidth="24"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* LAYER 3 — CIRCLE */}
        <circle
          cx="300"
          cy="204"
          r="123"
          fill="none"
          stroke="url(#ll-purple)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* LAYER 4 — LAPTOP FRAME */}
        <path
          d="M 36 132 L 9 52 Q 3 31 17 16 Q 27 7 44 7 L 477 7 Q 501 7 508 29 L 619 348 Q 625 368 647 368 L 768 368 Q 778 368 778 378 Q 778 386 768 386 L 139 386"
          fill="none"
          stroke="url(#ll-purple)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 46 165 L 56 198"
          fill="none"
          stroke="url(#ll-purple)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          d="M 67 237 L 102 349 Q 110 378 139 386"
          fill="none"
          stroke="url(#ll-purple)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  )
}

export default Logo

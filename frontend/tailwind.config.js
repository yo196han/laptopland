/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'purple-primary': '#7B2FBE',
        'purple-accent': '#A855F7',
        'purple-neon': '#C084FC',
        'dark-base': '#0D0D0F',
        'dark-surface': '#1A1025',
        'dark-card': '#1E1535',
        'light-base': '#F5F3FF',
        'light-surface': '#FFFFFF',
        'light-card': '#FFFFFF',
        'facebook': '#1877F2',
        'telegram': '#229ED9',
        'whatsapp': '#25D366',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'cairo': ['Cairo', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { filter: 'drop-shadow(0 0 8px rgba(168,85,247,0.6))' },
          '50%': { filter: 'drop-shadow(0 0 20px rgba(168,85,247,0.9))' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
}

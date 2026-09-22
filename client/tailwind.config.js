/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Linear Dark Palette
        'linear-bg': '#08090a',
        'linear-surface': '#0f1013',
        'linear-card': '#0d0e11',
        'linear-elevated': '#15161b',
        'linear-overlay': '#1c1d24',
        'linear-border': 'rgba(255, 255, 255, 0.08)',
        'linear-border-hover': 'rgba(255, 255, 255, 0.16)',
        'linear-purple': '#5e6ad2',
        'linear-purple-hover': '#6f7be8',
        'linear-indigo': '#6366f1',
        
        // Brand & Energy Accents
        'voltage-lime': '#d3fb52',
        'cyan-spark': '#7af3ff',
        'mid-abyss': '#052326',
        'carbon-ink': '#14151c',
        'pure-white': '#ffffff',
        'true-black': '#000000',
        'ash': '#8a8f98',
        
        // Semantic mappings (Dark-first Linear aesthetic)
        canvas: '#08090a',
        surface: {
          DEFAULT: '#0f1013',
          elevated: '#15161b',
          subtle: '#121318',
          dark: '#08090a'
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          emphasis: 'rgba(255, 255, 255, 0.2)',
          muted: 'rgba(255, 255, 255, 0.05)'
        },
        primary: {
          DEFAULT: '#5e6ad2',
          light: '#6f7be8',
          dark: '#4b55be',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#1c1d24',
          muted: '#8a8f98',
          foreground: '#f7f8f8'
        },
        accent: {
          purple: '#5e6ad2',
          lime: '#d3fb52',
          cyan: '#7af3ff',
          green: '#22c55e',
          amber: '#f59e0b',
          red: '#ef4444',
          abyss: '#08090a'
        },

        // Craft Docs Style Tokens (both namespaced and direct aliases)
        canvas: '#fff3e7',
        ink: '#030302',
        linen: '#f7f7f7',
        cloud: '#efefef',
        stone: '#bebbba',
        graphite: '#41413f',
        mint: '#9bd8a9',
        marigold: '#fde99b',
        periwinkle: '#b8caf5',
        sky: '#9ed4ef',
        papaya: '#ff4500',
        azure: '#0087ff',
        craft: {
          canvas: '#fff3e7',
          ink: '#030302',
          white: '#ffffff',
          linen: '#f7f7f7',
          cloud: '#efefef',
          ash: '#e1e1e1',
          stone: '#bebbba',
          graphite: '#41413f',
          mint: '#9bd8a9',
          marigold: '#fde99b',
          periwinkle: '#b8caf5',
          sky: '#9ed4ef',
          papaya: '#ff4500',
          azure: '#0087ff'
        }
      },
      fontFamily: {
        serif: ['Lora', 'Merriweather', 'Fraunces', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        noigrotesk: ['Inter', 'system-ui', 'sans-serif'],
        sansplomb: ['Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        untitledseriffont: ['UntitledSerifFont', 'Lora', 'Merriweather', 'Georgia', 'serif'],
        untitledsansfont: ['UntitledSansFont', 'Inter', 'Figtree', 'system-ui', 'sans-serif'],
        craftSerif: ['UntitledSerifFont', 'Lora', 'Merriweather', 'Georgia', 'serif'],
        craftSans: ['UntitledSansFont', 'Inter', 'Figtree', 'system-ui', 'sans-serif']
      },
      spacing: {
        '60': '60px',
        '80': '80px',
        '120': '120px',
        '180': '180px',
        '188': '188px'
      },
      borderRadius: {
        'card': '16px',
        'input': '10px',
        'button': '8px',
        'navpill': '8px',
        'chip': '9999px',
        '3xl': '24px',
        '4xl': '32px',
        'craft-card': '24px',
        'craft-pill': '9999px'
      },
      boxShadow: {
        'linear-card': '0 0 0 1px rgba(255, 255, 255, 0.08), 0 4px 24px rgba(0, 0, 0, 0.6)',
        'linear-card-hover': '0 0 0 1px rgba(255, 255, 255, 0.16), 0 8px 32px rgba(0, 0, 0, 0.8)',
        'linear-button': 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 14px rgba(94, 106, 210, 0.35)',
        'linear-glow': '0 0 50px -10px rgba(94, 106, 210, 0.3)',

        // Craft multi-layered elevation shadows
        'craft-xl': 'rgba(0, 0, 0, 0.01) 0px 50px 40px 0px, rgba(0, 0, 0, 0.02) 0px 50px 40px 0px, rgba(0, 0, 0, 0.05) 0px 20px 40px 0px, rgba(0, 0, 0, 0.08) 0px 3px 10px 0px',
        'craft-sm': 'rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.1) 0px 2px 4px -2px',
        'craft-md': 'rgba(0, 0, 0, 0.1) 0px 12px 12px 2px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px',
        'craft-subtle': 'rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px'
      },

      letterSpacing: {
        'tight-40': '-0.025em',
        'tight-28': '-0.020em',
        'tight-20': '-0.015em',
        'tight-display': '-0.030em',
        'craft-display': '-2.64px',
        'craft-heading-lg': '-2.24px',
        'craft-heading': '-1.38px',
        'craft-heading-sm': '-0.72px',
        'craft-subheading': '-0.72px'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

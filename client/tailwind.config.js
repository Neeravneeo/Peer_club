/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'voltage-lime': '#d3fb52',
        'cyan-spark': '#7af3ff',
        'mid-abyss': '#052326',
        'carbon-ink': '#14151c',
        'pure-white': '#ffffff',
        'true-black': '#000000',
        'ash': '#666666',
        
        // Semantic mappings
        canvas: '#ffffff',
        surface: {
          DEFAULT: '#ffffff',
          elevated: '#f7f7f8',
          subtle: '#f2f2f4',
          dark: '#052326'
        },
        border: {
          DEFAULT: '#e5e5e5',
          emphasis: '#000000',
          muted: '#eeeeee'
        },
        primary: {
          DEFAULT: '#d3fb52',
          light: '#e1fd7b',
          dark: '#b6e036',
          foreground: '#000000'
        },
        secondary: {
          DEFAULT: '#666666',
          muted: '#8e8e93',
          foreground: '#14151c'
        },
        accent: {
          lime: '#d3fb52',
          cyan: '#7af3ff',
          green: '#16a34a',
          amber: '#d97706',
          red: '#dc2626',
          abyss: '#052326'
        }
      },
      fontFamily: {
        noigrotesk: ['NoiGrotesk', 'Inter', 'system-ui', 'sans-serif'],
        sansplomb: ['SansPlomb', 'Druk Wide', 'system-ui', 'sans-serif'],
        sans: ['NoiGrotesk', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      borderRadius: {
        'card': '24px',
        'input': '24px',
        'button': '8px',
        'navpill': '8px',
        'chip': '9999px',
        '3xl': '24px',
        '4xl': '32px'
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '40': '40px',
        '64': '64px',
        '80': '80px',
        '120': '120px'
      },
      letterSpacing: {
        'tight-40': '-0.025em',
        'tight-28': '-0.020em',
        'tight-20': '-0.015em',
        'tight-display': '-0.020em'
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

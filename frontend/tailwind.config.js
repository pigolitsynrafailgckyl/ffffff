/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        'gilroy': ['Gilroy', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'sans': ['Gilroy', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        background: '#FFFFFF',
        foreground: '#09090B',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#09090B'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#09090B'
        },
        primary: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF'
        },
        secondary: {
          DEFAULT: '#F4F4F5',
          foreground: '#18181B'
        },
        muted: {
          DEFAULT: '#F4F4F5',
          foreground: '#71717A'
        },
        accent: {
          DEFAULT: '#10B981',
          foreground: '#FFFFFF'
        },
        destructive: {
          DEFAULT: '#EF4444',
          foreground: '#FFFFFF'
        },
        border: '#000000',
        input: '#E4E4E7',
        ring: '#10B981',
        chart: {
          '1': '#10B981',
          '2': '#000000',
          '3': '#71717A',
          '4': '#F4F4F5',
          '5': '#18181B'
        }
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'marquee': {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'marquee': 'marquee 30s linear infinite'
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
        'brutal-green': '4px 4px 0px 0px rgba(16,185,129,1)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'ping-slow': 'ping 2s ease-in-out infinite',
        'text-glow': 'text-glow 2s ease-in-out infinite',
        'text-reveal': 'text-reveal 0.5s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'float-particle': 'float-particle 5s ease-in-out infinite',
      },
      keyframes: {
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'text-glow': {
          '0%, 100%': {
            'text-shadow': '0 0 20px rgba(6, 182, 212, 0.5)'
          },
          '50%': {
            'text-shadow': '0 0 40px rgba(6, 182, 212, 0.8)'
          }
        },
        'text-reveal': {
          'from': {
            'opacity': '0',
            'transform': 'translateY(20px)'
          },
          'to': {
            'opacity': '1',
            'transform': 'translateY(0)'
          }
        },
        'fade-in': {
          'from': {
            'opacity': '0'
          },
          'to': {
            'opacity': '1'
          }
        },
        'float-particle': {
          '0%, 100%': {
            'transform': 'translate(0, 0) scale(1)'
          },
          '50%': {
            'transform': 'translate(100px, -100px) scale(2)'
          }
        }
      }
    }
  },
  plugins: [],
  safelist: [
    'from-cyan-400',
    'from-violet-400',
    'to-violet-500',
    'text-cyan-400',
    'text-violet-400',
    'bg-cyan-400',
    'bg-violet-400'
  ]
};
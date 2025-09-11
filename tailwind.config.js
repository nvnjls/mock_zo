module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(59, 130, 246, 1)',
        secondary: '#8b5cf6ff',
        tertiary: '#636ff6ff',
        accent: 'rgb(246, 175, 59)',
        info: 'rgb(96, 165, 250)',         // #60A5FA
        neutral: 'rgb(51, 65, 85)',        // #334155
        muted: 'rgb(156, 163, 175)',       // #9CA3AF
        textPrimary: 'rgb(0, 38, 77)',
        textTitle: 'rgba(100, 100, 100, 1)',
        textImportant: 'rgb(255, 251, 0)',
        background: 'rgba(240, 240, 240, 1)',
        background2: 'rgba(255, 255, 255, 1)',
        foreground: 'rgb(255, 255, 255)',
        border: 'rgba(98, 0, 255, 1)',
        alert: 'rgba(255, 25, 25, 1)',
        warning: 'rgb(249, 115, 22)',      // #F97316
        transparent: 'rgba(0, 0, 0, 0)',
      },
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(51, 51, 51)',
            a: {
              color: 'rgb(30, 64, 175)',
              '&:hover': {
                color: 'rgb(29, 78, 216)',
              },
            },
            h1: {
              color: 'rgb(68, 82, 253)',
              fontWeight: '700',
            },
          },
        },
      },
      backgroundImage: {
        'glass-noise': "url('/public/images/jpg/glassNoise.jpg')",
      },
    }
  },
  plugins: [
    require('daisyui'),
    require('@tailwindcss/typography')
  ],
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'animate-blob',
    'animation-delay-2000',
    'animation-delay-4000'
  ]



}
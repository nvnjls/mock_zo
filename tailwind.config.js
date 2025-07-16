module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(255, 0, 132)',       // Electric Pink - main buttons/theme
        secondary: 'rgb(0, 255, 203)',     // Aqua Flash - secondary elements
        accent: 'rgb(255, 213, 0)',        // Lemon Zest - highlights
        textPrimary: 'rgb(0, 38, 77)',     // Deep Space - paragraph text 
        textTitle: 'rgb(255, 44, 107)',    // Pink Fury - headings
        textImportant: 'rgb(255, 251, 0)', // Electric Yellow - critical text
        background: 'rgb(255, 240, 245)',  // Cotton Candy - site background
        foreground: 'rgb(255, 255, 255)',  // Pure White - content areas
        border: 'rgb(179, 0, 255)',        // Purple Zap - borders/dividers
        alert: 'rgb(255, 25, 25)',         // Fire Engine - alerts/errors
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
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('daisyui'),
    require('@tailwindcss/typography')
  ]

}
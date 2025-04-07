module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#94fbd0',
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#333',
            a: {
              color: '#1e40af',
              '&:hover': {
                color: '#1d4ed8',
              },
            },
            h1: {
              color: '#4452fd',
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
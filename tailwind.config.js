module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'rgba(0, 68, 255, 1)',
        secondary: 'rgb(0, 255, 203)',
        accent: 'rgb(255, 213, 0)',
        textPrimary: 'rgb(0, 38, 77)',
        textTitle: 'rgba(100, 100, 100, 1)',
        textImportant: 'rgb(255, 251, 0)',
        background: 'rgba(255, 255, 255, 1)',
        foreground: 'rgb(255, 255, 255)',
        border: 'rgba(98, 0, 255, 1)',
        alert: 'rgb(255, 25, 25)',
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
/* eslint-disable @typescript-eslint/no-var-requires */
const colors = require('tailwindcss/colors')
const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.purple,
        ...colors,
      },
      fontFamily: {
        sans: ['Inter', 'serif', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'spin-fast': 'spin 0.5s linear infinite',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')({ strategy: 'class' })],
}

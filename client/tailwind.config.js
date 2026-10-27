/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#0f1013',
        card: '#18191e',
        cardHover: '#1f2026',
        cardBorder: 'rgba(255, 255, 255, 0.07)',
        steelBlue: '#3c5270',
        steelBlueLight: '#4d678c',
        stoneKhaki: '#b5b29c',
        stoneKhakiDark: '#9e9b86',
        riskRed: '#ff4d4f',
        riskAmber: '#faad14',
        riskGreen: '#52c41a',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

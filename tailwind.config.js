/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#061022',
          800: '#0A1E3D',
          700: '#0D2E5A',
          600: '#0E3D78',
          500: '#0F4A90',
        },
        blue: {
          primary: '#1565C0',
          light: '#1E88E5',
          bright: '#1A7FCA',
          card: '#0D3A6B',
        },
        gold: {
          400: '#FFD740',
          500: '#F5C200',
          600: '#E6B400',
          700: '#CC9E00',
        },
        bronze: '#CD7F32',
        silver: '#A8A9AD',
        diamond: '#B9F2FF',
      },
      fontFamily: {
        sans: ['Inter-Regular'],
        medium: ['Inter-Medium'],
        semibold: ['Inter-SemiBold'],
        bold: ['Inter-Bold'],
      },
    },
  },
  plugins: [],
};

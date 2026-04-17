/** @type {import('tailwindcss').Config} */

//los archivos ya estan 1 a 1 con al archivo colors.ts, asi mantenemos todo el proyecto con esto colores y estilos
module.exports = {
  darkMode: 'class', 
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
          surface: '#0E2A50', // Color exacto de tu colors.ts
        },
        gold: {
          400: '#FFD740',
          500: '#F5C200',
          600: '#E6B400',
        },
        levels: {
          bronze: '#CD7F32',
          bronzeBg: '#3D2010',
          silver: '#A8A9AD',
          silverBg: '#252630',
          gold: '#F5C200',
          goldBg: '#2E2200',
          diamond: '#B9F2FF',
          diamondBg: '#0A2030',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#B0C4DE',
          muted: '#708090',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
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
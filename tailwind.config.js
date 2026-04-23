/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // ─── DARK (intacto, no tocar) ──────────────────
        navy: {
          900: '#061022',
          800: '#0A1E3D',
          700: '#0D2E5A',
          600: '#0E3D78',
          500: '#0F4A90',
        },
        blue: {
          primary: '#1565C0',   // no lo toque
          light: '#1E88E5',
          bright: '#1A7FCA',
          card: '#0D3A6B',
          surface: '#0E2A50',
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

        // ─── LIGHT (nuevo bloque) ──────────────────────
        light: {
          // Fondos
          bg:       '#F4F7FA',      // pantalla general
          card:     '#FFFFFF',      // cards y modales
          surface:  '#EEF3F8',      // inputs, items de lista
          overlay:  '#DDEAF5',      // pressed/hover suave

          // Acento principal #048ABF
          accent:       '#048ABF',  // el que más destaca
          accentLight:  '#E6F4FB',  // fondo de íconos (pill suave)
          accentDark:   '#036A94',  // pressed del acento
          accentMuted:  '#B3DDF0',  // bordes con color

          // Amarillo EAB308
          gold:         '#EAB308',  // badges, gemas, logros
          goldLight:    '#FEF9C3',  // fondo pill nivel (ej: "Nivel Plata")
          goldDark:     '#B45309',  // texto sobre fondo amarillo
          goldBadge:    '#FFF3CD',  // fondo badge/pill

          // Textos
          textPrimary:  '#0F172A',  // títulos, nombres
          textSecond:   '#475569',  // subtítulos, email, labels
          textMuted:    '#94A3B8',  // placeholders, hints
          textAccent:   '#048ABF',  // links, CTAs secundarios
          textOnAccent: '#FFFFFF',  // texto sobre botón acento
          textOnGold:   '#78350F',  // texto sobre fondo amarillo

          // Niveles
          lvlBronze:    '#CD7F32',
          lvlBronzeBg:  '#FEF3E2',
          lvlSilver:    '#8C9099',
          lvlSilverBg:  '#F1F3F5',
          lvlGold:      '#EAB308',
          lvlGoldBg:    '#FEF9C3',
          lvlDiamond:   '#06B6D4',
          lvlDiamondBg: '#E0F9FF',

          // Bordes
          border:       '#E2E8F0',
          borderStrong: '#CBD5E1',
          borderAccent: '#B3DDF0',

          // Semánticos
          success:      '#16A34A',
          successBg:    '#DCFCE7',
          warning:      '#D97706',
          warningBg:    '#FEF3C7',
          error:        '#DC2626',
          errorBg:      '#FEE2E2',

          // Tab bar
          tabBg:        '#FFFFFF',
          tabActive:    '#048ABF',
          tabInactive:  '#94A3B8',
          tabBorder:    '#E2E8F0',
        },
      },
      fontFamily: {
        sans:     ['Inter-Regular'],
        medium:   ['Inter-Medium'],
        semibold: ['Inter-SemiBold'],
        bold:     ['Inter-Bold'],
      },
    },
  },
  plugins: [],
};
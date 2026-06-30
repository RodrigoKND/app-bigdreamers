import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

const ALL_CONCEPTS = [
  { emoji: '📈', title: 'Análisis de crecimiento', desc: 'Evalúa el potencial futuro de una empresa antes de decidir invertir.' },
  { emoji: '💡', title: 'Modelo de negocio', desc: 'Entender cómo la empresa genera valor es clave para identificar buenas inversiones.' },
  { emoji: '🌱', title: 'Inversión en etapa temprana', desc: 'Las startups ofrecen mayor potencial de retorno pero también más riesgo.' },
  { emoji: '🧩', title: 'Diversificación', desc: 'Distribuir tu capital en varios emprendimientos reduce el riesgo total.' },
  { emoji: '📊', title: 'Valoración empresarial', desc: 'El equipo, el mercado y el producto determinan el valor real de una empresa.' },
  { emoji: '🤝', title: 'Impacto social', desc: 'Las mejores inversiones generan valor económico y social al mismo tiempo.' },
  { emoji: '🔍', title: 'Due diligence', desc: 'Investigar a fondo antes de invertir reduce el riesgo de pérdida significativamente.' },
  { emoji: '⏱️', title: 'Horizonte temporal', desc: 'Invertir a largo plazo suele ser más efectivo que buscar ganancias inmediatas.' },
];

const FUN_FACTS = [
  '🚀 El 90% de las startups no supera los 5 años. Aprender a identificar las ganadoras es la clave.',
  '💎 Apple, Google y Amazon empezaron siendo startups antes de convertirse en gigantes globales.',
  '📈 Los inversores en etapas tempranas pueden ver retornos de 10x o más en empresas exitosas.',
  '🌍 La economía de impacto mueve más de $2 billones de dólares a nivel global.',
  '🧠 Los mejores inversores dedican más tiempo a aprender que a invertir activamente.',
  '💼 Warren Buffett comenzó a invertir a los 11 años comprando sus primeras acciones.',
  '📉 Hasta los mejores inversores del mundo cometen errores. La clave es aprender de ellos.',
];

function pickByDay<T>(arr: T[], count: number): T[] {
  const seed = Math.floor(Date.now() / 86400000);
  const result: T[] = [];
  const used = new Set<number>();
  for (let i = 0; i < count; i++) {
    let idx = (seed + i * 3) % arr.length;
    while (used.has(idx)) idx = (idx + 1) % arr.length;
    used.add(idx);
    result.push(arr[idx]);
  }
  return result;
}

export default function InvestmentInsights() {
  const { isDark } = useTheme();
  const [concepts] = useState(() => pickByDay(ALL_CONCEPTS, 3));
  const [fact] = useState(() => {
    const seed = Math.floor(Date.now() / 86400000);
    return FUN_FACTS[seed % FUN_FACTS.length];
  });

  const bg = isDark ? 'rgba(255,255,255,0.04)' : Colors.light.card;
  const border = isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border;
  const textPrimary = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.6)' : Colors.light.textMuted;

  return (
    <View className="mb-8">
      <View className="flex-row items-center mb-4 px-2">
        <Text className="font-black text-2xl tracking-tight" style={{ color: textPrimary }}>
          ¿Qué aprenderás?
        </Text>
        <View className="h-[2px] flex-1 ml-4 rounded-full" style={{ backgroundColor: border }} />
      </View>

      {concepts.map((concept, i) => (
        <View
          key={i}
          className="flex-row items-start mb-3 p-4 rounded-2xl border"
          style={{ backgroundColor: bg, borderColor: border, gap: 12 }}
        >
          <Text style={{ fontSize: 26, lineHeight: 34 }}>{concept.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ color: textPrimary, fontWeight: '700', fontSize: 14 }}>{concept.title}</Text>
            <Text style={{ color: textMuted, fontSize: 13, marginTop: 3, lineHeight: 19 }}>{concept.desc}</Text>
          </View>
        </View>
      ))}

      {/* Fun fact */}
      <View
        className="mt-1 p-4 rounded-2xl border"
        style={{
          backgroundColor: isDark ? 'rgba(255,215,64,0.06)' : 'rgba(255,215,64,0.09)',
          borderColor: isDark ? 'rgba(255,215,64,0.18)' : 'rgba(255,215,64,0.28)',
        }}
      >
        <Text style={{ color: Colors.gold[400], fontWeight: '800', fontSize: 10, marginBottom: 5, textTransform: 'uppercase', letterSpacing: 1.2 }}>
          ¿Sabías que?
        </Text>
        <Text style={{ color: textMuted, fontSize: 13, lineHeight: 20 }}>{fact}</Text>
      </View>
    </View>
  );
}

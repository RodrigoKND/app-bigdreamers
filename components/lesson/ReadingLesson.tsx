import React, { useMemo, useRef, useState, useEffect } from 'react';
import { View, Text, Pressable, Animated, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookOpen, ArrowLeft, Check } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface Props {
  content: string;
  isDark: boolean;
  gemsReward: number;
  isLast: boolean;
  completing: boolean;
  onComplete: () => void;
}

/**
 * Lectura interactiva: parte el contenido en secciones y obliga a avanzar
 * una por una (progreso + Siguiente/Anterior). El botón de completar solo
 * aparece en la última sección. Todo frontend — no toca la DB.
 */
export default function ReadingLesson({
  content,
  isDark,
  gemsReward,
  isLast,
  completing,
  onComplete,
}: Props) {
  const insets      = useSafeAreaInsets();
  const bg          = isDark ? Colors.blue.primary       : Colors.light.bg;
  const cardBg      = isDark ? 'rgba(255,255,255,0.05)'  : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.08)'  : 'rgba(0,0,0,0.05)';
  const textPrimary = isDark ? Colors.text.primary       : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.6)'   : Colors.light.textMuted;
  const textSecond  = isDark ? Colors.text.secondary     : Colors.light.textSecond;
  const accentColor = isDark ? Colors.gold[400]          : Colors.light.accent;

  // Divide por párrafos (doble salto de línea). Si no hay, intenta por
  // saltos simples; si aún así queda 1, se muestra como una sola sección.
  const sections = useMemo(() => {
    const text = (content ?? '').trim();
    if (!text) return [];
    let parts = text.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    if (parts.length <= 1) {
      parts = text.split(/\n/).map(s => s.trim()).filter(Boolean);
    }
    return parts.length > 0 ? parts : [text];
  }, [content]);

  const [idx, setIdx] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const total      = sections.length;
  const onLastPage = idx >= total - 1;

  // Animación de entrada al cambiar de sección.
  useEffect(() => {
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  }, [idx, fade]);

  // Sin contenido: mantenemos el placeholder + botón de completar.
  if (total === 0) {
    return (
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: Math.max(insets.bottom + 16, 36), paddingTop: 4 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: bg }}
      >
        <View
          className="rounded-2xl p-5 mb-6 items-center"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
        >
          <BookOpen size={32} color={textMuted} style={{ marginBottom: 12 }} />
          <Text className="text-sm text-center" style={{ color: textMuted }}>
            El contenido de esta lección estará disponible próximamente.
          </Text>
        </View>

        <Pressable
          onPress={onComplete}
          disabled={completing}
          className="rounded-2xl py-4 items-center"
          style={{ backgroundColor: completing ? (isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border) : Colors.gold[400] }}
        >
          <Text className="font-extrabold text-[15px]" style={{ color: completing ? textMuted : '#000' }}>
            {completing ? 'Guardando...' : isLast ? 'Completar módulo ✓' : 'Marcar como completada →'}
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  const progress = ((idx + 1) / total) * 100;

  const goNext = () => {
    if (!onLastPage) setIdx(i => i + 1);
  };
  const goPrev = () => {
    if (idx > 0) setIdx(i => i - 1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      {/* Progreso */}
      <View className="px-5 pt-2 pb-4 gap-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold" style={{ color: accentColor }}>
            Sección {idx + 1} de {total}
          </Text>
          <Text className="text-xs font-semibold" style={{ color: textMuted }}>
            {Math.round(progress)}%
          </Text>
        </View>
        <View
          className="h-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border }}
        >
          <View className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: accentColor }} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 28, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: fade }}>
          <View
            className="rounded-2xl p-5 mb-6"
            style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
          >
            <View className="flex-row items-center gap-2 mb-3">
              <BookOpen size={16} color={accentColor} />
              <Text className="text-[11px] font-extrabold uppercase tracking-widest" style={{ color: accentColor }}>
                Lectura
              </Text>
            </View>
            <Text className="text-[15px] leading-7" style={{ color: textSecond }}>
              {sections[idx]}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Controles */}
      <View className="px-5 pt-1 gap-3" style={{ paddingBottom: Math.max(insets.bottom + 16, 20) }}>
        {onLastPage && gemsReward > 0 && (
          <View
            className="flex-row items-center justify-center gap-2 px-4 py-2.5 rounded-2xl"
            style={{ backgroundColor: 'rgba(255,215,64,0.12)', borderWidth: 1, borderColor: 'rgba(255,215,64,0.25)' }}
          >
            <Text className="text-[13px] font-bold" style={{ color: Colors.gold[400] }}>
              Completa para ganar +{gemsReward} 💎
            </Text>
          </View>
        )}

        <View className="flex-row items-center gap-3">
          {idx > 0 && (
            <Pressable
              onPress={goPrev}
              className="rounded-2xl py-4 px-5 items-center justify-center flex-row gap-1.5"
              style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface }}
            >
              <ArrowLeft size={18} color={isDark ? '#fff' : Colors.light.textPrimary} />
              <Text className="font-bold text-[14px]" style={{ color: isDark ? '#fff' : Colors.light.textPrimary }}>
                Anterior
              </Text>
            </Pressable>
          )}

          {!onLastPage ? (
            <Pressable
              onPress={goNext}
              className="flex-1 rounded-2xl py-4 items-center"
              style={{ backgroundColor: Colors.gold[400] }}
            >
              <Text className="font-extrabold text-[15px]" style={{ color: '#000' }}>
                Siguiente →
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={onComplete}
              disabled={completing}
              className="flex-1 rounded-2xl py-4 items-center flex-row justify-center gap-2"
              style={{ backgroundColor: completing ? (isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border) : Colors.gold[400] }}
            >
              {!completing && <Check size={18} color="#000" />}
              <Text className="font-extrabold text-[15px]" style={{ color: completing ? textMuted : '#000' }}>
                {completing ? 'Guardando...' : isLast ? 'Completar módulo' : 'Completar lección'}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

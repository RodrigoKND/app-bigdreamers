import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

const TUTORIAL_KEY = 'app_tutorial_done_v1';

const STEPS = [
  {
    emoji: '👋',
    title: '¡Bienvenido a BigDreamers!',
    desc: 'Aprende a invertir de forma práctica con empresas verificadas. Te mostramos cómo funciona en 3 pasos.',
    tab: null,
  },
  {
    emoji: '📚',
    title: 'Aprende y gana gemas',
    desc: 'Ve a la pestaña Aprender y toma lecciones cortas sobre finanzas e inversión. Cada lección completada te da 💎 gemas.',
    tab: 'Aprender',
  },
  {
    emoji: '📈',
    title: 'Invierte en empresas',
    desc: 'En Invertir encontrarás empresas emprendedoras verificadas. Usa tus gemas para practicar cómo funciona la inversión.',
    tab: 'Invertir',
  },
  {
    emoji: '💎',
    title: '¿Te quedaste sin gemas?',
    desc: 'Ve a tu Perfil y toca "Recargar gemas" para comprar más y seguir invirtiendo sin límites.',
    tab: 'Perfil',
  },
];

// Anima el contenido de cada paso al montarse (fade + slide up)
function StepContent({
  step,
  isDark,
}: {
  step: (typeof STEPS)[0];
  isDark: boolean;
}) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(14);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 240 });
    ty.value = withSpring(0, { damping: 16, stiffness: 140 });
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: ty.value }],
  }));

  const textPrimary = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.62)' : Colors.light.textMuted;
  const chipBg = isDark ? 'rgba(255,215,64,0.14)' : 'rgba(255,215,64,0.18)';

  return (
    <Animated.View style={style}>
      <Text style={{ fontSize: 58, textAlign: 'center', marginBottom: 14 }}>
        {step.emoji}
      </Text>

      <Text
        style={{
          fontSize: 21,
          fontWeight: '800',
          textAlign: 'center',
          color: textPrimary,
          marginBottom: 10,
          lineHeight: 28,
        }}
      >
        {step.title}
      </Text>

      <Text
        style={{
          fontSize: 15,
          lineHeight: 23,
          textAlign: 'center',
          color: textMuted,
        }}
      >
        {step.desc}
      </Text>

      {step.tab && (
        <View style={{ alignItems: 'center', marginTop: 16 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: chipBg,
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: isDark ? 'rgba(255,215,64,0.22)' : 'rgba(255,215,64,0.3)',
            }}
          >
            <Text style={{ color: Colors.gold[400], fontWeight: '700', fontSize: 13 }}>
              Busca la pestaña
            </Text>
            <Text style={{ color: Colors.gold[400], fontWeight: '800', fontSize: 13 }}>
              {step.tab}
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

export default function AppTutorial() {
  const { isDark } = useTheme();
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(TUTORIAL_KEY).then((val) => {
      if (val !== 'true') setVisible(true);
    });
  }, []);

  const dismiss = async () => {
    await AsyncStorage.setItem(TUTORIAL_KEY, 'true');
    setVisible(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  const isLast = step === STEPS.length - 1;
  const bg = isDark ? Colors.navy[800] : '#FFFFFF';
  const textMuted = isDark ? 'rgba(255,255,255,0.55)' : Colors.light.textMuted;
  const skipBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)';

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      statusBarTranslucent
      onRequestClose={dismiss}
    >
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          backgroundColor: 'rgba(0,0,0,0.6)',
          paddingHorizontal: 14,
          paddingBottom: 34,
        }}
      >
        <View
          style={{
            backgroundColor: bg,
            borderRadius: 28,
            paddingHorizontal: 28,
            paddingTop: 28,
            paddingBottom: 28,
          }}
        >
          {/* Barra superior decorativa */}
          <View
            style={{
              width: 40,
              height: 4,
              borderRadius: 2,
              backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
              alignSelf: 'center',
              marginBottom: 22,
            }}
          />

          {/* Dots de progreso */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              gap: 6,
              marginBottom: 26,
            }}
          >
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === step ? 22 : 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor:
                    i === step
                      ? Colors.gold[400]
                      : isDark
                      ? 'rgba(255,255,255,0.18)'
                      : 'rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </View>

          {/* Contenido animado — key fuerza remount en cada step */}
          <StepContent key={step} step={STEPS[step]} isDark={isDark} />

          {/* Botones */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 28 }}>
            <Pressable
              onPress={dismiss}
              style={{
                flex: 1,
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: 'center',
                backgroundColor: skipBg,
              }}
            >
              <Text style={{ color: textMuted, fontWeight: '600', fontSize: 15 }}>
                Omitir
              </Text>
            </Pressable>

            <Pressable
              onPress={next}
              style={{
                flex: 2,
                paddingVertical: 14,
                borderRadius: 16,
                alignItems: 'center',
                backgroundColor: Colors.gold[400],
              }}
            >
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 15 }}>
                {isLast ? '¡Empezar! 🚀' : 'Siguiente →'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

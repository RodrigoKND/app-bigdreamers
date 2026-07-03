import React, { useState, useEffect } from 'react';
import { View, Text, Modal, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCircle, TrendingUp } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { updateUserGems } from '@/services/supabase/userService';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import Button from '@/components/shared/Button';

interface Props {
  currentGems: number;
  cost: number;
  companyName: string;
  userId: string | null;
  onInvested?: () => void;
}

type ModalState = 'none' | 'insufficient' | 'confirm' | 'success';

// ── Confetti ──────────────────────────────────────────────────────────────

const CONFETTI_COLORS = ['#FFD740', '#22C55E', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6', '#FFFFFF', '#FF6B6B'];

type ConfettiConfig = {
  targetX: number;
  targetY: number;
  delay: number;
  duration: number;
  color: string;
  size: number;
};

const CONFETTI_CONFIGS: ConfettiConfig[] = Array.from({ length: 22 }, (_, i) => {
  const angle = (i / 22) * Math.PI * 2;
  const distance = 65 + (i % 4) * 30;
  return {
    targetX: Math.cos(angle) * distance,
    targetY: Math.sin(angle) * distance - 72,
    delay: Math.floor(i / 6) * 70,
    duration: 900 + (i % 4) * 160,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    size: 7 + (i % 3) * 3,
  };
});

function ConfettiParticle({ active, config, index }: { active: boolean; config: ConfettiConfig; index: number }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const op = useSharedValue(0);
  const rot = useSharedValue(0);

  useEffect(() => {
    if (active) {
      tx.value = 0;
      ty.value = 0;
      op.value = 0;
      rot.value = 0;
      op.value = withDelay(
        config.delay,
        withSequence(
          withTiming(1, { duration: 120 }),
          withTiming(0, { duration: config.duration - 120, easing: Easing.out(Easing.quad) })
        )
      );
      tx.value = withDelay(config.delay, withTiming(config.targetX, { duration: config.duration, easing: Easing.out(Easing.cubic) }));
      ty.value = withDelay(config.delay, withTiming(config.targetY, { duration: config.duration, easing: Easing.out(Easing.cubic) }));
      rot.value = withDelay(config.delay, withTiming(index % 2 === 0 ? 520 : -520, { duration: config.duration }));
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rot.value}deg` },
    ],
    opacity: op.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: config.size,
          height: config.size,
          borderRadius: 2,
          backgroundColor: config.color,
        },
        style,
      ]}
    />
  );
}

// ── Animated success icon ──────────────────────────────────────────────────

function SuccessIcon({ active }: { active: boolean }) {
  const scale = useSharedValue(0);
  const rot = useSharedValue(-25);

  useEffect(() => {
    if (active) {
      scale.value = 0;
      rot.value = -25;
      scale.value = withSpring(1, { damping: 5, stiffness: 140 });
      rot.value = withSpring(0, { damping: 8, stiffness: 120 });
    }
  }, [active]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rot.value}deg` }],
  }));

  return (
    <Animated.View style={[{ alignSelf: 'center', marginBottom: 18 }, style]}>
      <View style={[iconWrap, { backgroundColor: 'rgba(34,197,94,0.18)' }]}>
        <Text style={{ fontSize: 38 }}>🎉</Text>
      </View>
    </Animated.View>
  );
}

// ── Pulsing glow behind invest button ─────────────────────────────────────

function PulsingGlow({ enabled }: { enabled: boolean }) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.45);

  useEffect(() => {
    if (enabled) {
      scale.value = withRepeat(withTiming(1.14, { duration: 1100, easing: Easing.inOut(Easing.sin) }), -1, true);
      opacity.value = withRepeat(withTiming(0.12, { duration: 1100, easing: Easing.inOut(Easing.sin) }), -1, true);
    }
  }, [enabled]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!enabled) return null;

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          top: -6,
          left: -6,
          right: -6,
          bottom: -6,
          borderRadius: 999,
          backgroundColor: Colors.gold[400],
        },
      ]}
    />
  );
}

// ── Motivational quotes ────────────────────────────────────────────────────

const INVEST_QUOTES = [
  { text: 'El mejor momento para invertir fue hace 10 años. El segundo mejor es ahora.', author: 'Warren Buffett' },
  { text: 'La inversión en conocimiento siempre paga el mejor interés.', author: 'Benjamin Franklin' },
  { text: 'El riesgo viene de no saber lo que estás haciendo.', author: 'Warren Buffett' },
  { text: 'No esperes el momento perfecto. Empieza y aprende en el camino.', author: 'BigDreamers' },
  { text: 'Cada pequeña inversión de hoy es un paso hacia tu libertad financiera.', author: 'BigDreamers' },
  { text: 'Los inversores exitosos construyen hábitos, no solo carteras.', author: 'BigDreamers' },
  { text: 'No importa cuánto dinero tienes, sino cuánto sabes hacer crecer lo que tienes.', author: 'BigDreamers' },
];

// ── Main component ─────────────────────────────────────────────────────────

export default function InvestmentControls({ currentGems, cost, companyName, userId, onInvested }: Props) {
  const { isDark } = useTheme();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [modal, setModal] = useState<ModalState>('none');
  const [quote, setQuote] = useState(INVEST_QUOTES[0]);

  const textPrimary = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const modalBg     = isDark ? (Colors.navy?.[700] ?? '#1E3A5F') : '#FFFFFF';

  const canAfford = currentGems >= cost && cost > 0;
  const missing   = Math.max(0, cost - currentGems);

  const handlePress = () => {
    if (!canAfford) {
      setModal('insufficient');
    } else {
      setModal('confirm');
    }
  };

  const confirmInvest = async () => {
    if (!userId || !canAfford) return;
    setQuote(INVEST_QUOTES[Math.floor(Math.random() * INVEST_QUOTES.length)]);
    setLoading(true);
    try {
      await updateUserGems(userId, currentGems - cost);
      await invalidateCachePattern(CacheKeys.currentUser(userId));
      setModal('success');
      onInvested?.();
    } catch {
      setModal('none');
      Alert.alert('Error', 'No se pudo completar la inversión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const goToRecharge = () => {
    setModal('none');
    router.push('/gems');
  };

  return (
    <View className="mb-8">
      <View
        className="flex-row items-center justify-between p-4 rounded-3xl border"
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card,
          borderColor: isDark ? Colors.gold[400] : Colors.light.borderAccent,
        }}
      >
        <View>
          <Text className="text-xs text-gold-500 uppercase font-bold">Tus Gemas</Text>
          <Text className="text-lg font-bold" style={{ color: textPrimary }}>{currentGems} G</Text>
        </View>

        <View style={{ position: 'relative' }}>
          <PulsingGlow enabled={canAfford} />
          <Button
            title={`Invertir · ${cost} G`}
            variant="secondary"
            size="md"
            className="px-6 rounded-full py-3"
            onPress={handlePress}
          />
        </View>
      </View>

      {/* ── Modal: no le alcanza ───────────────────────────── */}
      <Modal transparent animationType="fade" visible={modal === 'insufficient'} onRequestClose={() => setModal('none')}>
        <View style={overlay}>
          <View style={[card, { backgroundColor: modalBg }]}>
            <View style={[iconWrap, { backgroundColor: 'rgba(239,68,68,0.15)' }]}>
              <AlertCircle size={40} color="#EF4444" />
            </View>
            <Text style={[title, { color: textPrimary }]}>Gemas insuficientes</Text>
            <Text style={[body, { color: textMuted }]}>
              Para invertir en {companyName} necesitas {cost} gemas y tienes {currentGems}.
              Te faltan {missing} 💎. Puedes recargar gemas en la sección de Perfil.
            </Text>
            <View style={row}>
              <Pressable onPress={() => setModal('none')} style={[btn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface }]}>
                <Text style={{ color: textMuted, fontWeight: '700' }}>Cerrar</Text>
              </Pressable>
              <Pressable onPress={goToRecharge} style={[btn, { backgroundColor: Colors.gold[400] }]}>
                <Text style={{ color: '#000', fontWeight: '800' }}>Recargar gemas</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal: confirmar inversión ─────────────────────── */}
      <Modal transparent animationType="fade" visible={modal === 'confirm'} onRequestClose={() => setModal('none')}>
        <View style={overlay}>
          <View style={[card, { backgroundColor: modalBg }]}>
            <View style={[iconWrap, { backgroundColor: 'rgba(255,215,64,0.18)' }]}>
              <TrendingUp size={40} color={Colors.gold[400]} />
            </View>
            <Text style={[title, { color: textPrimary }]}>¿Confirmar inversión?</Text>
            <Text style={[body, { color: textMuted }]}>
              Vas a invertir <Text style={{ color: Colors.gold[400], fontWeight: '800' }}>{cost} gemas</Text> en {companyName}.
              Tu saldo quedará en {currentGems - cost} 💎.
            </Text>
            <View style={row}>
              <Pressable onPress={() => setModal('none')} disabled={loading} style={[btn, { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface }]}>
                <Text style={{ color: textMuted, fontWeight: '700' }}>Cancelar</Text>
              </Pressable>
              <Pressable onPress={confirmInvest} disabled={loading} style={[btn, { backgroundColor: Colors.gold[400], opacity: loading ? 0.6 : 1 }]}>
                {loading
                  ? <ActivityIndicator color="#000" />
                  : <Text style={{ color: '#000', fontWeight: '800' }}>Invertir</Text>}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Modal: éxito ───────────────────────────────────── */}
      <Modal transparent animationType="fade" visible={modal === 'success'} onRequestClose={() => setModal('none')}>
        <View style={overlay}>
          <View style={[card, { backgroundColor: modalBg, overflow: 'hidden' }]}>

            {/* Confetti burst from icon center */}
            <View pointerEvents="none" style={{ position: 'absolute', top: 88, left: '50%', zIndex: 0 }}>
              {CONFETTI_CONFIGS.map((config, i) => (
                <ConfettiParticle key={i} index={i} active={modal === 'success'} config={config} />
              ))}
            </View>

            <SuccessIcon active={modal === 'success'} />

            <Text style={[title, { color: textPrimary }]}>¡Inversión realizada!</Text>
            <Text style={[body, { color: textMuted }]}>
              Invertiste{' '}
              <Text style={{ color: Colors.gold[400], fontWeight: '800' }}>{cost} gemas</Text>{' '}
              en {companyName}. ¡Sigue aprendiendo!
            </Text>

            {/* Motivational quote */}
            <View style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 14,
              backgroundColor: isDark ? 'rgba(255,215,64,0.07)' : 'rgba(255,215,64,0.11)',
              borderLeftWidth: 3,
              borderLeftColor: Colors.gold[400],
            }}>
              <Text style={{ color: textMuted, fontSize: 13, fontStyle: 'italic', lineHeight: 20 }}>
                "{quote.text}"
              </Text>
              <Text style={{ color: Colors.gold[500], fontSize: 11, fontWeight: '700', marginTop: 6 }}>
                — {quote.author}
              </Text>
            </View>

            {/* Concept learned badge */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 12,
              paddingVertical: 8,
              paddingHorizontal: 14,
              borderRadius: 20,
              backgroundColor: 'rgba(34,197,94,0.12)',
            }}>
              <Text style={{ fontSize: 12, color: Colors.success, fontWeight: '600' }}>
                🧠 Aprendiste: Evaluación de emprendimientos
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <Pressable onPress={() => setModal('none')} style={[btn, { backgroundColor: Colors.gold[400] }]}>
                <Text style={{ color: '#000', fontWeight: '800' }}>¡Genial! 🚀</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const overlay = {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  justifyContent: 'center' as const,
  paddingHorizontal: 24,
};
const card = {
  borderRadius: 24,
  padding: 28,
};
const iconWrap = {
  alignSelf: 'center' as const,
  width: 72,
  height: 72,
  borderRadius: 36,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  marginBottom: 18,
};
const title = {
  fontSize: 20,
  fontWeight: '800' as const,
  textAlign: 'center' as const,
};
const body = {
  marginTop: 12,
  fontSize: 14,
  lineHeight: 21,
  textAlign: 'center' as const,
};
const row = {
  flexDirection: 'row' as const,
  justifyContent: 'space-between' as const,
  gap: 10,
  marginTop: 24,
};
const btn = {
  flex: 1,
  borderRadius: 16,
  paddingVertical: 14,
  alignItems: 'center' as const,
};

import React, { useState, useRef } from 'react';
import {
  View, Text, Pressable, Animated, ScrollView,
} from 'react-native';
import { CheckCircle, XCircle, Heart, Trophy, RotateCcw } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

export interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
  hint?: string;
}

export interface QuizData {
  type: 'quiz';
  questions: QuizQuestion[];
}

export function parseQuizContent(content: string): QuizData | null {
  try {
    const parsed = JSON.parse(content);
    if (parsed?.type === 'quiz' && Array.isArray(parsed.questions)) return parsed as QuizData;
    return null;
  } catch {
    return null;
  }
}

interface Props {
  questions:  QuizQuestion[];
  isDark:     boolean;
  lessonTitle: string;
  gemsReward: number;
  onComplete: () => void;
}

const INITIAL_LIVES = 3;

export default function QuizGame({ questions, isDark, lessonTitle, gemsReward, onComplete }: Props) {
  const [currentIdx,    setCurrentIdx]    = useState(0);
  const [selected,      setSelected]      = useState<number | null>(null);
  const [lives,         setLives]         = useState(INITIAL_LIVES);
  const [correctCount,  setCorrectCount]  = useState(0);
  const [showResult,    setShowResult]    = useState(false);
  const [gameOver,      setGameOver]      = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const question    = questions[currentIdx];
  const isAnswered  = selected !== null;
  const isCorrect   = selected === question?.correct;

  const bg          = isDark ? Colors.blue.primary        : Colors.light.bg;
  const cardBg      = isDark ? 'rgba(255,255,255,0.06)'   : Colors.light.card;
  const border      = isDark ? 'rgba(255,255,255,0.08)'   : 'rgba(0,0,0,0.05)';
  const textPrimary = isDark ? Colors.text.primary        : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.55)'   : Colors.light.textMuted;
  const textSecond  = isDark ? Colors.text.secondary      : Colors.light.textSecond;
  const accentColor = isDark ? Colors.gold[400]           : Colors.light.accent;

  function shake() {
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 10,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 6,   duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -6,  duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0,   duration: 50, useNativeDriver: true }),
    ]).start();
  }

  function handleSelect(idx: number) {
    if (isAnswered) return;
    setSelected(idx);
    if (idx === question.correct) {
      setCorrectCount(c => c + 1);
    } else {
      const next = lives - 1;
      setLives(next);
      shake();
      if (next <= 0) setGameOver(true);
    }
  }

  function handleNext() {
    if (currentIdx + 1 >= questions.length) {
      setShowResult(true);
    } else {
      setCurrentIdx(c => c + 1);
      setSelected(null);
      shakeAnim.setValue(0);
    }
  }

  function handleRetry() {
    setCurrentIdx(0);
    setSelected(null);
    setLives(INITIAL_LIVES);
    setCorrectCount(0);
    setGameOver(false);
    setShowResult(false);
    shakeAnim.setValue(0);
  }

  // ── Game Over ────────────────────────────────────────────
  if (gameOver) {
    return (
      <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: bg }}>
        <View
          className="w-24 h-24 rounded-full items-center justify-center mb-5"
          style={{ backgroundColor: 'rgba(239,68,68,0.15)' }}
        >
          <XCircle size={52} color="#EF4444" />
        </View>
        <Text className="text-[26px] font-extrabold text-center mb-2" style={{ color: textPrimary }}>
          ¡Sin vidas!
        </Text>
        <Text className="text-[15px] text-center mb-8" style={{ color: textMuted }}>
          Agotaste tus 3 vidas. Inténtalo de nuevo para completar la lección.
        </Text>
        <Pressable
          onPress={handleRetry}
          className="w-full rounded-2xl py-4 flex-row items-center justify-center gap-2"
          style={{ backgroundColor: '#EF4444' }}
        >
          <RotateCcw size={18} color="#fff" />
          <Text className="font-extrabold text-[15px] text-white">Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  // ── Result Screen ────────────────────────────────────────
  if (showResult) {
    const score      = Math.round((correctCount / questions.length) * 100);
    const isPerfect  = correctCount === questions.length;
    const trophyColor = isPerfect ? Colors.gold[400] : Colors.success;
    const trophyBg    = isPerfect ? 'rgba(255,215,64,0.18)' : 'rgba(34,197,94,0.18)';

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}
        style={{ backgroundColor: bg }}
        showsVerticalScrollIndicator={false}
      >
        <View
          className="w-28 h-28 rounded-full items-center justify-center mb-6"
          style={{ backgroundColor: trophyBg }}
        >
          <Trophy size={60} color={trophyColor} />
        </View>

        <Text className="text-[30px] font-extrabold text-center mb-2" style={{ color: textPrimary }}>
          {isPerfect ? '¡Perfecto! 🎉' : '¡Bien hecho!'}
        </Text>

        <Text className="text-[15px] text-center mb-6" style={{ color: textMuted }}>
          Respondiste {correctCount} de {questions.length} preguntas correctamente
        </Text>

        {/* Score ring */}
        <View
          className="items-center justify-center w-28 h-28 rounded-full mb-6"
          style={{ borderWidth: 5, borderColor: trophyColor }}
        >
          <Text className="text-[28px] font-extrabold" style={{ color: trophyColor }}>
            {score}%
          </Text>
        </View>

        {/* Gems earned */}
        <View
          className="flex-row items-center gap-2.5 px-6 py-3.5 rounded-2xl mb-8"
          style={{ backgroundColor: 'rgba(255,215,64,0.15)', borderWidth: 1, borderColor: 'rgba(255,215,64,0.3)' }}
        >
          <Text className="text-[22px] font-extrabold" style={{ color: Colors.gold[400] }}>
            +{gemsReward}
          </Text>
          <Text className="text-[18px]">💎</Text>
          <Text className="text-sm font-semibold" style={{ color: Colors.gold[400] }}>
            gemas ganadas
          </Text>
        </View>

        <Pressable
          onPress={onComplete}
          className="w-full rounded-2xl py-4 items-center"
          style={{ backgroundColor: Colors.gold[400] }}
        >
          <Text className="font-extrabold text-[15px]" style={{ color: '#000' }}>
            Continuar →
          </Text>
        </Pressable>
      </ScrollView>
    );
  }

  // ── Quiz Screen ──────────────────────────────────────────
  const progress = ((currentIdx) / questions.length) * 100;

  return (
    <Animated.View style={{ flex: 1, transform: [{ translateX: shakeAnim }], backgroundColor: bg }}>
      {/* Top bar: progress + lives */}
      <View className="px-5 pt-2 pb-4 gap-3">
        <View className="flex-row items-center justify-between">
          <Text className="text-xs font-bold" style={{ color: textMuted }}>
            {currentIdx + 1} / {questions.length}
          </Text>
          <View className="flex-row gap-1.5">
            {[...Array(INITIAL_LIVES)].map((_, i) => (
              <Heart
                key={i}
                size={18}
                color="#EF4444"
                fill={i < lives ? '#EF4444' : 'none'}
                strokeWidth={i < lives ? 0 : 2}
              />
            ))}
          </View>
        </View>

        <View
          className="h-2.5 rounded-full overflow-hidden"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${progress + (100 / questions.length)}%`,
              backgroundColor: accentColor,
            }}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Question */}
        <View
          className="rounded-2xl p-5 mb-5"
          style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: border }}
        >
          <Text
            className="text-[11px] font-extrabold uppercase tracking-widest mb-3"
            style={{ color: accentColor }}
          >
            Pregunta {currentIdx + 1}
          </Text>
          <Text className="text-[18px] font-bold leading-7" style={{ color: textPrimary }}>
            {question.q}
          </Text>
        </View>

        {/* Options */}
        <View className="gap-3 mb-4">
          {question.options.map((option, idx) => {
            const isSelected    = selected === idx;
            const isThisCorrect = idx === question.correct;

            let optBg     = cardBg;
            let optBorder = border;
            let optText   = textPrimary;

            if (isAnswered) {
              if (isThisCorrect) {
                optBg = 'rgba(34,197,94,0.14)';  optBorder = '#22C55E'; optText = '#22C55E';
              } else if (isSelected) {
                optBg = 'rgba(239,68,68,0.12)';   optBorder = '#EF4444'; optText = '#EF4444';
              }
            }

            const letterBg = isAnswered
              ? isThisCorrect ? 'rgba(34,197,94,0.2)' : isSelected ? 'rgba(239,68,68,0.15)' : isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface
              : isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface;

            return (
              <Pressable
                key={idx}
                onPress={() => handleSelect(idx)}
                disabled={isAnswered}
                className="rounded-2xl p-4 flex-row items-center gap-3"
                style={{ backgroundColor: optBg, borderWidth: 1.5, borderColor: optBorder }}
              >
                <View
                  className="w-8 h-8 rounded-xl items-center justify-center"
                  style={{ backgroundColor: letterBg }}
                >
                  <Text className="text-[12px] font-extrabold" style={{ color: optText }}>
                    {String.fromCharCode(65 + idx)}
                  </Text>
                </View>
                <Text className="flex-1 text-[14px] font-semibold" style={{ color: optText }}>
                  {option}
                </Text>
                {isAnswered && isThisCorrect && <CheckCircle size={20} color="#22C55E" />}
                {isAnswered && isSelected && !isThisCorrect && <XCircle size={20} color="#EF4444" />}
              </Pressable>
            );
          })}
        </View>

        {/* Hint */}
        {isAnswered && question.hint && (
          <View
            className="rounded-2xl p-4 mb-4"
            style={{
              backgroundColor: isCorrect ? 'rgba(34,197,94,0.08)'  : 'rgba(239,68,68,0.08)',
              borderWidth: 1,
              borderColor:     isCorrect ? 'rgba(34,197,94,0.3)'   : 'rgba(239,68,68,0.3)',
            }}
          >
            <Text className="text-xs font-extrabold mb-1.5" style={{ color: isCorrect ? '#22C55E' : '#EF4444' }}>
              {isCorrect ? '✓ ¡Correcto!' : '✗ Respuesta incorrecta'}
            </Text>
            <Text className="text-[13px] leading-5" style={{ color: textSecond }}>
              {question.hint}
            </Text>
          </View>
        )}

        {/* Next button */}
        {isAnswered && (
          <Pressable
            onPress={handleNext}
            className="rounded-2xl py-4 items-center"
            style={{
              backgroundColor: isCorrect
                ? Colors.gold[400]
                : isDark ? 'rgba(255,255,255,0.1)' : Colors.light.surface,
            }}
          >
            <Text
              className="font-extrabold text-[15px]"
              style={{ color: isCorrect ? '#000' : isDark ? '#fff' : Colors.light.textPrimary }}
            >
              {currentIdx + 1 >= questions.length ? 'Ver resultado 🎯' : 'Siguiente →'}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </Animated.View>
  );
}

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
} from 'react-native';
import { Lock, Play, Check } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

type ModuleStatus = 'completed' | 'active' | 'locked';
type Category = 'Finanzas' | 'Inversión' | 'Ahorro' | 'Empresa';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: number;
  completedLessons: number;
  status: ModuleStatus;
  icon: string;
}

const CATEGORIES: Category[] = ['Finanzas', 'Inversión', 'Ahorro', 'Empresa'];

const MODULES: LearningModule[] = [
  {
    id: '1',
    title: 'Fundamentos',
    description: '5 lecciones · completado',
    lessons: 5,
    completedLessons: 5,
    status: 'completed',
    icon: '💡',
  },
  {
    id: '2',
    title: 'Presupuesto',
    description: '6 lecciones · completado',
    lessons: 6,
    completedLessons: 6,
    status: 'completed',
    icon: '💳',
  },
  {
    id: '3',
    title: 'Ahorro Inteligente',
    description: 'Lección 3 de 7 · en curso',
    lessons: 7,
    completedLessons: 3,
    status: 'active',
    icon: '💰',
  },
  {
    id: '4',
    title: 'Inversiones Básicas',
    description: '8 lecciones · bloqueado',
    lessons: 8,
    completedLessons: 0,
    status: 'locked',
    icon: '📈',
  },
  {
    id: '5',
    title: 'Bolsa de Valores',
    description: '10 lecciones · bloqueado',
    lessons: 10,
    completedLessons: 0,
    status: 'locked',
    icon: '🏛️',
  },
];

function ModuleNode({
  module,
  isFirst,
  isDark,
}: {
  module: LearningModule;
  isFirst: boolean;
  isDark: boolean;
}) {
  const isCompleted = module.status === 'completed';
  const isActive = module.status === 'active';
  const isLocked = module.status === 'locked';

  const nodeSize = isActive ? 80 : 68;

  const nodeBg = isLocked
    ? isDark ? Colors.navy[700] : '#CBD5E1'
    : isCompleted
    ? Colors.gold[500]
    : Colors.gold[400];

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? Colors.text.muted : Colors.light.textMuted;

  return (
    <View className="items-center">
      {/* Connector line above */}
      {!isFirst && (
        <View
          style={{
            width: 3,
            height: 28,
            backgroundColor: isLocked
              ? isDark ? 'rgba(255,255,255,0.1)' : '#CBD5E1'
              : Colors.gold[400],
          }}
        />
      )}

      {/* Node */}
      <View
        className="items-center justify-center rounded-full"
        style={{
          width: nodeSize,
          height: nodeSize,
          backgroundColor: nodeBg,
          opacity: isLocked ? 0.45 : 1,
          borderWidth: isActive ? 4 : 0,
          borderColor: isDark ? Colors.navy[600] : '#BFDBFE',
        }}
      >
        {isLocked ? (
          <Lock size={24} color={isDark ? Colors.text.muted : '#94A3B8'} />
        ) : (
          <Text style={{ fontSize: isActive ? 34 : 28 }}>{module.icon}</Text>
        )}

        {isCompleted && (
          <View
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center"
            style={{ backgroundColor: isDark ? '#166534' : '#16A34A' }}
          >
            <Check size={12} color="#fff" strokeWidth={3} />
          </View>
        )}
      </View>

      {/* Title */}
      <Text
        className="text-sm font-bold mt-3 text-center"
        style={{
          color: isLocked ? textMuted : textPrimary,
          opacity: isLocked ? 0.5 : 1,
        }}
      >
        {module.title}
      </Text>

      {/* Description */}
      <Text
        className="text-xs mt-0.5 text-center"
        style={{ color: textMuted, opacity: isLocked ? 0.45 : 1 }}
      >
        {module.description}
      </Text>

      {/* Status badge */}
      <View
        className="mt-2 mb-1 rounded-full px-3 py-1"
        style={{
          backgroundColor: isCompleted
            ? isDark ? 'rgba(22,163,74,0.15)' : '#DCFCE7'
            : isActive
            ? isDark ? 'rgba(59,130,246,0.15)' : '#DBEAFE'
            : isDark ? 'rgba(255,255,255,0.05)' : '#F1F5F9',
        }}
      >
        {isCompleted && (
          <Text className="text-xs font-bold" style={{ color: isDark ? '#4ADE80' : '#16A34A' }}>
            ✓ COMPLETADO
          </Text>
        )}
        {isActive && (
          <Text className="text-xs font-bold" style={{ color: isDark ? '#60A5FA' : Colors.light.accent }}>
            ▶ EN CURSO
          </Text>
        )}
        {isLocked && (
          <Text className="text-xs font-bold" style={{ color: textMuted, opacity: 0.6 }}>
            🔒 BLOQUEADO
          </Text>
        )}
      </View>
    </View>
  );
}

export default function LearnScreen() {
  const { isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState<Category>('Finanzas');

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? Colors.text.muted : Colors.light.textMuted;

  const activeModule = MODULES.find(m => m.status === 'active');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 pt-3 pb-4">
        <Text className="text-2xl font-bold" style={{ color: textPrimary }}>
          Aprender
        </Text>
        <View
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            backgroundColor: isDark
              ? 'rgba(255,215,64,0.12)'
              : 'rgba(234,179,8,0.12)',
          }}
        >
          <Text>💎</Text>
          <Text
            className="text-sm font-bold"
            style={{ color: isDark ? Colors.gold[400] : Colors.light.gold }}
          >
            1,240
          </Text>
        </View>
      </View>

      {/* Category tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        className="mb-5 flex-grow-0"
      >
        {CATEGORIES.map((cat) => {
          const active = activeCategory === cat;
          return (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              accessible={true}
              accessibilityLabel={`Categoría ${cat}`}
              className="active:opacity-70 rounded-full px-4 py-2"
              style={{
                backgroundColor: active
                  ? isDark ? Colors.gold[400] : Colors.light.accent
                  : isDark ? Colors.navy[700] : Colors.light.surface,
              }}
            >
              <Text
                className="text-sm font-semibold"
                style={{
                  color: active
                    ? isDark ? '#000' : '#fff'
                    : textMuted,
                }}
              >
                {cat}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Route label */}
      <Text
        className="text-xs font-bold text-center mb-6 tracking-widest"
        style={{ color: textMuted }}
      >
        RUTA · FINANZAS PERSONALES
      </Text>

      {/* Modules path */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        {MODULES.map((module, index) => (
          <ModuleNode
            key={module.id}
            module={module}
            isFirst={index === 0}
            isDark={isDark}
          />
        ))}
      </ScrollView>

      {/* CTA bottom */}
      {activeModule && (
        <View
          className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3"
          style={{ backgroundColor: bg }}
        >
          <Pressable
            accessible={true}
            accessibilityLabel={`Continuar lección ${activeModule.completedLessons + 1}`}
            className="active:opacity-80 flex-row items-center justify-center rounded-2xl py-4 gap-3"
            style={{
              backgroundColor: isDark ? Colors.gold[400] : Colors.light.accent,
            }}
          >
            <Play
              size={18}
              color={isDark ? '#000' : '#fff'}
              fill={isDark ? '#000' : '#fff'}
            />
            <Text
              className="text-base font-bold"
              style={{ color: isDark ? '#000' : '#fff' }}
            >
              Continuar lección {activeModule.completedLessons + 1}
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
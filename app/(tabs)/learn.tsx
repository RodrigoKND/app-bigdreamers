import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import {
  Lock,
  Play,
  Check,
  Gem,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Building2,
  CheckCircle,
  CircleDot,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import LearnHeader from '@/components/learn/LearnHeader';

type ModuleStatus = 'completed' | 'active' | 'locked';
type Category = 'Finanzas' | 'Inversión' | 'Ahorro' | 'Empresa';

interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: number;
  completedLessons: number;
  status: ModuleStatus;
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: 'Finanzas', icon: null },
  { label: 'Inversión', icon: null },
  { label: 'Ahorro', icon: null },
  { label: 'Empresa', icon: null },
];

const MODULE_ICONS: Record<string, React.FC<{ size: number; color: string }>> = {
  '1': DollarSign,
  '2': PiggyBank,
  '3': TrendingUp,
  '4': TrendingUp,
  '5': Building2,
};

const MODULES: LearningModule[] = [
  {
    id: '1',
    title: 'Fundamentos',
    description: '5 lecciones · completado',
    lessons: 5,
    completedLessons: 5,
    status: 'completed',
  },
  {
    id: '2',
    title: 'Presupuesto',
    description: '6 lecciones · completado',
    lessons: 6,
    completedLessons: 6,
    status: 'completed',
  },
  {
    id: '3',
    title: 'Ahorro Inteligente',
    description: 'Lección 3 de 7 · en curso',
    lessons: 7,
    completedLessons: 3,
    status: 'active',
  },
  {
    id: '4',
    title: 'Inversiones Básicas',
    description: '8 lecciones · bloqueado',
    lessons: 8,
    completedLessons: 0,
    status: 'locked',
  },
  {
    id: '5',
    title: 'Bolsa de Valores',
    description: '10 lecciones · bloqueado',
    lessons: 10,
    completedLessons: 0,
    status: 'locked',
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
  const IconComponent = MODULE_ICONS[module.id] ?? DollarSign;

  const nodeBg = isLocked
    ? isDark ? Colors.navy[700] : '#CBD5E1'
    : isCompleted
    ? Colors.gold[500]
    : Colors.gold[400];

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  // Fix: usar blanco/oscuro con opacidad suficiente en lugar de gris puro
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  return (
    <View className="items-center">
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
          <Lock size={24} color={isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8'} />
        ) : (
          <IconComponent size={isActive ? 32 : 26} color={isDark ? '#000' : '#1e3a5f'} />
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

      <Text
        className="text-sm font-bold mt-3 text-center"
        style={{
          color: isLocked ? textMuted : textPrimary,
          opacity: isLocked ? 0.6 : 1,
        }}
      >
        {module.title}
      </Text>

      <Text
        className="text-xs mt-0.5 text-center"
        style={{ color: textMuted, opacity: isLocked ? 0.6 : 1 }}
      >
        {module.description}
      </Text>

      <View
        className="mt-2 mb-1 rounded-full px-4 py-1.5"
        style={{
          backgroundColor: isCompleted
            ? isDark ? 'rgba(22,163,74,0.18)' : '#DCFCE7'
            : isActive
            ? isDark ? 'rgba(59,130,246,0.18)' : '#DBEAFE'
            : isDark ? 'rgba(255,255,255,0.07)' : '#F1F5F9',
        }}
      >
        {isCompleted && (
          <View className="flex-row items-center gap-1">
            <CheckCircle size={11} color={isDark ? '#4ADE80' : '#16A34A'} />
            <Text className="text-xs font-bold" style={{ color: isDark ? '#4ADE80' : '#16A34A' }}>
              COMPLETADO
            </Text>
          </View>
        )}
        {isActive && (
          <View className="flex-row items-center gap-1">
            <CircleDot size={11} color={isDark ? '#60A5FA' : Colors.light.accent} />
            <Text className="text-xs font-bold" style={{ color: isDark ? '#60A5FA' : Colors.light.accent }}>
              EN CURSO
            </Text>
          </View>
        )}
        {isLocked && (
          <View className="flex-row items-center gap-1">
            <Lock size={11} color={textMuted} />
            <Text className="text-xs font-bold" style={{ color: textMuted }}>
              BLOQUEADO
            </Text>
          </View>
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
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  // Fix margen superior en Android
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight ?? 0 : 0;

  const activeModule = MODULES.find(m => m.status === 'active');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }}>
      <View style={{ flex: 1, paddingTop: statusBarHeight }}>

        {/* Header */}
        <LearnHeader gems={1240} />

        {/* Category tabs — padding vertical aumentado para que no se corten */}
        <View style={{ height: 44, marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            gap: 8,
            alignItems: 'center',
          }}
          style={{ flex: 1 }}
        >
          {CATEGORIES.map(({ label }) => {
            const active = activeCategory === label;
            return (
              <Pressable
                key={label}
                onPress={() => setActiveCategory(label)}
                accessible
                accessibilityLabel={`Categoría ${label}`}
                className="active:opacity-70 rounded-full"
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
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
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

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
            paddingTop: 16,
            paddingBottom: 120,
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
              accessible
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
      </View>
    </SafeAreaView>
  );
}
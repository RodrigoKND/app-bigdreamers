import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  Lock,
  Play,
  Check,
  DollarSign,
  TrendingUp,
  PiggyBank,
  Building2,
  CheckCircle,
  CircleDot,
} from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import LearnHeader from '@/components/learn/LearnHeader';
import { useLearningModules } from '@/hooks/learning/useLearningModules';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import { useUserModulesProgress } from '@/hooks/learning/useUserModulesProgress';
import { useAuth } from '@/contexts/AuthContext';
import type { LearningModule } from '@/types';

type ModuleStatus = 'completed' | 'active' | 'locked';
type Category = 'Finanzas' | 'Inversión' | 'Ahorro' | 'Empresa';

const CATEGORY_MAP: Record<Category, string> = {
  'Finanzas': 'finanzas',
  'Inversión': 'inversion',
  'Ahorro': 'ahorro',
  'Empresa': 'empresa',
};

const CATEGORIES: Category[] = ['Finanzas', 'Inversión', 'Ahorro', 'Empresa'];

const MODULE_ICONS: Record<number, React.FC<{ size: number; color: string }>> = {
  0: DollarSign,
  1: PiggyBank,
  2: TrendingUp,
  3: TrendingUp,
  4: Building2,
};

type EnrichedModule = LearningModule & {
  status: ModuleStatus;
  completedLessons: number;
  totalLessons: number;
};

function ModuleNode({
  module,
  index,
  isFirst,
  isDark,
  onPress,
}: {
  module: EnrichedModule;
  index: number;
  isFirst: boolean;
  isDark: boolean;
  onPress: () => void;
}) {
  const isCompleted = module.status === 'completed';
  const isActive = module.status === 'active';
  const isLocked = module.status === 'locked';

  const nodeSize = isActive ? 80 : 68;
  const IconComponent = MODULE_ICONS[index % 5] ?? DollarSign;

  const nodeBg = isLocked
    ? isDark ? Colors.navy[700] : '#CBD5E1'
    : isCompleted
    ? Colors.gold[500]
    : Colors.gold[400];

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const statusLabel = isCompleted
    ? 'completado'
    : isActive
    ? `Lección ${module.completedLessons + 1} de ${module.totalLessons} · en curso`
    : `${module.totalLessons} lecciones · bloqueado`;

  return (
    <TouchableOpacity
      onPress={isLocked ? undefined : onPress}
      activeOpacity={isLocked ? 1 : 0.7}
      className="items-center"
    >
      {!isFirst && (
        <View
          className="w-[3px] h-7"
          style={{
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
        style={{ color: isLocked ? textMuted : textPrimary, opacity: isLocked ? 0.6 : 1 }}
      >
        {module.title}
      </Text>

      <Text
        className="text-xs mt-0.5 text-center"
        style={{ color: textMuted, opacity: isLocked ? 0.6 : 1 }}
      >
        {statusLabel}
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
    </TouchableOpacity>
  );
}

export default function LearnScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<Category>('Finanzas');
  const [refreshKey, setRefreshKey] = useState(0);

  const { modules, loading: modulesLoading, error: modulesError, refetch } = useLearningModules({
    category: CATEGORY_MAP[activeCategory],
  });

  const { progress, loading: progressLoading } = useUserModulesProgress(user?.id ?? null);

  useFocusEffect(
    useCallback(() => {
      invalidateCachePattern(CacheKeys.learningModules);
      if (user?.id) invalidateCachePattern(CacheKeys.userModulesProgress(user.id));
      refetch();
      setRefreshKey(k => k + 1);
    }, [user?.id])
  );

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  const loading = modulesLoading || progressLoading;

  // Cruzar módulos con progreso del usuario
  const enrichedModules = useMemo((): EnrichedModule[] => {
    const progressMap = new Map(progress.map((p) => [p.moduleId, p]));
    let foundActive = false;

    return modules.map((mod) => {
      const userProgress = progressMap.get(mod.id);
      const totalLessons = mod.totalLessons ?? 0;

      if (userProgress?.completed) {
        return {
          ...mod,
          status: 'completed',
          completedLessons: totalLessons,
          totalLessons,
        };
      }

      if (!foundActive) {
        foundActive = true;
        const completedLessons = userProgress
          ? Math.floor((userProgress.progress / 100) * totalLessons)
          : 0;
        return {
          ...mod,
          status: 'active',
          completedLessons,
          totalLessons,
        };
      }

      return {
        ...mod,
        status: 'locked',
        completedLessons: 0,
        totalLessons,
      };
    });
  }, [modules, progress, refreshKey]);

  const activeModule = enrichedModules.find((m) => m.status === 'active');

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }}>
      <View className="flex-1">

        <LearnHeader gems={user?.gems ?? 0} />

        {/* Category tabs */}
        <View className="h-11 mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'center' }}
            style={{ flex: 1 }}
          >
            {CATEGORIES.map((label) => {
              const active = activeCategory === label;
              return (
                <Pressable
                  key={label}
                  onPress={() => setActiveCategory(label)}
                  accessible
                  accessibilityLabel={`Categoría ${label}`}
                  className="active:opacity-70 rounded-full px-[18px] py-2"
                  style={{
                    backgroundColor: active
                      ? isDark ? Colors.gold[400] : Colors.light.accent
                      : isDark ? Colors.navy[700] : Colors.light.surface,
                  }}
                >
                  <Text
                    className="text-sm font-semibold"
                    style={{ color: active ? isDark ? '#000' : '#fff' : textMuted }}
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
          RUTA · {activeCategory.toUpperCase()}
        </Text>

        {/* Loading */}
        {loading && (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={accentColor} />
          </View>
        )}

        {/* Error */}
        {!loading && modulesError && (
          <View className="flex-1 items-center justify-center px-8">
            <Text className="text-sm text-center" style={{ color: textMuted }}>
              No se pudieron cargar los módulos.
            </Text>
          </View>
        )}

        {/* Empty state */}
        {!loading && !modulesError && modules.length === 0 && (
          <View className="flex-1 items-center justify-center px-8 gap-3">
            <Text className="text-base font-bold text-center" style={{ color: textMuted }}>
              No hay módulos en esta categoría aún
            </Text>
          </View>
        )}

        {/* Modules path */}
        {!loading && !modulesError && modules.length > 0 && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 120,
              alignItems: 'center',
              paddingHorizontal: 20,
            }}
          >
            {enrichedModules.map((module, index) => (
              <ModuleNode
                key={module.id}
                module={module}
                index={index}
                isFirst={index === 0}
                isDark={isDark}
                onPress={() => router.push(`/module/${module.id}` as any)}
              />
            ))}
          </ScrollView>
        )}

        {/* CTA bottom */}
        {!loading && activeModule && (
          <View
            className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-3"
            style={{ backgroundColor: bg }}
          >
            <Pressable
              accessible
              accessibilityLabel={`Continuar lección ${activeModule.completedLessons + 1}`}
              onPress={() => router.push(`/module/${activeModule.id}` as any)}
              className="active:opacity-80 flex-row items-center justify-center rounded-2xl py-4 gap-3"
              style={{ backgroundColor: accentColor }}
            >
              <Play size={18} color={isDark ? '#000' : '#fff'} fill={isDark ? '#000' : '#fff'} />
              <Text className="text-base font-bold" style={{ color: isDark ? '#000' : '#fff' }}>
                Continuar lección {activeModule.completedLessons + 1}
              </Text>
            </Pressable>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
}
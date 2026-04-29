import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus, Gem, BookOpen, Flame } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface StatItem {
  label: string;
  value: string | number;
  accent?: string;
}

interface ProfileStatCardProps {
  stats: StatItem[];
  className?: string;
  isDark: boolean;
  onRechargeGems?: () => void;
}

const STAT_ICONS: Record<string, React.FC<{ size: number; color: string }>> = {
  GEMAS: Gem,
  MÓDULOS: BookOpen,
  RACHA: Flame,
};

export default function ProfileStatCard({ stats, className = '', isDark, onRechargeGems }: ProfileStatCardProps) {
  const cardBg      = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)';
  const divider     = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const gemsStat  = stats[0];
  const restStats = stats.slice(1);
  const GemsIcon  = STAT_ICONS['GEMAS'];

  return (
    <View
      className={`mx-4 mb-3 rounded-2xl overflow-hidden ${className}`.trim()}
      style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}
    >
      {/* Bloque de gemas */}
      <View
        className="items-center pt-5 pb-4 px-5"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: divider,
          backgroundColor: isDark ? 'rgba(0,0,0,0.20)' : 'rgba(234,179,8,0.05)',
        }}
      >
        <GemsIcon size={22} color={Colors.gold[500]} />
        <Text
          className="font-bold text-[25px] leading-tight mt-1"
          style={{ color: Colors.gold[500] }}
        >
          {gemsStat.value}
        </Text>
        <Text
          className="text-[10px] font-semibold tracking-widest mt-1 mb-4"
          style={{ color: textMuted }}
        >
          GEMAS
        </Text>
        <Pressable
          onPress={onRechargeGems}
          className="flex-row items-center gap-1.5 px-6 py-2.5 rounded-xl active:opacity-70"
          style={{ backgroundColor: Colors.gold[500] }}
          accessible
          accessibilityLabel="Recargar gemas"
          accessibilityRole="button"
        >
          <Plus size={14} color={Colors.navy[900]} strokeWidth={2.5} />
          <Text className="font-bold text-[13px]" style={{ color: Colors.navy[900] }}>
            Recargar gemas
          </Text>
        </Pressable>
      </View>

      {/* Módulos y Racha */}
      <View className="flex-row">
        {restStats.map((stat, index) => {
          const IconComponent = STAT_ICONS[stat.label] ?? BookOpen;
          return (
            <View
              key={stat.label}
              className="flex-1 items-center py-4"
              style={index < restStats.length - 1 ? {
                borderRightWidth: 1,
                borderRightColor: divider,
              } : undefined}
              accessible
              accessibilityLabel={`${stat.label}: ${stat.value}`}
            >
              <Text
                className="font-bold text-[22px]"
                style={{ color: stat.accent ?? (isDark ? Colors.text.primary : Colors.light.textPrimary) }}
              >
                {stat.value}
              </Text>
              <View style={{ marginTop: 2 }}>
                  <IconComponent size={14} color={stat.accent ?? textMuted} />
                </View>
              <Text
                className="text-[10px] font-semibold tracking-widest mt-1"
                style={{ color: textMuted }}
              >
                {stat.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface StatItem {
  label: string;
  value: string | number;
  accent?: string;
  icon?: string;
}

interface ProfileStatCardProps {
  stats: StatItem[];
  className?: string;
  isDark: boolean;
  onRechargeGems?: () => void;
}

export default function ProfileStatCard({ stats, className = '', isDark, onRechargeGems }: ProfileStatCardProps) {
  const cardBg      = isDark ? 'rgba(0,0,0,0.20)' : Colors.light.card;
  const borderColor = isDark ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.06)';
  const divider     = isDark ? 'rgba(0,0,0,0.20)' : 'rgba(0,0,0,0.07)';
  const gemsStat  = stats[0];
  const restStats = stats.slice(1);

  return (
    <View
      className={`mx-4 mb-3 rounded-2xl overflow-hidden ${className}`.trim()}
      style={{
        backgroundColor: cardBg,
        borderWidth: 1,
        borderColor,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0 : 0.07,
        shadowRadius: 8,
        elevation: isDark ? 0 : 3,
      }}
    >
      {/* Bloque de gemas centrado */}
      <View
        className="items-center pt-5 pb-4 px-5"
        style={{
          borderBottomWidth: 1,
          borderBottomColor: divider,
          backgroundColor: isDark ? '#105099' : 'rgba(234,179,8,0.05)',
        }}
      >
        <Text style={{ fontSize: 19, marginBottom: 4 }}>💎</Text>

        <Text
          className="font-bold text-[25px] leading-tight"
          style={{ color: Colors.gold[500] }}
        >
          {gemsStat.value}
        </Text>

        <Text
          className="text-[10px] font-semibold tracking-widest mt-1 mb-4"
          style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}
        >
          GEMAS
        </Text>

        {/* Botón recargar debajo */}
        <Pressable
          onPress={onRechargeGems}
          className="flex-row items-center gap-1.5 px-6 py-2.5 rounded-xl active:opacity-70"
          style={{ backgroundColor: Colors.gold[500] }}
          accessible={true}
          accessibilityLabel="Recargar gemas"
          accessibilityRole="button"
        >
          <Plus size={14} color={Colors.navy[900]} strokeWidth={2.5} />
          <Text
            className="font-bold text-[13px]"
            style={{ color: Colors.navy[900] }}
          >
            Recargar gemas
          </Text>
        </Pressable>
      </View>

      {/* Fila inferior — Módulos y Racha */}
      <View className="flex-row">
        {restStats.map((stat, index) => (
          <View
            key={stat.label}
            className="flex-1 items-center py-4"
            style={index < restStats.length - 1 ? {
              borderRightWidth: 1,
              borderRightColor: divider,
            } : undefined}
            accessible={true}
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <Text
              className="font-bold text-[22px]"
              style={{ color: stat.accent ?? (isDark ? Colors.text.primary : Colors.light.textPrimary) }}
            >
              {stat.value}
            </Text>
            {stat.icon && (
              <Text style={{ fontSize: 12, marginTop: 2 }}>{stat.icon}</Text>
            )}
            <Text
              className="text-[10px] font-semibold tracking-widest mt-1"
              style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}
            >
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
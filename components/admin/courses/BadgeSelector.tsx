import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import * as LucideIcons from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { ADMIN_BADGES } from '@/constants/adminBadges';

interface BadgeSelectorProps {
  selectedBadgeId: string | null;
  onSelect: (badgeId: string) => void;
  isDark: boolean;
}

const BadgeSelector = ({ selectedBadgeId, onSelect, isDark }: BadgeSelectorProps) => {
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  return (
    <View>
      <Text style={{ fontWeight: '700', color: isDark ? Colors.text.primary : Colors.light.textPrimary, marginBottom: 12 }}>
        Seleccionar insignia
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {ADMIN_BADGES.map((badge) => {
            const isSelected = selectedBadgeId === badge.id;
            const IconComponent = (LucideIcons as any)[badge.icon] ?? LucideIcons.Star;

            return (
              <Pressable
                key={badge.id}
                onPress={() => onSelect(badge.id)}
                style={{
                  width: 80,
                  padding: 10,
                  borderRadius: 12,
                  borderWidth: isSelected ? 2 : 1,
                  borderColor: isSelected ? Colors.gold[400] : isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                  backgroundColor: isSelected
                    ? 'rgba(255,215,64,0.1)'
                    : isDark
                    ? 'rgba(0,0,0,0.25)'
                    : Colors.light.surface,
                  alignItems: 'center',
                }}
              >
                <IconComponent size={22} color={badge.color} />
                <Text
                  style={{
                    marginTop: 8,
                    fontSize: 9,
                    fontWeight: '600',
                    color: textMuted,
                    textAlign: 'center',
                  }}
                  numberOfLines={2}
                >
                  {badge.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default BadgeSelector;
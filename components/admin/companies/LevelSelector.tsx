import { View, Text, Pressable } from 'react-native';
import { Medal } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { CompanyLevel } from '@/constants/mockCompanies';

interface LevelSelectorProps {
  selected: CompanyLevel;
  onSelect: (level: CompanyLevel) => void;
  isDark: boolean;
}

const LevelSelector = ({ selected, onSelect, isDark }: LevelSelectorProps) => {
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const levels: { key: CompanyLevel; label: string; color: string }[] = [
    { key: 'gold', label: 'Oro', color: '#FFD700' },
    { key: 'silver', label: 'Plata', color: '#C0C0C0' },
    { key: 'bronze', label: 'Bronce', color: '#CD7F32' },
  ];

  return (
    <View>
      <Text style={{ fontWeight: '700', color: isDark ? Colors.text.primary : Colors.light.textPrimary, marginBottom: 12 }}>
        Nivel de empresa
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {levels.map((level) => {
          const isSelected = selected === level.key;

          return (
            <Pressable
              key={level.key}
              onPress={() => onSelect(level.key)}
              style={{
                flex: 1,
                marginHorizontal: 4,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 12,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? level.color : isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                backgroundColor: isSelected
                  ? `rgba(${level.color === '#FFD700' ? '255,215,0' : level.color === '#C0C0C0' ? '192,192,192' : '205,127,50'},0.1)`
                  : isDark
                  ? 'rgba(0,0,0,0.25)'
                  : Colors.light.surface,
                alignItems: 'center',
              }}
            >
              <Medal size={20} color={level.color} />
              <Text
                style={{
                  marginTop: 8,
                  fontSize: 14,
                  fontWeight: '600',
                  color: isSelected ? level.color : textMuted,
                }}
              >
                {level.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

export default LevelSelector;
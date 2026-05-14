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
      <Text className="font-bold mb-3" style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}>
        Nivel de empresa
      </Text>
      <View className="flex-row justify-between">
        {levels.map((level) => {
          const isSelected = selected === level.key;

          return (
            <Pressable
              key={level.key}
              onPress={() => onSelect(level.key)}
              className="flex-1 mx-1 py-3 px-4 rounded-xl items-center"
              style={{
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected ? level.color : isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
                backgroundColor: isSelected
                  ? `rgba(${level.color === '#FFD700' ? '255,215,0' : level.color === '#C0C0C0' ? '192,192,192' : '205,127,50'},0.1)`
                  : isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
              }}
            >
              <Medal size={20} color={level.color} />
              <Text
                className="mt-2 text-sm font-semibold"
                style={{ color: isSelected ? level.color : textMuted }}
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
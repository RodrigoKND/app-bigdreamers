import { View, Text, Pressable } from 'react-native';
import { Gem, CheckCircle } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { GemPackage } from '@/constants/gemPackages';

interface GemPackageCardProps {
  package: GemPackage;
  selected: boolean;
  onSelect: () => void;
  isDark: boolean;
}

const GemPackageCard = ({ package: gemPackage, selected, onSelect, isDark }: GemPackageCardProps) => {
  const borderColor = selected ? Colors.gold[400] : isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0';
  const backgroundColor = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  return (
    <Pressable
      onPress={onSelect}
      style={{
        width: '48%',
        borderRadius: 16,
        borderWidth: 2,
        borderColor,
        backgroundColor,
        padding: 16,
        marginBottom: 12,
      }}
    >
      {gemPackage.popular && (
        <View
          style={{
            position: 'absolute',
            right: 12,
            top: 12,
            backgroundColor: Colors.gold[400],
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 999,
            zIndex: 1,
          }}
        >
          <Text style={{ fontSize: 9, fontWeight: '800', color: '#000' }}>MÁS POPULAR</Text>
        </View>
      )}
      <Gem size={24} color={Colors.gold[400]} />
      <View style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 22, fontWeight: '900', color: textPrimary }}>{gemPackage.gems}</Text>
        <Text style={{ fontSize: 11, color: textMuted, marginTop: 2 }}>gemas</Text>
      </View>
      <View
        style={{
          height: 1,
          backgroundColor: 'rgba(255,255,255,0.08)',
          marginVertical: 16,
        }}
      />
      <Text style={{ fontSize: 18, fontWeight: '700', color: Colors.gold[400] }}>{gemPackage.bsPrice} Bs</Text>
      <Text style={{ fontSize: 10, color: textMuted, marginTop: 2 }}>bolivianos</Text>
      {selected && (
        <View style={{ position: 'absolute', right: 16, bottom: 16 }}>
          <CheckCircle size={18} color={Colors.gold[400]} />
        </View>
      )}
    </Pressable>
  );
};

export default GemPackageCard;

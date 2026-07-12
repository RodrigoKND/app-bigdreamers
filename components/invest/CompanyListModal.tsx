import React from 'react';
import { View, Text, Modal, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Gem, Medal } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { Company } from '@/constants/mockCompanies';

interface Props {
  visible: boolean;
  level: 'gold' | 'silver' | 'bronze' | null;
  companies: Company[];
  onClose: () => void;
  investedCompanyIds?: Set<string>;
}

const LEVEL_CONFIG: Record<string, { label: string; color: string; gradient: string[] }> = {
  gold:   { label: 'Oro',   color: Colors.levels.gold,   gradient: ['rgba(245,194,0,0.15)', 'rgba(245,194,0,0.03)'] },
  silver: { label: 'Plata', color: Colors.levels.silver, gradient: ['rgba(168,169,173,0.15)', 'rgba(168,169,173,0.03)'] },
  bronze: { label: 'Bronce',color: Colors.levels.bronze, gradient: ['rgba(205,127,50,0.15)', 'rgba(205,127,50,0.03)'] },
};

const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/2611/2611152.png';

function isValidImageUrl(url: string): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return FALLBACK_IMAGE;
}

export default function CompanyListModal({ visible, level, companies, onClose, investedCompanyIds }: Props) {
  const { isDark } = useTheme();
  const router = useRouter();
  const config = level ? LEVEL_CONFIG[level] : null;

  const bg = isDark ? Colors.blue.primary : Colors.light.bg;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.55)' : Colors.light.textMuted;
  const cardBg = isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card;
  const border = isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border;

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: bg }}>
        <View className="flex-row items-center justify-between px-5 pt-4 pb-3" style={{ borderBottomWidth: 1, borderBottomColor: border }}>
          <View className="flex-row items-center gap-2">
            {config && (
              <View className="w-8 h-8 rounded-lg items-center justify-center" style={{ backgroundColor: `${config.color}22` }}>
                <Medal size={16} color={config.color} />
              </View>
            )}
            <View>
              <Text className="text-lg font-bold" style={{ color: textPrimary }}>
                Nivel {config?.label ?? ''}
              </Text>
              <Text className="text-xs" style={{ color: textMuted }}>
                {companies.length} empresa{companies.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={onClose}
            className="w-8 h-8 rounded-full items-center justify-center active:opacity-60"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface }}
          >
            <X size={16} color={textMuted} />
          </Pressable>
        </View>

        {companies.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <Medal size={48} color={textMuted} />
            <Text className="text-base font-semibold text-center mt-4" style={{ color: textMuted }}>
              No hay empresas en este nivel
            </Text>
          </View>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 16, gap: 12 }}
          >
            {companies.map((company) => (
              <Pressable
                key={company.id}
                onPress={() => { onClose(); router.push(`/company/${company.id}` as any); }}
                className="rounded-2xl overflow-hidden active:opacity-80"
                style={{ backgroundColor: cardBg, borderWidth: 1, borderColor: border }}
              >
                <View className="flex-row">
                  <View className="w-24 h-24">
                    <Image
                      source={{ uri: isValidImageUrl(company.imageUrl) }}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1 p-3 justify-center">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-bold text-base" style={{ color: textPrimary }} numberOfLines={1}>
                        {company.name}
                      </Text>
                      {investedCompanyIds?.has(company.id) && (
                        <View className="bg-emerald-500/90 px-2 py-0.5 rounded-full">
                          <Text className="text-white text-[10px] font-bold">Ya invertiste</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs mt-1" style={{ color: textMuted }} numberOfLines={2}>
                      {company.description}
                    </Text>
                    <View className="flex-row items-center gap-1 mt-2">
                      <Gem size={12} color={Colors.gold[400]} />
                      <Text className="text-xs font-bold" style={{ color: isDark ? Colors.gold[400] : Colors.light.gold }}>
                        {company.gems.toLocaleString()} gemas
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
    </Modal>
  );
}

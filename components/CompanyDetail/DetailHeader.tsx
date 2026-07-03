import React, { useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Gem, BadgeCheck, Building2 } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';

const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/2611/2611152.png';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

function isValidImageUrl(url: string): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return FALLBACK_IMAGE;
}

const DetailHeader = React.memo(function DetailHeader({
  name, description, gems, imageUrl,
}: {
  name: string; description: string; gems: number; imageUrl: string;
}) {
  const { isDark } = useTheme();
  const [imgError, setImgError] = useState(false);

  return (
    <View className="mb-6">
      {/* Hero Image */}
      <View
        className="overflow-hidden rounded-[32px]"
        style={{
          height: 240,
          backgroundColor: isDark ? '#0A1E3D' : '#E2E8F0',
        }}
      >
        <Image
          source={{ uri: imgError ? FALLBACK_IMAGE : isValidImageUrl(imageUrl) }}
          className="absolute w-full h-full"
          style={{ width: SCREEN_WIDTH - 40, height: 240 }}
          resizeMode="cover"
          onError={() => setImgError(true)}
        />

        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.75)']}
          className="absolute left-0 right-0 bottom-0"
          style={{ height: '60%' }}
        />

        {/* Top accent line */}
        <LinearGradient
          colors={['#FFD740', '#FFB300', '#FFD740']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="absolute top-0 left-0 right-0"
          style={{ height: 3 }}
        />

        {/* Level badge */}
        <View
          className="absolute top-4 right-4 flex-row items-center gap-1.5 rounded-full px-3 py-1.5"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderWidth: 1,
            borderColor: 'rgba(255,215,64,0.4)',
          }}
        >
          <BadgeCheck size={13} color="#FFD740" />
          <Text className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#FFD740' }}>
            Verificada
          </Text>
        </View>

        {/* Bottom overlay info */}
        <View className="absolute bottom-0 left-0 right-0 p-5">
          <Text
            className="text-3xl font-black text-white leading-tight"
            numberOfLines={2}
          >
            {name}
          </Text>

          <View className="flex-row items-center gap-3 mt-2">
            <View className="flex-row items-center gap-1.5">
              <Gem size={14} color="#FFD740" />
              <Text className="text-sm font-bold" style={{ color: '#FFD740' }}>
                {gems.toLocaleString()} gemas
              </Text>
            </View>
            <View
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
            />
            <View className="flex-row items-center gap-1">
              <Building2 size={13} color="rgba(255,255,255,0.6)" />
              <Text className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>
                Empresa
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description card */}
      <View
        className="mt-4 rounded-2xl p-5"
        style={{
          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F8FAFC',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0',
        }}
      >
        <View className="flex-row items-center gap-2 mb-3">
          <View
            className="w-1.5 h-5 rounded-full"
            style={{ backgroundColor: '#FFD740' }}
          />
          <Text
            className="text-xs font-extrabold uppercase tracking-widest"
            style={{ color: isDark ? 'rgba(255,255,255,0.5)' : '#94A3B8' }}
          >
            Acerca de
          </Text>
        </View>
        <Text
          className="text-[15px] leading-6"
          style={{
            color: isDark ? 'rgba(255,255,255,0.85)' : '#334155',
          }}
        >
          {description}
        </Text>
      </View>
    </View>
  );
});

export default DetailHeader;

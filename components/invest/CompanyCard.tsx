import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/shared/Button';
import { Link } from 'expo-router';
import { useRouter } from 'expo-router';

interface CompanyCardProps {
  id: string;
  name: string;
  gems: number;
  imageUrl: string;
  isInvested?: boolean;
}

const FALLBACK_IMAGE = 'https://cdn-icons-png.flaticon.com/512/2611/2611152.png';

function isValidImageUrl(url: string): string {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return FALLBACK_IMAGE;
}

const CompanyCard = React.memo(function CompanyCard({ id, name, gems, imageUrl, isInvested }: CompanyCardProps) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);

  return (
    <Link href={`/company/${id}` as any}>
      <View className="w-64 h-80 rounded-3xl mr-4 overflow-hidden bg-gray-200">
        <Image
          source={{ uri: imgError ? FALLBACK_IMAGE : isValidImageUrl(imageUrl) }}
          className="absolute w-full h-full"
          resizeMode="cover"
          onError={() => setImgError(true)}
        />

        <LinearGradient
          // Colores: Transparente arriba, negro semi-transparente abajo
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          className="absolute left-0 right-0 bottom-0 h-1/2"
        />

        {isInvested && (
          <View className="absolute top-3 left-3 bg-emerald-500/90 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-bold">Ya invertiste</Text>
          </View>
        )}

        <View className="flex-1 justify-end p-5">
          <Text className="text-2xl font-bold text-white">{name}</Text>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <Text className="text-xl font-semibold text-white">{gems} Gemas</Text>
            </View>

            <Button
              title="+"
              size="sm"
              className="bg-white/40 border-white p-2 rounded-full shadow-sm"
              onPress={() => router.push('/gems')}
            />
          </View>
        </View>

      </View>
    </Link>
  );
});

export default CompanyCard;
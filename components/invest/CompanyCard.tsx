import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/shared/Button';
import { Link } from 'expo-router';

interface CompanyCardProps {
  name: string;
  gems: number;
  imageUrl: string;
}

export default function CompanyCard({ name, gems, imageUrl }: CompanyCardProps) {

  return (
    <Link href={`/company/${name}` as any}>
      <View className="w-64 h-80 rounded-3xl mr-4 overflow-hidden bg-gray-200">
        <Image
          source={{ uri: imageUrl }}
          className="absolute w-full h-full"
          resizeMode="cover"
        />

        <LinearGradient
          // Colores: Transparente arriba, negro semi-transparente abajo
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          className="absolute left-0 right-0 bottom-0 h-1/2"
        />

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
            />
          </View>
        </View>

      </View>
    </Link>
  );
};
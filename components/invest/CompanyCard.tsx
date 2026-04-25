import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '@/components/shared/Button';

interface CompanyCardProps {
  name: string;
  gems: number;
  imageUrl: string;
}

export default function CompanyCard({ name, gems, imageUrl }: CompanyCardProps) {
  return (
    <View className="w-64 h-80 rounded-3xl mr-4 overflow-hidden bg-gray-200">
      {/* 1. Imagen de fondo que ocupa toda la tarjeta */}
      <Image 
        source={{ uri: imageUrl }} 
        className="absolute w-full h-full"
        resizeMode="cover" 
      />

      {/* 2. Degradado para legibilidad (de transparente a negro/oscuro) */}
      <LinearGradient
        // Colores: Transparente arriba, negro semi-transparente abajo
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        className="absolute left-0 right-0 bottom-0 h-1/2"
      />

      {/* 3. Contenedor de contenido (encima de la imagen y el degradado) */}
      <View className="flex-1 justify-end p-5">
        <Text className="text-2xl font-bold text-white">{name}</Text>
        
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            {/* Opcional: icono de gema */}
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
  );
};
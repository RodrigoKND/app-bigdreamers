import React from 'react';
import { View, Text, Image } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function OfferItem({ name, gems, imageUrl }: { name: string; gems: number; imageUrl: string }) {
  const { isDark } = useTheme();

  return (
    <View className="rounded-2xl mr-3 overflow-hidden w-28 h-32" style={{ backgroundColor: isDark ? '#374151' : Colors.light.surface }}>
      <Image 
        source={{ uri: imageUrl }} 
        className="absolute w-full h-full" 
        resizeMode="cover" 
      />

      <View className="flex-1 justify-end">
        <View className="bg-black/40 p-2"> 
          <Text 
            className="text-[10px] text-white text-center font-bold" 
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text className="text-[8px] text-gray-200 text-center">
            {gems} G
          </Text>
        </View>
      </View>
    </View>
  );
};
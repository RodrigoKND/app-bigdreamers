import { View, Text, Image } from 'react-native';

export default function OfferItem({ name, gems, imageUrl }: { name: string; gems: number; imageUrl: string }) {
  return (
    <View className="bg-gray-200 rounded-2xl mr-3 overflow-hidden w-28 h-32">
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
import { View, Text, Image } from 'react-native';

export default function DetailHeader({ name, description, gems, imageUrl }: { name: string; description: string; gems: number; imageUrl: string }) {
    return (
        <View className="bg-blue-user rounded-[40px] p-6 flex-row items-center justify-between mb-6 shadow-xl">
            <View className="flex-1 pr-4">
                <Text className="text-2xl font-bold text-indigo-900">{name}</Text>
                <Text className="text-indigo-800 text-sm mb-4" numberOfLines={2}>{description}</Text>
                <Text className="text-3xl font-black text-indigo-900 font-mono">${gems.toLocaleString()}</Text>
            </View>
            <View className="bg-white rounded-3xl p-2 w-32 h-32 items-center justify-center">
                <Image source={{ uri: imageUrl }} className="w-24 h-24" resizeMode="contain" />
            </View>
        </View>
    );
}
import { View, Text } from 'react-native';

export default function CourseCard({ title, lesson }: { title: string; lesson: string }) {
    return (
        <View className="mx-4 p-4 rounded-2xl flex-row items-center justify-between dark:bg-blue-card bg-gray-200 shadow-sm">
            <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 rounded-xl bg-gray-200 items-center justify-center mr-3">
                    <Text>💰</Text>
                </View>
                <View className="flex-1">
                    <Text className="font-bold text-base dark:text-white text-black">{title}</Text>
                    <Text className="text-xs opacity-70 dark:text-white text-black">{lesson}</Text>
                    <View className="h-1 w-24 bg-gray-300 rounded-full mt-2">
                        <View className="h-full w-1/2 bg-gold-500 rounded-full" />
                    </View>
                </View>
            </View>
            <View className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center">
                <Text>▶️</Text>
            </View>
        </View>
    );
}
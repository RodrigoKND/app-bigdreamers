import { View, Text } from 'react-native';
import { Activity } from '@/types';

export default function ActivityItem({ activity }: { activity: Activity }) {
    return (
        <View className="flex-row items-center px-4 py-2 rounded-2xl dark:bg-blue-card bg-gray-200 shadow-sm">
            <View className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center">
                <Text>▶️</Text>
            </View>
            <View className="flex-1 px-3 py-1">
                <Text className="text-base font-bold dark:text-white text-black">{activity.type}</Text>
                <Text className="text-xs opacity-70 dark:text-white text-black">{activity.description}</Text>
            </View>
        </View>
    );
}
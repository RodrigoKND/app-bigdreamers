import { View, Text } from 'react-native';
import Avatar from '@/components/shared/Avatar';

export default function TeamMember({ name, role }: { name: string; role: string}) {
    return (
        <View className="flex-row items-center bg-blue-card p-4 rounded-3xl mb-3">
            <Avatar name={name} size={40} />
            <View className="ml-4">
                <Text className="font-bold text-gray-800 dark:text-white">{name}</Text>
                <Text className="text-xs text-gray-400 dark:text-gray-300">{role}</Text>
            </View>
        </View>
    );
}
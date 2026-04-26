import { View, Text } from 'react-native';
import Avatar from '@/components/shared/Avatar';

export default function TeamMember({ name, role }: { name: string; role: string}) {
    return (
        <View className="flex-row items-center bg-white/5 border border-white/10 p-5 rounded-[28px] mb-4">
            <View className="shadow-lg shadow-purple-500/50">
                <Avatar name={name} size={56} />
            </View>
            
            <View className="ml-5 flex-1">
                <Text className="text-lg font-bold text-white tracking-tight">{name}</Text>
                <Text className="text-sm text-blue-200/60 font-medium uppercase tracking-wider">{role}</Text>
            </View>

            <View className="bg-white/10 p-2 rounded-xl">
                <Text className="text-white">✉️</Text>
            </View>
        </View>
    );
}
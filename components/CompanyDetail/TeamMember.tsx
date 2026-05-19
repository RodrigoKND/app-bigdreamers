import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import Avatar from '@/components/shared/Avatar';

export default function TeamMember({ name, role }: { name: string; role: string}) {
    const { isDark } = useTheme();

    return (
        <View className="flex-row items-center p-5 rounded-[28px] mb-4 border" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card, borderColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border }}>
            <View>
                <Avatar name={name} size={56} />
            </View>
            
            <View className="ml-5 flex-1">
                <Text className="text-lg font-bold tracking-tight" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>{name}</Text>
                <Text className="text-sm font-medium uppercase tracking-wider" style={{ color: isDark ? 'rgba(156,195,255,0.6)' : Colors.light.textSecond }}>{role}</Text>
            </View>

            <View className="p-2 rounded-xl" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.surface }}>
                <Text>✉️</Text>
            </View>
        </View>
    );
}
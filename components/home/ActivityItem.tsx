import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { Activity } from '@/types';

const ActivityItem = React.memo(function ActivityItem({ activity }: { activity: Activity }) {
    const { isDark } = useTheme();

    return (
        <View className="flex-row items-center px-4 py-2 rounded-2xl shadow-sm" style={{ backgroundColor: isDark ? Colors.blue.card : Colors.light.card }}>
            <View className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center">
                <Text>▶️</Text>
            </View>
            <View className="flex-1 px-3 py-1">
                <Text className="text-base font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>{activity.type}</Text>
                <Text className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecond }}>{activity.description}</Text>
            </View>
        </View>
    );
});

export default ActivityItem;
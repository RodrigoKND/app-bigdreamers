import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

const CourseCard = React.memo(function CourseCard({ title, lesson, progress = 0 }: { 
  title: string; 
  lesson: string;
  progress: number;
}) {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <TouchableOpacity onPress={() => router.push('/(tabs)/learn')} className="mx-4 p-4 rounded-2xl flex-row items-center justify-between shadow-sm" style={{ backgroundColor: isDark ? Colors.blue.card : Colors.light.card }}>
      <View className="flex-row items-center flex-1">
        <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: isDark ? '#1E3A5F' : Colors.light.surface }}>
          <Text>💰</Text>
        </View>
        <View className="flex-1">
          <Text className="font-bold text-base" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>{title}</Text>
          <Text className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textSecond }}>{lesson}</Text>
          <View className="h-1 w-24 rounded-full mt-2" style={{ backgroundColor: isDark ? '#1E3A5F' : Colors.light.border }}>
            <View style={{ width: `${progress}%` }} className="h-full bg-gold-500 rounded-full" />
          </View>
        </View>
      </View>
      <View className="w-10 h-10 bg-yellow-400 rounded-full items-center justify-center">
        <Text>▶️</Text>
      </View>
    </TouchableOpacity>
  );
});

export default CourseCard;
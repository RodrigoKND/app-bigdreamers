import React from 'react';
import { View, Text } from 'react-native';

export default function ActivitySection({ children }: { children: React.ReactNode }) {
  return (
    <View className="mx-4 mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold dark:text-white text-black">Actividad reciente</Text>
        <Text className="text-blue-500 dark:text-blue-200 text-sm font-medium">Comunidad →</Text>
      </View>
      <View className="p-2 rounded-2xl gap-4">
        {children}
      </View>
    </View>
  );
};
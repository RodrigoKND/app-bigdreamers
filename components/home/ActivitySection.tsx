import React from 'react';
import { View, Text } from 'react-native';
import { Activity } from 'lucide-react-native';

export default function ActivitySection({ children, isEmpty }: { 
  children: React.ReactNode 
  isEmpty?: boolean;
  }) {
  return (
    <View className="mx-4 mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-lg font-bold dark:text-white text-black">Actividad reciente</Text>
        <Text className="text-blue-500 dark:text-blue-200 text-sm font-medium">Comunidad →</Text>
      </View>
            <View className="p-2 rounded-2xl gap-4">
        {isEmpty ? (
          <View className="items-center py-8 gap-2">
            <Activity size={32} color="rgba(255,255,255,0.3)" />
            <Text className="text-sm text-center" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Aún no hay actividad reciente
            </Text>
            <Text className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Completa módulos para aparecer aquí
            </Text>
          </View>
        ) : children}
      </View>
    </View>
  );
};
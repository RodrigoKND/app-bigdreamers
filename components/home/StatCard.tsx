import React from 'react';
import { View, Text } from 'react-native';

export default function StatCard({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) {
  return (
    <View className="flex-1 items-center p-3 rounded-2xl dark:bg-blue-card bg-gray-200 shadow-sm mx-1">
      {icon}
      <Text className="text-lg font-bold dark:text-white text-black">{value}</Text>
      <View className="flex-row items-center mt-1">
        <Text className="text-[10px] text-gray-500 uppercase tracking-tighter dark:text-gray-300">{label}</Text>
      </View>
    </View>
  );
}
import React from 'react';
import { View } from "react-native";
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import ButtonLoginGoogle from "@/components/login/ButtonLoginGoogle";
import Greeting from "@/components/login/Greeting";
import Hero from "@/components/login/Hero";

export default function Login() {
  const { isDark } = useTheme();

  return (
    <View className="flex-1 flex-col justify-center items-center" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}>
        <Hero />
        <Greeting />
        <ButtonLoginGoogle />
    </View>
  );
}

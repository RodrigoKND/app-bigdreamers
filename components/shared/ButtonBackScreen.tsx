import React from 'react';
import { Pressable } from 'react-native';
import { useRouter, Href } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useTheme } from '@/context/ThemeContext';

interface ButtonBackProps {
  redirectTo?: Href;
  className?: string;
}

export default function ButtonBackScreen({ redirectTo, className = 'p-2 px-6' }: ButtonBackProps) {
  const router = useRouter();
  const { isDark: dark } = useTheme();

  const handlePress = () => {
    if (redirectTo) {
      router.push(redirectTo);
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/'); 
    }
  };

  return (
    <Pressable 
      onPress={handlePress}
      className={`active:opacity-50 transition-opacity ${className}`}
      hitSlop={10}
    >
      <AntDesign 
        name="arrow-left" 
        size={24} 
        color={dark ? 'white' : 'black'} 
      />
    </Pressable>
  );
}
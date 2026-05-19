import '../global.css';
import { useEffect, useState, useRef } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Colors } from '@/constants/colors';
import ErrorBoundary from '@/components/shared/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

function LoadingScreen() {
  const { isDark } = useTheme();
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
    >
      <ActivityIndicator size="large" color={Colors.gold[400]} />
    </View>
  );
}

function AppContent() {
  const { isDark } = useTheme();
  const { isLoggedIn } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);
  const timeoutRef = useRef(false);

  useEffect(() => {
    if (isLoggedIn) {
      AsyncStorage.getItem('onboarding_done')
        .then((val) => {
          setOnboardingDone(val === 'true');
        })
        .catch(() => {
          setOnboardingDone(false);
        });
      setTimeout(() => {
        if (!timeoutRef.current) {
          timeoutRef.current = true;
          setOnboardingDone(prev => prev === null ? false : prev);
        }
      }, 5000);
    } else {
      setOnboardingDone(null);
    }
  }, [isLoggedIn]);

  const handleOnboardingDone = async () => {
    try {
      await AsyncStorage.setItem('onboarding_done', 'true');
    } catch {
      // Silently fail — navigation proceeds anyway
    }
    setOnboardingDone(true);
  };

  if (isLoggedIn && onboardingDone === null) return <LoadingScreen />;

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        {!isLoggedIn ? (
          <Stack.Screen name="login" />
        ) : !onboardingDone ? (
          <Stack.Screen name="onboarding" />
        ) : (
          <Stack.Screen name="(tabs)" />
        )}
        <Stack.Screen name="company/[id]" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ErrorBoundary>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
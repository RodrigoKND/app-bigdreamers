import '../global.css';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
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
  const { isLoggedIn, isLoading, onboardingDone } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  // Auth gate: redirige imperativamente según el estado de sesión.
  // Las <Stack.Screen> NO redirigen por sí solas: en el APK la ruta inicial
  // resuelve a (tabs)/index, por eso hay que forzar la navegación aquí.
  useEffect(() => {
    // Esperar a que termine la restauración de sesión...
    if (isLoading) return;
    // ...y a conocer el estado de onboarding cuando hay sesión.
    if (isLoggedIn && onboardingDone === null) return;

    const root = segments[0];
    const inLogin = root === 'login';
    const inOnboarding = root === 'onboarding';
    // La pantalla de callback de OAuth procesa el login: no la toques.
    const inAuthCallback = root === 'auth';

    if (inAuthCallback) return;

    if (!isLoggedIn) {
      if (!inLogin) router.replace('/login');
    } else if (!onboardingDone) {
      if (!inOnboarding) router.replace('/onboarding');
    } else if (inLogin || inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isLoading, isLoggedIn, onboardingDone, segments, router]);

  // Mientras se restaura la sesión (o se resuelve el onboarding) mostramos
  // el loader para evitar que parpadee la pantalla equivocada.
  if (isLoading || (isLoggedIn && onboardingDone === null)) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/callback" />
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
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, TrendingUp, BookOpen, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { Platform } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const tabBg       = isDark ? Colors.blue.primary       : '#FFFFFF';
  const tabBorder   = isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.06)';
  const tabActive   = isDark ? Colors.gold[400]          : Colors.light.accent;
  const tabInactive = isDark ? Colors.text.muted         : Colors.light.tabInactive;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor:  tabBorder,
          borderTopWidth:  1,
          height:          58 + (insets.bottom > 0 ? insets.bottom : 0),
          paddingBottom:   insets.bottom > 0 ? insets.bottom : Platform.OS === 'android' ? 8 : 10,
          paddingTop:      8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor:   tabActive,
        tabBarInactiveTintColor: tabInactive,
        tabBarLabelStyle: {
          fontFamily: 'Inter-SemiBold',
          fontSize:   10,
          marginTop:  2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => <House size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Aprender',
          tabBarIcon: ({ size, color }) => <BookOpen size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="invest"
        options={{
          title: 'Invertir',
          tabBarIcon: ({ size, color }) => <TrendingUp size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => <User size={size - 1} color={color} />,
        }}
      />

      <Tabs.Screen name="progress"  options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
    </Tabs>
  );
}

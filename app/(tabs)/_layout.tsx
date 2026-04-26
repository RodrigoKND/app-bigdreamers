import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, TrendingUp, BookOpen, Users, Activity, User } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const tabBg       = isDark ? Colors.navy[700]        : Colors.light.tabBg;
  const tabBorder   = isDark ? 'rgba(255,255,255,0.06)' : Colors.light.tabBorder;
  const tabActive   = isDark ? Colors.gold[500]         : Colors.light.tabActive;
  const tabInactive = isDark ? Colors.text.muted        : Colors.light.tabInactive;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor: tabBorder,
          borderTopWidth: 1,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: tabActive,
        tabBarInactiveTintColor: tabInactive,
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 10,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ size, color }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Aprender',
          tabBarIcon: ({ size, color }) => <BookOpen size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'Progreso',
          tabBarIcon: ({ size, color }) => <Activity size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ size, color }) => <Users size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
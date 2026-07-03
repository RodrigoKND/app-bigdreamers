import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, TrendingUp, BookOpen, User, Users } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { useUserAvatar } from '@/contexts/UserAvatarContext';
import { Platform, View, Image } from 'react-native';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const { avatarUrl } = useUserAvatar();

  const tabBg       = isDark ? Colors.blue.primary       : '#FFFFFF';
  const tabBorder   = isDark ? 'rgba(255,255,255,0.06)'  : 'rgba(0,0,0,0.06)';
  const tabActive   = isDark ? Colors.gold[400]          : Colors.light.accent;
  const tabInactive = isDark ? Colors.text.secondary     : '#64748B';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: tabBg,
          borderTopColor:  tabBorder,
          borderTopWidth:  1,
          height:          64 + (insets.bottom > 0 ? insets.bottom + 6 : Platform.OS === 'android' ? 16 : 14),
          paddingBottom:   insets.bottom > 0 ? insets.bottom + 6 : Platform.OS === 'android' ? 16 : 14,
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
        name="community"
        options={{
          title: 'Comunidad',
          tabBarIcon: ({ size, color }) => <Users size={size - 1} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ size }) => {
            if (avatarUrl) {
              return (
                <View className="w-7 h-7 rounded-full overflow-hidden" style={{ borderWidth: 1.5, borderColor: isDark ? Colors.gold[400] : Colors.light.accent }}>
                  <Image source={{ uri: avatarUrl }} className="w-full h-full" resizeMode="cover" />
                </View>
              );
            }
            return <User size={size - 1} color={isDark ? Colors.text.secondary : '#64748B'} />;
          },
        }}
      />

      <Tabs.Screen name="progress"  options={{ href: null }} />
    </Tabs>
  );
}

import { View, Text, Pressable, ScrollView } from 'react-native';
import { Gem, BookOpen, Building2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface AdminTabsProps {
  activeTab: 'gems' | 'courses' | 'companies';
  onTabChange: (tab: 'gems' | 'courses' | 'companies') => void;
  isDark: boolean;
}

const AdminTabs = ({ activeTab, onTabChange, isDark }: AdminTabsProps) => {
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const tabs = [
    { key: 'gems', label: 'Gemas', icon: Gem },
    { key: 'courses', label: 'Cursos', icon: BookOpen },
    { key: 'companies', label: 'Empresas', icon: Building2 },
  ] as const;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20 }}
      style={{ marginBottom: 16 }}
    >
      <View style={{ flexDirection: 'row', gap: 8 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;

          return (
            <Pressable
              key={tab.key}
              onPress={() => onTabChange(tab.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: isActive
                  ? Colors.gold[400]
                  : isDark
                  ? 'rgba(0,0,0,0.25)'
                  : Colors.light.surface,
                borderWidth: isActive ? 0 : 1,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
              }}
            >
              <Icon size={16} color={isActive ? '#000' : textMuted} />
              <Text
                style={{
                  marginLeft: 8,
                  fontWeight: '600',
                  color: isActive ? '#000' : textMuted,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default AdminTabs;
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen } from 'lucide-react-native';
import { LearningModule } from '@/types';
import { Colors } from '@/constants/colors';
import { getLearningModules } from '@/services/learningService';
import ModuleCard from '@/components/learn/ModuleCard';

const CATEGORIES = ['Todos', 'Ahorro', 'Finanzas', 'Inversión', 'Mentoría'];

export default function LearnScreen() {
  const [modules, setModules] = useState<LearningModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Todos');

  useEffect(() => {
    getLearningModules().then((m) => {
      setModules(m);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-navy-900">
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  const filtered =
    activeCategory === 'Todos'
      ? modules
      : modules.filter((m) => m.category === activeCategory);

  const completed = modules.filter((m) => m.completed).length;
  const inProgress = modules.filter((m) => m.progress > 0 && !m.completed).length;

  return (
    <SafeAreaView className="flex-1 bg-navy-900" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >

        <View className="flex-row items-center gap-[10px] px-4 pt-3 pb-3">
          <BookOpen size={22} color={Colors.gold[500]} />
          <Text className="text-white font-bold text-2xl">Aprender</Text>
        </View>

        <View className="flex-row gap-[10px] mx-4 mb-4">
          {[
            { label: 'Completados', value: completed, color: Colors.success },
            { label: 'En progreso', value: inProgress, color: Colors.blue.light },
            { label: 'Por iniciar', value: modules.length - completed - inProgress, color: Colors.text.secondary },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 bg-blue-card rounded-xl p-3 items-center border border-white/[0.06]"
              accessible={true}
              accessibilityLabel={`${stat.label}: ${stat.value}`}
            >
              <Text className="font-bold text-xl" style={{ color: stat.color }}>
                {stat.value}
              </Text>
              <Text className="text-text-muted font-sans text-[11px] mt-0.5">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 gap-2 mb-4"
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              className="px-4 py-2 rounded-full border active:opacity-70"
              style={{
                backgroundColor: activeCategory === cat ? Colors.gold[600] : Colors.blue.card,
                borderColor: activeCategory === cat ? Colors.gold[500] : 'rgba(255,255,255,0.08)',
              }}
              onPress={() => setActiveCategory(cat)}
            >
              <Text
                className="font-medium text-[13px]"
                style={{ color: activeCategory === cat ? Colors.navy[900] : Colors.text.muted }}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="px-4">
          {filtered.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
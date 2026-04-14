import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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
      <View style={styles.loader}>
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
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <BookOpen size={22} color={Colors.gold[500]} />
          <Text style={styles.title}>Aprender</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, { color: Colors.success }]}>{completed}</Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, { color: Colors.blue.light }]}>{inProgress}</Text>
            <Text style={styles.statLabel}>En progreso</Text>
          </View>
          <View style={styles.statChip}>
            <Text style={[styles.statNum, { color: Colors.text.secondary }]}>
              {modules.length - completed - inProgress}
            </Text>
            <Text style={styles.statLabel}>Por iniciar</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categories} contentContainerStyle={styles.categoriesContent}>
          {CATEGORIES.map((cat) => (
            <View key={cat} style={[styles.catBtn, activeCategory === cat && styles.catActive]}>
              <Text
                style={[styles.catText, activeCategory === cat && styles.catTextActive]}
                onPress={() => setActiveCategory(cat)}
              >
                {cat}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.modules}>
          {filtered.map((m) => (
            <ModuleCard key={m.id} module={m} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy[900] },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.navy[900] },
  scroll: { flex: 1 },
  content: { paddingBottom: 30 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12 },
  title: { color: Colors.white, fontFamily: 'Inter-Bold', fontSize: 24 },
  statsRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 16 },
  statChip: { flex: 1, backgroundColor: Colors.blue.card, borderRadius: 12, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  statNum: { fontFamily: 'Inter-Bold', fontSize: 20 },
  statLabel: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 11, marginTop: 2 },
  categories: { marginBottom: 16 },
  categoriesContent: { paddingHorizontal: 16, gap: 8 },
  catBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.blue.card, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  catActive: { backgroundColor: Colors.gold[600], borderColor: Colors.gold[500] },
  catText: { color: Colors.text.muted, fontFamily: 'Inter-Medium', fontSize: 13 },
  catTextActive: { color: Colors.navy[900] },
  modules: { paddingHorizontal: 16 },
});

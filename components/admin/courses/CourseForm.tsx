import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

type Category   = 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface LearningModuleFormData {
  title:       string;
  description: string;
  category:    string;   // en minúsculas al guardar
  duration:    string;
  gemsReward:  number;
  thumbnail:   string;
  difficulty:  Difficulty;
  orderIndex?: number;
}

interface CourseFormProps {
  onPublish: (data: LearningModuleFormData) => void;
  onCancel:  () => void;
}

const CATEGORIES:  Category[]   = ['Finanzas', 'Inversion', 'Ahorro', 'Empresa'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner:     'Básico',
  intermediate: 'Intermedio',
  advanced:     'Avanzado',
};

const CourseForm = ({ onPublish, onCancel }: CourseFormProps) => {
  const { isDark } = useTheme();

  const [title,      setTitle]      = useState('');
  const [description,setDescription]= useState('');
  const [category,   setCategory]   = useState<Category>('Finanzas');
  const [duration,   setDuration]   = useState('');
  const [gemsReward, setGemsReward] = useState('');
  const [thumbnail,  setThumbnail]  = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [orderIndex, setOrderIndex] = useState('');

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const inputStyle = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
    color: textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
  };

  const handlePublish = () => {
    if (!title.trim()) return;
    onPublish({
      title:       title.trim(),
      description: description.trim(),
      category:    category.toLowerCase(),
      duration:    duration.trim() || '0 min',
      gemsReward:  parseInt(gemsReward) || 0,
      thumbnail:   thumbnail.trim(),
      difficulty,
      orderIndex:  orderIndex ? parseInt(orderIndex) : undefined,
    });
  };

  const canPublish = !!title.trim() && !!category;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 32 }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-6 pt-2">
        <ButtonBackScreen />
        <Text
          className="flex-1 text-center text-2xl font-bold mr-8"
          style={{ color: isDark ? '#FFFFFF' : Colors.text.primary }}
        >
          Nuevo Módulo
        </Text>
      </View>
      <View style={{
        width: 32, height: 3,
        backgroundColor: Colors.gold[400],
        borderRadius: 2,
        marginBottom: 20, marginTop: -12,
      }} />

      {/* Título */}
      <TextInput
        placeholder="Título del módulo"
        placeholderTextColor={textMuted}
        value={title}
        onChangeText={setTitle}
        style={inputStyle}
      />

      {/* Descripción */}
      <TextInput
        placeholder="Descripción"
        placeholderTextColor={textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={[inputStyle, { height: 80, textAlignVertical: 'top' }]}
      />

      {/* Categoría */}
      <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 10, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.9 }}>
        Categoría
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              paddingHorizontal: 14, paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: category === cat ? Colors.gold[400] : 'rgba(255,255,255,0.06)',
              borderWidth: 1,
              borderColor: category === cat ? Colors.gold[400] : 'rgba(255,255,255,0.1)',
              marginRight: 8, marginBottom: 8,
              shadowColor: category === cat ? Colors.gold[400] : 'transparent',
              shadowOpacity: category === cat ? 0.3 : 0,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: category === cat ? '#000' : textMuted, letterSpacing: 0.3 }}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Duración */}
      <TextInput
        placeholder="Duración (ej: 45 min)"
        placeholderTextColor={textMuted}
        value={duration}
        onChangeText={setDuration}
        style={inputStyle}
      />

      {/* Gemas de recompensa */}
      <TextInput
        placeholder="Recompensa en gemas"
        placeholderTextColor={textMuted}
        value={gemsReward}
        onChangeText={setGemsReward}
        keyboardType="numeric"
        style={inputStyle}
      />

      {/* Thumbnail */}
      <TextInput
        placeholder="Thumbnail (URL de imagen)"
        placeholderTextColor={textMuted}
        value={thumbnail}
        onChangeText={setThumbnail}
        autoCapitalize="none"
        keyboardType="url"
        style={inputStyle}
      />

      {/* Dificultad */}
      <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 10, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.9 }}>
        Dificultad
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {DIFFICULTIES.map((diff) => (
          <Pressable
            key={diff}
            onPress={() => setDifficulty(diff)}
            style={{
              paddingHorizontal: 14, paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: difficulty === diff ? Colors.gold[400] : 'rgba(255,255,255,0.06)',
              borderWidth: 1,
              borderColor: difficulty === diff ? Colors.gold[400] : 'rgba(255,255,255,0.1)',
              marginRight: 8, marginBottom: 8,
              shadowColor: difficulty === diff ? Colors.gold[400] : 'transparent',
              shadowOpacity: difficulty === diff ? 0.3 : 0,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '700', color: difficulty === diff ? '#000' : textMuted, letterSpacing: 0.3 }}>
              {DIFFICULTY_LABELS[diff]}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Orden (opcional) */}
      <TextInput
        placeholder="Orden (opcional, ej: 1)"
        placeholderTextColor={textMuted}
        value={orderIndex}
        onChangeText={setOrderIndex}
        keyboardType="numeric"
        style={inputStyle}
      />

      {/* Botones */}
      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <Text style={{ color: textMuted, fontWeight: '600', fontSize: 14, letterSpacing: 0.3 }}>Cancelar</Text>
        </Pressable>

        <Pressable
          onPress={handlePublish}
          style={{
            flex: 1,
            backgroundColor: canPublish ? Colors.gold[400] : 'rgba(255,255,255,0.08)',
            borderRadius: 14,
            paddingVertical: 15,
            alignItems: 'center',
            opacity: canPublish ? 1 : 0.4,
            shadowColor: Colors.gold[400],
            shadowOpacity: canPublish ? 0.4 : 0,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: canPublish ? 4 : 0,
          }}
        >
          <Text style={{ color: canPublish ? '#000' : textMuted, fontWeight: '800', fontSize: 14, letterSpacing: 0.4 }}>
            Publicar módulo
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CourseForm;

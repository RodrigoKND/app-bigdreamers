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

const CATEGORIES:   Category[]   = ['Finanzas', 'Inversion', 'Ahorro', 'Empresa'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner:     'Básico',
  intermediate: 'Intermedio',
  advanced:     'Avanzado',
};

const CourseForm = ({ onPublish, onCancel }: CourseFormProps) => {
  const { isDark } = useTheme();

  const [title,       setTitle]       = useState('');
  const [description, setDescription] = useState('');
  const [category,    setCategory]    = useState<Category>('Finanzas');
  const [duration,    setDuration]    = useState('');
  const [gemsReward,  setGemsReward]  = useState('');
  const [thumbnail,   setThumbnail]   = useState('');
  const [difficulty,  setDifficulty]  = useState<Difficulty>('beginner');
  const [orderIndex,  setOrderIndex]  = useState('');

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const inputDynamic = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderColor:     isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
    color:           textPrimary,
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
      className="flex-1"
      style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
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
      <View
        className="w-8 h-[3px] rounded-sm mb-5 -mt-3"
        style={{ backgroundColor: Colors.gold[400] }}
      />

      {/* Título */}
      <TextInput
        placeholder="Título del módulo"
        placeholderTextColor={textMuted}
        value={title}
        onChangeText={setTitle}
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
        style={inputDynamic}
      />

      {/* Descripción */}
      <TextInput
        placeholder="Descripción"
        placeholderTextColor={textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3 h-20"
        style={[inputDynamic, { textAlignVertical: 'top' }]}
      />

      {/* Categoría */}
      <Text
        className="text-[13px] font-bold uppercase opacity-90 mb-[10px]"
        style={{ color: textPrimary, letterSpacing: 0.4 }}
      >
        Categoría
      </Text>
      <View className="flex-row flex-wrap mb-5">
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            className="px-[14px] py-[9px] rounded-full border mr-2 mb-2"
            style={{
              backgroundColor: category === cat ? Colors.gold[400] : 'rgba(255,255,255,0.06)',
              borderColor:     category === cat ? Colors.gold[400] : 'rgba(255,255,255,0.1)',
              shadowColor:    category === cat ? Colors.gold[400] : 'transparent',
              shadowOpacity:  category === cat ? 0.3 : 0,
              shadowRadius:   8,
              shadowOffset:   { width: 0, height: 2 },
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: category === cat ? '#000' : textMuted, letterSpacing: 0.3 }}
            >
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
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
        style={inputDynamic}
      />

      {/* Gemas de recompensa */}
      <TextInput
        placeholder="Recompensa en gemas"
        placeholderTextColor={textMuted}
        value={gemsReward}
        onChangeText={setGemsReward}
        keyboardType="numeric"
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
        style={inputDynamic}
      />

      {/* Thumbnail */}
      <TextInput
        placeholder="Thumbnail (URL de imagen)"
        placeholderTextColor={textMuted}
        value={thumbnail}
        onChangeText={setThumbnail}
        autoCapitalize="none"
        keyboardType="url"
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
        style={inputDynamic}
      />

      {/* Dificultad */}
      <Text
        className="text-[13px] font-bold uppercase opacity-90 mb-[10px]"
        style={{ color: textPrimary, letterSpacing: 0.4 }}
      >
        Dificultad
      </Text>
      <View className="flex-row flex-wrap mb-5">
        {DIFFICULTIES.map((diff) => (
          <Pressable
            key={diff}
            onPress={() => setDifficulty(diff)}
            className="px-[14px] py-[9px] rounded-full border mr-2 mb-2"
            style={{
              backgroundColor: difficulty === diff ? Colors.gold[400] : 'rgba(255,255,255,0.06)',
              borderColor:     difficulty === diff ? Colors.gold[400] : 'rgba(255,255,255,0.1)',
              shadowColor:    difficulty === diff ? Colors.gold[400] : 'transparent',
              shadowOpacity:  difficulty === diff ? 0.3 : 0,
              shadowRadius:   8,
              shadowOffset:   { width: 0, height: 2 },
            }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: difficulty === diff ? '#000' : textMuted, letterSpacing: 0.3 }}
            >
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
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
        style={inputDynamic}
      />

      {/* Botones */}
      <View className="flex-row gap-3 mt-5">
        <Pressable
          onPress={onCancel}
          className="flex-1 rounded-[14px] py-[15px] items-center border"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            borderColor:     'rgba(255,255,255,0.12)',
          }}
        >
          <Text
            className="font-semibold text-sm"
            style={{ color: textMuted, letterSpacing: 0.3 }}
          >
            Cancelar
          </Text>
        </Pressable>

        <Pressable
          onPress={handlePublish}
          className="flex-1 rounded-[14px] py-[15px] items-center"
          style={{
            backgroundColor: canPublish ? Colors.gold[400] : 'rgba(255,255,255,0.08)',
            opacity:         canPublish ? 1 : 0.4,
            shadowColor:    Colors.gold[400],
            shadowOpacity:  canPublish ? 0.4 : 0,
            shadowRadius:   12,
            shadowOffset:   { width: 0, height: 4 },
            elevation:      canPublish ? 4 : 0,
          }}
        >
          <Text
            className="font-extrabold text-sm"
            style={{ color: canPublish ? '#000' : textMuted, letterSpacing: 0.4 }}
          >
            Publicar módulo
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CourseForm;

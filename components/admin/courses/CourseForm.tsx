import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView, Alert,
} from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';
import { Plus, Trash2, BookOpen, HelpCircle, CheckCircle } from 'lucide-react-native';

type Category   = 'Finanzas' | 'Inversion' | 'Ahorro' | 'Empresa';
type Difficulty = 'beginner' | 'intermediate' | 'advanced';
type LessonType = 'text' | 'quiz';

export interface LearningModuleFormData {
  title:       string;
  description: string;
  category:    string;
  duration:    string;
  gemsReward:  number;
  thumbnail:   string;
  difficulty:  Difficulty;
  orderIndex?: number;
  lessons?:    { title: string; durationMinutes: number; content: string }[];
}

interface QuizQuestion {
  q:       string;
  options: [string, string, string, string];
  correct: number;
  hint:    string;
}

interface CourseFormProps {
  onPublish: (data: LearningModuleFormData) => void;
  onUpdate?: (id: string, data: LearningModuleFormData) => void;
  onCancel:  () => void;
  initialData?: LearningModuleFormData & { id?: string } | null;
  initialLessons?: { title: string; durationMinutes: number; content: string }[];
}

const CATEGORIES:   Category[]   = ['Finanzas', 'Inversion', 'Ahorro', 'Empresa'];
const DIFFICULTIES: Difficulty[] = ['beginner', 'intermediate', 'advanced'];

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: 'Básico', intermediate: 'Intermedio', advanced: 'Avanzado',
};
const DIFFICULTY_COLORS: Record<Difficulty, string> = {
  beginner: Colors.success, intermediate: Colors.warning, advanced: Colors.error,
};

function SectionLabel({ label, isDark }: { label: string; isDark: boolean }) {
  return (
    <Text
      className="text-[11px] font-extrabold uppercase tracking-widest mb-3"
      style={{ color: isDark ? 'rgba(255,255,255,0.45)' : Colors.light.textMuted, letterSpacing: 1.2 }}
    >
      {label}
    </Text>
  );
}

const emptyQuestion = (): QuizQuestion => ({
  q: '', options: ['', '', '', ''], correct: 0, hint: '',
});

const CourseForm = ({ onPublish, onUpdate, onCancel, initialData, initialLessons }: CourseFormProps) => {
  const { isDark } = useTheme();
  const isEditing = !!initialData?.id;

  const catMap: Record<string, Category> = {
    finanzas: 'Finanzas', inversion: 'Inversion', ahorro: 'Ahorro', empresa: 'Empresa',
  };

  // Module fields
  const [title,       setTitle]       = useState(initialData?.title ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [category,    setCategory]    = useState<Category>(catMap[initialData?.category?.toLowerCase() ?? ''] ?? 'Finanzas');
  const [duration,    setDuration]    = useState(initialData?.duration ?? '');
  const [gemsReward,  setGemsReward]  = useState(initialData?.gemsReward?.toString() ?? '');
  const [thumbnail,   setThumbnail]   = useState(initialData?.thumbnail ?? '');
  const [difficulty,  setDifficulty]  = useState<Difficulty>(initialData?.difficulty ?? 'beginner');
  const [orderIndex,  setOrderIndex]  = useState(initialData?.orderIndex?.toString() ?? '');

  // Lesson list
  const [lessons, setLessons] = useState<{ title: string; durationMinutes: number; content: string }[]>(initialLessons ?? []);

  // Lesson input
  const [lessonTitle,    setLessonTitle]    = useState('');
  const [lessonDuration, setLessonDuration] = useState('');
  const [lessonType,     setLessonType]     = useState<LessonType>('text');
  const [lessonContent,  setLessonContent]  = useState(''); // for text type
  const [quizQuestions,  setQuizQuestions]  = useState<QuizQuestion[]>([emptyQuestion()]);

  const bg          = isDark ? Colors.blue.primary          : Colors.light.bg;
  const cardBg      = isDark ? 'rgba(255,255,255,0.05)'     : Colors.light.card;
  const borderColor = isDark ? 'rgba(255,255,255,0.1)'      : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary          : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.5)'      : Colors.light.textMuted;

  const inputStyle = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : '#F8FAFC',
    borderColor,
    color: textPrimary,
  };

  // ── Quiz question helpers ─────────────────────────────────
  function updateQuestion(qi: number, field: keyof QuizQuestion, value: any) {
    setQuizQuestions(prev => prev.map((q, i) => i === qi ? { ...q, [field]: value } : q));
  }
  function updateOption(qi: number, oi: number, value: string) {
    setQuizQuestions(prev => prev.map((q, i) => {
      if (i !== qi) return q;
      const opts = [...q.options] as [string, string, string, string];
      opts[oi] = value;
      return { ...q, options: opts };
    }));
  }
  function addQuestion() {
    setQuizQuestions(prev => [...prev, emptyQuestion()]);
  }
  function removeQuestion(qi: number) {
    setQuizQuestions(prev => prev.length > 1 ? prev.filter((_, i) => i !== qi) : prev);
  }

  // ── Add lesson ────────────────────────────────────────────
  const handleAddLesson = () => {
    if (!lessonTitle.trim()) {
      Alert.alert('Campo requerido', 'El título de la lección no puede estar vacío.');
      return;
    }

    let content = '';
    if (lessonType === 'quiz') {
      const invalidQ = quizQuestions.find(q => !q.q.trim() || q.options.some(o => !o.trim()));
      if (invalidQ) {
        Alert.alert('Quiz incompleto', 'Completa la pregunta y todas las opciones de respuesta.');
        return;
      }
      content = JSON.stringify({ type: 'quiz', questions: quizQuestions });
    } else {
      content = lessonContent.trim();
    }

    setLessons(prev => [...prev, {
      title:           lessonTitle.trim(),
      durationMinutes: parseInt(lessonDuration) || 0,
      content,
    }]);

    setLessonTitle('');
    setLessonDuration('');
    setLessonContent('');
    setLessonType('text');
    setQuizQuestions([emptyQuestion()]);
  };

  // ── Publish / Update module ──────────────────────────────
  const doPublish = (finalLessons: typeof lessons) => {
    const payload: LearningModuleFormData = {
      title:       title.trim(),
      description: description.trim(),
      category:    category.toLowerCase(),
      duration:    duration.trim() || '0 min',
      gemsReward:  parseInt(gemsReward) || 0,
      thumbnail:   thumbnail.trim(),
      difficulty,
      orderIndex:  orderIndex ? parseInt(orderIndex) : undefined,
      lessons:     finalLessons.length > 0 ? finalLessons : undefined,
    };

    if (isEditing && initialData?.id && onUpdate) {
      onUpdate(initialData.id, payload);
    } else {
      onPublish(payload);
    }
  };

  const handlePublish = () => {
    if (!title.trim()) {
      Alert.alert('Campo requerido', 'El título del módulo no puede estar vacío.');
      return;
    }

    if (lessons.length === 0 && !lessonTitle.trim()) {
      Alert.alert(
        'Sin lecciones',
        'El módulo debe tener al menos una lección antes de publicarlo. Agrega una lección usando el formulario de abajo.',
      );
      return;
    }

    if (lessonTitle.trim()) {
      Alert.alert(
        'Lección sin agregar',
        `"${lessonTitle.trim()}" no fue agregada a la lista. ¿Qué quieres hacer?`,
        [
          { text: 'Publicar sin ella', style: 'destructive', onPress: () => doPublish(lessons) },
          {
            text: 'Agregar y publicar',
            onPress: () => {
              let content = '';
              if (lessonType === 'quiz') {
                const invalidQ = quizQuestions.find(q => !q.q.trim() || q.options.some(o => !o.trim()));
                if (invalidQ) {
                  Alert.alert('Quiz incompleto', 'Completa la pregunta y todas las opciones antes de publicar.');
                  return;
                }
                content = JSON.stringify({ type: 'quiz', questions: quizQuestions });
              } else {
                content = lessonContent.trim();
              }
              const pendingLesson = {
                title:           lessonTitle.trim(),
                durationMinutes: parseInt(lessonDuration) || 0,
                content,
              };
              doPublish([...lessons, pendingLesson]);
            },
          },
        ]
      );
      return;
    }

    doPublish(lessons);
  };

  const canPublish = !!title.trim() && lessons.length > 0;

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: bg }}
      contentContainerStyle={{ padding: 20, paddingTop: 24, paddingBottom: 48 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <ButtonBackScreen />
        <Text className="flex-1 text-center text-[22px] font-extrabold mr-8" style={{ color: textPrimary }}>
          {isEditing ? 'Editar Módulo' : 'Nuevo Módulo'}
        </Text>
      </View>

      {/* ── Info básica ─────────────────────────────────── */}
      <View className="rounded-2xl p-5 mb-4" style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}>
        <SectionLabel label="Información básica" isDark={isDark} />

        <TextInput placeholder="Título del módulo *" placeholderTextColor={textMuted}
          value={title} onChangeText={setTitle}
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-3" style={inputStyle} />

        <TextInput placeholder="Descripción" placeholderTextColor={textMuted}
          value={description} onChangeText={setDescription} multiline numberOfLines={3}
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-3"
          style={[inputStyle, { textAlignVertical: 'top', height: 88 }]} />

        <View className="flex-row gap-3">
          <TextInput placeholder="Duración (ej: 45 min)" placeholderTextColor={textMuted}
            value={duration} onChangeText={setDuration}
            className="flex-1 rounded-xl border px-4 py-3.5 text-[15px]" style={inputStyle} />
          <TextInput placeholder="Gemas" placeholderTextColor={textMuted}
            value={gemsReward} onChangeText={setGemsReward} keyboardType="numeric"
            className="flex-1 rounded-xl border px-4 py-3.5 text-[15px]" style={inputStyle} />
        </View>

        <TextInput placeholder="URL de miniatura (opcional)" placeholderTextColor={textMuted}
          value={thumbnail} onChangeText={setThumbnail} autoCapitalize="none" keyboardType="url"
          className="rounded-xl border px-4 py-3.5 text-[15px] mt-3" style={inputStyle} />

        <TextInput placeholder="Orden (opcional, ej: 1)" placeholderTextColor={textMuted}
          value={orderIndex} onChangeText={setOrderIndex} keyboardType="numeric"
          className="rounded-xl border px-4 py-3.5 text-[15px] mt-3" style={inputStyle} />
      </View>

      {/* ── Categoría ───────────────────────────────────── */}
      <View className="rounded-2xl p-5 mb-4" style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}>
        <SectionLabel label="Categoría" isDark={isDark} />
        <View className="flex-row flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <Pressable key={cat} onPress={() => setCategory(cat)}
              className="px-4 py-2 rounded-xl border"
              style={{
                backgroundColor: category === cat ? Colors.gold[400] : isDark ? 'rgba(255,255,255,0.06)' : Colors.light.surface,
                borderColor:     category === cat ? Colors.gold[400] : borderColor,
              }}>
              <Text className="text-xs font-bold" style={{ color: category === cat ? '#000' : textMuted }}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ── Dificultad ──────────────────────────────────── */}
      <View className="rounded-2xl p-5 mb-4" style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}>
        <SectionLabel label="Dificultad" isDark={isDark} />
        <View className="flex-row gap-2">
          {DIFFICULTIES.map(diff => {
            const active = difficulty === diff;
            const dColor = DIFFICULTY_COLORS[diff];
            return (
              <Pressable key={diff} onPress={() => setDifficulty(diff)}
                className="flex-1 py-2.5 rounded-xl border items-center"
                style={{
                  backgroundColor: active ? `${dColor}20` : isDark ? 'rgba(255,255,255,0.04)' : Colors.light.surface,
                  borderColor:     active ? dColor        : borderColor,
                }}>
                <Text className="text-xs font-bold" style={{ color: active ? dColor : textMuted }}>
                  {DIFFICULTY_LABELS[diff]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ── Lecciones ───────────────────────────────────── */}
      <View className="rounded-2xl p-5 mb-4" style={{ backgroundColor: cardBg, borderWidth: 1, borderColor }}>
        <SectionLabel label={`Lecciones (${lessons.length})`} isDark={isDark} />

        {/* Lesson title + duration */}
        <TextInput placeholder="Título de la lección" placeholderTextColor={textMuted}
          value={lessonTitle} onChangeText={setLessonTitle}
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-3" style={inputStyle} />

        <TextInput placeholder="Duración en minutos" placeholderTextColor={textMuted}
          value={lessonDuration} onChangeText={setLessonDuration} keyboardType="numeric"
          className="rounded-xl border px-4 py-3.5 text-[15px] mb-4" style={inputStyle} />

        {/* Type selector */}
        <Text className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: textMuted }}>
          Tipo de lección
        </Text>
        <View className="flex-row gap-2 mb-4">
          {(['text', 'quiz'] as LessonType[]).map(t => {
            const active = lessonType === t;
            const tColor = t === 'quiz' ? '#60A5FA' : Colors.gold[400];
            return (
              <Pressable key={t} onPress={() => setLessonType(t)}
                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl border"
                style={{
                  backgroundColor: active ? `${tColor}18` : isDark ? 'rgba(255,255,255,0.04)' : Colors.light.surface,
                  borderColor:     active ? tColor         : borderColor,
                }}>
                {t === 'text'
                  ? <BookOpen size={15} color={active ? tColor : textMuted} />
                  : <HelpCircle size={15} color={active ? tColor : textMuted} />}
                <Text className="text-xs font-bold" style={{ color: active ? tColor : textMuted }}>
                  {t === 'text' ? 'Texto' : 'Quiz interactivo'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* ── Text type ──────────────────────────── */}
        {lessonType === 'text' && (
          <TextInput placeholder="Contenido de la lección" placeholderTextColor={textMuted}
            value={lessonContent} onChangeText={setLessonContent} multiline numberOfLines={4}
            className="rounded-xl border px-4 py-3.5 text-[15px] mb-4"
            style={[inputStyle, { textAlignVertical: 'top', height: 112 }]} />
        )}

        {/* ── Quiz type ──────────────────────────── */}
        {lessonType === 'quiz' && (
          <View className="mb-4">
            {quizQuestions.map((qItem, qi) => (
              <View
                key={qi}
                className="rounded-xl p-4 mb-3"
                style={{ backgroundColor: isDark ? 'rgba(96,165,250,0.07)' : '#EFF6FF', borderWidth: 1, borderColor: isDark ? 'rgba(96,165,250,0.2)' : '#BFDBFE' }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-xs font-extrabold" style={{ color: isDark ? '#60A5FA' : '#1D4ED8' }}>
                    PREGUNTA {qi + 1}
                  </Text>
                  {quizQuestions.length > 1 && (
                    <Pressable onPress={() => removeQuestion(qi)}>
                      <Trash2 size={14} color={Colors.error} />
                    </Pressable>
                  )}
                </View>

                <TextInput placeholder="Escribe la pregunta…" placeholderTextColor={textMuted}
                  value={qItem.q} onChangeText={v => updateQuestion(qi, 'q', v)}
                  className="rounded-xl border px-4 py-3 text-[14px] mb-3" style={inputStyle} />

                {qItem.options.map((opt, oi) => {
                  const isCorrect = qItem.correct === oi;
                  return (
                    <View key={oi} className="flex-row items-center gap-2 mb-2">
                      <Pressable
                        onPress={() => updateQuestion(qi, 'correct', oi)}
                        className="w-7 h-7 rounded-full border-2 items-center justify-center"
                        style={{ borderColor: isCorrect ? Colors.success : borderColor, backgroundColor: isCorrect ? `${Colors.success}20` : 'transparent' }}
                      >
                        {isCorrect && <CheckCircle size={14} color={Colors.success} />}
                      </Pressable>
                      <TextInput
                        placeholder={`Opción ${String.fromCharCode(65 + oi)}`}
                        placeholderTextColor={textMuted}
                        value={opt}
                        onChangeText={v => updateOption(qi, oi, v)}
                        className="flex-1 rounded-xl border px-3 py-3 text-[13px]"
                        style={{ ...inputStyle, borderColor: isCorrect ? `${Colors.success}60` : borderColor }}
                      />
                    </View>
                  );
                })}

                <TextInput placeholder="Explicación (opcional)" placeholderTextColor={textMuted}
                  value={qItem.hint} onChangeText={v => updateQuestion(qi, 'hint', v)}
                  className="rounded-xl border px-4 py-3 text-[13px] mt-1" style={inputStyle} />
              </View>
            ))}

            <Pressable
              onPress={addQuestion}
              className="flex-row items-center justify-center gap-2 py-3 rounded-xl border"
              style={{ borderColor: isDark ? 'rgba(96,165,250,0.3)' : '#BFDBFE', backgroundColor: isDark ? 'rgba(96,165,250,0.07)' : '#EFF6FF' }}
            >
              <Plus size={15} color={isDark ? '#60A5FA' : '#1D4ED8'} />
              <Text className="text-xs font-bold" style={{ color: isDark ? '#60A5FA' : '#1D4ED8' }}>
                Agregar otra pregunta
              </Text>
            </Pressable>
          </View>
        )}

        {/* Add lesson button */}
        <Pressable
          onPress={handleAddLesson}
          className="flex-row items-center justify-center rounded-xl py-3 gap-2 border"
          style={{
            backgroundColor: isDark ? 'rgba(255,215,64,0.1)' : Colors.light.goldLight,
            borderColor:     isDark ? 'rgba(255,215,64,0.25)' : Colors.light.gold,
          }}
        >
          <Plus size={16} color={isDark ? Colors.gold[400] : Colors.light.goldDark} />
          <Text className="font-bold text-sm" style={{ color: isDark ? Colors.gold[400] : Colors.light.goldDark }}>
            Agregar lección
          </Text>
        </Pressable>

        {/* Lesson list */}
        {lessons.length > 0 && (
          <View className="mt-4 gap-2">
            {lessons.map((lesson, index) => {
              const isQuiz = lesson.content.startsWith('{"type":"quiz"');
              return (
                <View
                  key={index}
                  className="flex-row items-center rounded-xl border px-4 py-3"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : '#F8FAFC', borderColor }}
                >
                  <View
                    className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                    style={{ backgroundColor: isQuiz ? 'rgba(96,165,250,0.15)' : 'rgba(255,215,64,0.12)' }}
                  >
                    {isQuiz
                      ? <HelpCircle size={15} color={isDark ? '#60A5FA' : '#1D4ED8'} />
                      : <BookOpen   size={15} color={isDark ? Colors.gold[400] : Colors.light.goldDark} />
                    }
                  </View>
                  <View className="flex-1">
                    <Text className="text-[13px] font-semibold" style={{ color: textPrimary }} numberOfLines={1}>
                      {lesson.title}
                    </Text>
                    <Text className="text-xs mt-0.5" style={{ color: textMuted }}>
                      {lesson.durationMinutes} min · {isQuiz ? 'Quiz' : 'Texto'}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setLessons(prev => prev.filter((_, i) => i !== index))}
                    className="w-7 h-7 rounded-lg items-center justify-center"
                    style={{ backgroundColor: isDark ? 'rgba(239,68,68,0.12)' : Colors.light.errorBg }}
                  >
                    <Trash2 size={13} color={Colors.error} />
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* ── Botones ─────────────────────────────────────── */}
      <View className="flex-row gap-3">
        <Pressable onPress={onCancel} className="flex-1 rounded-2xl py-4 items-center border"
          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.surface, borderColor }}>
          <Text className="font-semibold text-sm" style={{ color: textMuted }}>Cancelar</Text>
        </Pressable>

        <Pressable onPress={handlePublish} disabled={!canPublish}
          className="flex-1 rounded-2xl py-4 items-center"
          style={{
            backgroundColor: canPublish ? Colors.gold[400] : isDark ? 'rgba(255,255,255,0.08)' : Colors.light.border,
            opacity: canPublish ? 1 : 0.5,
          }}>
          <Text className="font-extrabold text-sm" style={{ color: canPublish ? '#000' : textMuted }}>
            {!title.trim()
              ? 'Falta título'
              : lessons.length === 0
                ? 'Agrega una lección'
                : isEditing ? 'Guardar cambios' : 'Publicar módulo'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CourseForm;

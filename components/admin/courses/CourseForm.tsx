import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Course, CourseModule, CourseObjective } from '@/constants/mockCourses';
import ModuleForm from './ModuleForm';
import ObjectiveForm from './ObjectiveForm';
import { useTheme } from '@/context/ThemeContext';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

interface CourseFormProps {
  onPublish: (course: Partial<Course>) => void;
  onCancel: () => void;
}

const CourseForm = ({ onPublish, onCancel }: CourseFormProps) => {
  const { isDark } = useTheme();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Course['category']>('Finanzas');
  const [modules, setModules] = useState<Partial<CourseModule>[]>([]);
  const [objectives, setObjectives] = useState<Partial<CourseObjective>[]>([]);

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

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

  const categories: Course['category'][] = ['Finanzas', 'Inversion', 'Ahorro', 'Empresa'];

  const addModule = () => {
    const newModule: Partial<CourseModule> = {
      id: `m${Date.now()}`,
      title: '',
      description: '',
      lessons: [],
      badgeId: null,
    };
    setModules([...modules, newModule]);
  };

  const updateModule = (index: number, updatedModule: Partial<CourseModule>) => {
    const updated = [...modules];
    updated[index] = updatedModule;
    setModules(updated);
  };

  const removeModule = (index: number) => {
    setModules(modules.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!title.trim()) return;

    onPublish({
      title: title.trim(),
      description: description.trim(),
      category,
      totalLessons: modules.reduce((sum, module) => sum + (module.lessons?.length || 0), 0),
      modules: modules.map((module, index) => ({
        ...module,
        id: module.id || `m${index + 1}`,
      })) as CourseModule[],
      objectives: objectives as CourseObjective[],
    });
  };

  const canPublish = title.trim();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }} contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 32 }}>
      <View className="flex-row items-center mb-6 pt-2">
        <ButtonBackScreen />
        <Text
          className="flex-1 text-center text-2xl font-bold mr-8"
          style={{ color: isDark ? '#FFFFFF' : Colors.text.primary }}
        >
          Nuevo Curso
        </Text>
      </View>
      <View style={{
        width: 32,
        height: 3,
        backgroundColor: Colors.gold[400],
        borderRadius: 2,
        marginBottom: 20,
        marginTop: -12,
      }} />

      <TextInput
        placeholder="Título del curso"
        placeholderTextColor={textMuted}
        value={title}
        onChangeText={setTitle}
        style={inputStyle}
      />

      <TextInput
        placeholder="Descripción"
        placeholderTextColor={textMuted}
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={3}
        style={[inputStyle, { height: 80, textAlignVertical: 'top' }]}
      />

      <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 10, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.9 }}>Categoría</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 20,
              backgroundColor: category === cat ? Colors.gold[400] : 'rgba(255,255,255,0.06)',
              borderWidth: 1,
              borderColor: category === cat ? Colors.gold[400] : 'rgba(255,255,255,0.1)',
              marginRight: 8,
              marginBottom: 8,
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

      <View style={{
        marginBottom: 24,
        padding: 14,
        backgroundColor: isDark ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.02)',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.9 }}>Módulos</Text>
          <Pressable
            onPress={addModule}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.gold[400],
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 10,
              shadowColor: Colors.gold[400],
              shadowOpacity: 0.35,
              shadowRadius: 8,
              shadowOffset: { width: 0, height: 2 },
              elevation: 3,
            }}
          >
            <Plus size={14} color="#000" />
            <Text style={{ marginLeft: 6, fontSize: 12, fontWeight: '600', color: '#000', letterSpacing: 0.3 }}>
              Agregar módulo
            </Text>
          </Pressable>
        </View>

        {modules.map((module, index) => (
          <ModuleForm
            key={module.id || index}
            moduleIndex={index}
            module={module}
            onChange={(updated) => updateModule(index, updated)}
            onRemove={() => removeModule(index)}
            isDark={isDark}
          />
        ))}

        <Text style={{ fontSize: 12, color: textMuted, marginTop: 10, lineHeight: 18, fontStyle: 'italic', opacity: 0.85 }}>
          Cada módulo puede contener lecciones y tiene su propia insignia.
        </Text>
      </View>

      <ObjectiveForm objectives={objectives} onChange={setObjectives} isDark={isDark} />

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
            Publicar curso
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CourseForm;
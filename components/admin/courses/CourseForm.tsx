import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { Course, CourseModule, CourseObjective } from '@/constants/mockCourses';
import ModuleForm from './ModuleForm';
import ObjectiveForm from './ObjectiveForm';

interface CourseFormProps {
  isDark: boolean;
  onPublish: (course: Partial<Course>) => void;
  onCancel: () => void;
}

const CourseForm = ({ isDark, onPublish, onCancel }: CourseFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Course['category']>('Finanzas');
  const [modules, setModules] = useState<Partial<CourseModule>[]>([]);
  const [objectives, setObjectives] = useState<Partial<CourseObjective>[]>([]);

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const inputStyle = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
    color: textPrimary,
    padding: 12,
    fontSize: 14,
    marginBottom: 10,
  };

  const categories: Course['category'][] = ['Finanzas', 'Inversión', 'Ahorro', 'Empresa'];

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
    if (!title.trim() || modules.length === 0) return;

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

  const canPublish = title.trim() && modules.length > 0;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary, marginBottom: 20 }}>
        Nuevo Curso
      </Text>

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

      <Text style={{ fontWeight: '600', color: textPrimary, marginBottom: 8 }}>Categoría</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
        {categories.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: category === cat ? Colors.gold[400] : 'rgba(255,255,255,0.08)',
              marginRight: 8,
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: category === cat ? '#000' : textMuted }}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ fontWeight: '700', color: textPrimary }}>Módulos</Text>
          <Pressable
            onPress={addModule}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: Colors.gold[400],
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
            }}
          >
            <Plus size={14} color="#000" />
            <Text style={{ marginLeft: 6, fontSize: 12, fontWeight: '600', color: '#000' }}>
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

        <Text style={{ fontSize: 12, color: textMuted, marginTop: 8 }}>
          Cada módulo puede contener lecciones y tiene su propia insignia.
        </Text>
      </View>

      <ObjectiveForm objectives={objectives} onChange={setObjectives} isDark={isDark} />

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: textMuted, fontWeight: '600' }}>Cancelar</Text>
        </Pressable>

        <Pressable
          onPress={handlePublish}
          style={{
            flex: 1,
            backgroundColor: canPublish ? Colors.gold[400] : 'rgba(255,255,255,0.08)',
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: 'center',
            opacity: canPublish ? 1 : 0.4,
          }}
        >
          <Text style={{ color: canPublish ? '#000' : textMuted, fontWeight: '800' }}>
            Publicar curso
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CourseForm;
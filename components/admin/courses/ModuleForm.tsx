import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { CourseModule } from '@/constants/mockCourses';
import BadgeSelector from './BadgeSelector';

interface ModuleFormProps {
  moduleIndex: number;
  module: Partial<CourseModule>;
  onChange: (updated: Partial<CourseModule>) => void;
  onRemove: () => void;
  isDark: boolean;
}

const ModuleForm = ({ moduleIndex, module, onChange, onRemove, isDark }: ModuleFormProps) => {
  const [title, setTitle] = useState(module.title || '');
  const [description, setDescription] = useState(module.description || '');
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(module.badgeId || null);

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

  const handleTitleChange = (value: string) => {
    setTitle(value);
    onChange({ ...module, title: value });
  };

  const handleDescriptionChange = (value: string) => {
    setDescription(value);
    onChange({ ...module, description: value });
  };

  const handleBadgeSelect = (badgeId: string) => {
    setSelectedBadgeId(badgeId);
    onChange({ ...module, badgeId });
  };

  return (
    <View
      style={{
        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : Colors.light.surface,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <Text style={{ fontWeight: '700', color: textPrimary }}>Módulo {moduleIndex + 1}</Text>
        <Pressable onPress={onRemove}>
          <Trash2 size={16} color="#FF6B6B" />
        </Pressable>
      </View>

      <TextInput
        placeholder="Título del módulo"
        placeholderTextColor={textMuted}
        value={title}
        onChangeText={handleTitleChange}
        style={inputStyle}
      />

      <TextInput
        placeholder="Descripción del módulo"
        placeholderTextColor={textMuted}
        value={description}
        onChangeText={handleDescriptionChange}
        style={inputStyle}
      />

      <BadgeSelector selectedBadgeId={selectedBadgeId} onSelect={handleBadgeSelect} isDark={isDark} />

      <Text style={{ fontSize: 11, color: textMuted, marginTop: 8 }}>
        Esta insignia se asignará al usuario al completar este módulo
      </Text>
    </View>
  );
};

export default ModuleForm;
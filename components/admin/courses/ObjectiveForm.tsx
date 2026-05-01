import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { Plus, Trash2 } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { CourseObjective } from '@/constants/mockCourses';
import BadgeSelector from './BadgeSelector';

interface ObjectiveFormProps {
  objectives: Partial<CourseObjective>[];
  onChange: (objectives: Partial<CourseObjective>[]) => void;
  isDark: boolean;
}

const ObjectiveForm = ({ objectives, onChange, isDark }: ObjectiveFormProps) => {
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

  const addObjective = () => {
    const newObjective: Partial<CourseObjective> = {
      id: `o${Date.now()}`,
      description: '',
      triggerType: 'module',
      triggerValue: '',
      badgeId: undefined,
    };
    onChange([...objectives, newObjective]);
  };

  const updateObjective = (index: number, field: keyof CourseObjective, value: string) => {
    const updated = [...objectives];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeObjective = (index: number) => {
    onChange(objectives.filter((_, i) => i !== index));
  };

  const toggleTriggerType = (index: number) => {
    const currentType = objectives[index].triggerType;
    const newType = currentType === 'module' ? 'gems' : 'module';
    updateObjective(index, 'triggerType', newType);
  };

  return (
    <View>
      <Text style={{ fontWeight: '700', color: textPrimary, marginBottom: 12 }}>
        Objetivos y logros
      </Text>

      {objectives.map((objective, index) => (
        <View
          key={objective.id || index}
          style={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : Colors.light.surface,
            borderRadius: 10,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontWeight: '600', color: textPrimary }}>Objetivo {index + 1}</Text>
            <Pressable onPress={() => removeObjective(index)}>
              <Trash2 size={16} color="#FF6B6B" />
            </Pressable>
          </View>

          <View style={{ flexDirection: 'row', marginBottom: 12 }}>
            <Pressable
              onPress={() => toggleTriggerType(index)}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: objective.triggerType === 'module' ? Colors.gold[400] : 'rgba(255,255,255,0.08)',
                marginRight: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: objective.triggerType === 'module' ? '#000' : textMuted }}>
                Al completar módulo
              </Text>
            </Pressable>
            <Pressable
              onPress={() => toggleTriggerType(index)}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 8,
                backgroundColor: objective.triggerType === 'gems' ? Colors.gold[400] : 'rgba(255,255,255,0.08)',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: objective.triggerType === 'gems' ? '#000' : textMuted }}>
                Al acumular gemas
              </Text>
            </Pressable>
          </View>

          {objective.triggerType === 'module' ? (
            <TextInput
              placeholder="ID del módulo (ej: m04)"
              placeholderTextColor={textMuted}
              value={objective.triggerValue || ''}
              onChangeText={(value) => updateObjective(index, 'triggerValue', value)}
              style={inputStyle}
            />
          ) : (
            <TextInput
              placeholder="Cantidad de gemas"
              placeholderTextColor={textMuted}
              value={objective.triggerValue || ''}
              onChangeText={(value) => updateObjective(index, 'triggerValue', value)}
              keyboardType="numeric"
              style={inputStyle}
            />
          )}

          <BadgeSelector
            selectedBadgeId={objective.badgeId || null}
            onSelect={(badgeId) => updateObjective(index, 'badgeId', badgeId)}
            isDark={isDark}
          />
        </View>
      ))}

      <Pressable
        onPress={addObjective}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: 10,
          paddingVertical: 12,
          marginTop: 12,
        }}
      >
        <Plus size={16} color={Colors.gold[400]} />
        <Text style={{ marginLeft: 8, color: Colors.gold[400], fontWeight: '600' }}>
          Agregar objetivo
        </Text>
      </Pressable>
    </View>
  );
};

export default ObjectiveForm;
import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Plus, Trash2, UserPlus } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { CompanyLevel, CompanyTeamMember, Company } from '@/constants/mockCompanies';
import LevelSelector from './LevelSelector';

interface CompanyFormProps {
  isDark: boolean;
  onPublish: (company: Partial<Company>) => void;
  onCancel: () => void;
}

const CompanyForm = ({ isDark, onPublish, onCancel }: CompanyFormProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gems, setGems] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [level, setLevel] = useState<CompanyLevel>('bronze');
  const [teamMembers, setTeamMembers] = useState<CompanyTeamMember[]>([]);

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

  const addTeamMember = () => {
    setTeamMembers([...teamMembers, { name: '', role: '' }]);
  };

  const updateTeamMember = (index: number, field: keyof CompanyTeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };
    setTeamMembers(updated);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handlePublish = () => {
    if (!name.trim() || !description.trim() || !level) return;

    onPublish({
      name: name.trim(),
      description: description.trim(),
      gems: parseInt(gems) || 0,
      imageUrl: imageUrl.trim() || '',
      level,
      teamMembers: teamMembers.filter(m => m.name.trim() && m.role.trim()),
    });
  };

  const canPublish = name.trim() && description.trim() && level;

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary, marginBottom: 20 }}>
        Nueva Empresa
      </Text>

      <TextInput
        placeholder="Nombre de la empresa"
        placeholderTextColor={textMuted}
        value={name}
        onChangeText={setName}
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

      <TextInput
        placeholder="Gemas requeridas"
        placeholderTextColor={textMuted}
        value={gems}
        onChangeText={setGems}
        keyboardType="numeric"
        style={inputStyle}
      />

      <TextInput
        placeholder="URL de imagen"
        placeholderTextColor={textMuted}
        value={imageUrl}
        onChangeText={setImageUrl}
        style={inputStyle}
      />

      <LevelSelector selected={level} onSelect={setLevel} isDark={isDark} />

      <View style={{ marginTop: 20 }}>
        <Text style={{ fontWeight: '700', color: textPrimary, marginBottom: 12 }}>
          Representantes del equipo
        </Text>

        {teamMembers.map((member, index) => (
          <View
            key={index}
            style={{
              backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : Colors.light.surface,
              borderRadius: 10,
              padding: 12,
              marginBottom: 8,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontWeight: '600', color: textPrimary }}>Miembro {index + 1}</Text>
              <Pressable onPress={() => removeTeamMember(index)}>
                <Trash2 size={16} color="#FF6B6B" />
              </Pressable>
            </View>

            <TextInput
              placeholder="Nombre"
              placeholderTextColor={textMuted}
              value={member.name}
              onChangeText={(value) => updateTeamMember(index, 'name', value)}
              style={[inputStyle, { marginBottom: 8 }]}
            />

            <TextInput
              placeholder="Rol"
              placeholderTextColor={textMuted}
              value={member.role}
              onChangeText={(value) => updateTeamMember(index, 'role', value)}
              style={inputStyle}
            />
          </View>
        ))}

        <Pressable
          onPress={addTeamMember}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderRadius: 10,
            paddingVertical: 12,
            marginBottom: 20,
          }}
        >
          <UserPlus size={16} color={Colors.gold[400]} />
          <Text style={{ marginLeft: 8, color: Colors.gold[400], fontWeight: '600' }}>
            Agregar representante
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
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
            Publicar empresa
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CompanyForm;
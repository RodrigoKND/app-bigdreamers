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
    borderRadius: 12,
    borderWidth: 1,
    borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
    color: textPrimary,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: isDark ? 0.15 : 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
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
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 32 }}>
      <Text style={{ fontSize: 22, fontWeight: '800', color: textPrimary, marginBottom: 8, letterSpacing: 0.3 }}>
        Nueva Empresa
      </Text>
      <View style={{
        width: 32,
        height: 3,
        backgroundColor: Colors.gold[400],
        borderRadius: 2,
        marginBottom: 20,
        marginTop: -12,
      }} />

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
        <Text style={{ fontSize: 13, fontWeight: '700', color: textPrimary, marginBottom: 10, letterSpacing: 0.4, textTransform: 'uppercase', opacity: 0.9 }}>
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
            marginTop: 12,
          }}
        >
          <UserPlus size={16} color={Colors.gold[400]} />
          <Text style={{ marginLeft: 8, color: Colors.gold[400], fontWeight: '600', fontSize: 14, letterSpacing: 0.3 }}>
            Agregar representante
          </Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: 'row', gap: 12 }}>
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
            Crear empresa
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CompanyForm;
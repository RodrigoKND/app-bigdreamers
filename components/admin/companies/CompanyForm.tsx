import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { Trash2, UserPlus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ImagePickerField from '@/components/shared/ImagePickerField';
import { Colors } from '@/constants/colors';
import { CompanyLevel, CompanyTeamMember, Company } from '@/constants/mockCompanies';
import LevelSelector from '@/components/admin/companies/LevelSelector';
import { useTheme } from '@/context/ThemeContext';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

interface CompanyFormProps {
  onPublish: (company: Partial<Company>) => void;
  onCancel: () => void;
}

const CompanyForm = ({ onPublish, onCancel }: CompanyFormProps) => {
  const { isDark } = useTheme();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gems, setGems] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [level, setLevel] = useState<CompanyLevel>('bronze');
  const [teamMembers, setTeamMembers] = useState<CompanyTeamMember[]>([]);

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const inputDynamic = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderColor:     isDark ? 'rgba(255,255,255,0)' : '#E2E8F0',
    color:           textPrimary,
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const removeImage = () => setImageUrl('');

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
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
      contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 32 }}
    >
      <View className="flex-row items-center mb-6 pt-2">
        <ButtonBackScreen />
        <Text
          className="flex-1 text-center text-2xl font-bold mr-8"
          style={{ color: isDark ? '#FFFFFF' : Colors.text.primary }}
        >
          Nueva Empresa
        </Text>
      </View>
      <View
        className="w-8 h-[3px] rounded-sm mb-5 -mt-3"
        style={{ backgroundColor: Colors.gold[400] }}
      />

      {/* Imagen */}
      <ImagePickerField
        isDark={isDark}
        imageUri={imageUrl}
        onPick={pickImage}
        onRemove={removeImage}
        variant="cover"
        label="Imagen de la empresa"
      />

      <TextInput
        placeholder="Nombre de la empresa"
        placeholderTextColor={textMuted}
        value={name}
        onChangeText={setName}
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
        style={inputDynamic}
      />

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

      <TextInput
        placeholder="Gemas requeridas"
        placeholderTextColor={textMuted}
        value={gems}
        onChangeText={setGems}
        keyboardType="numeric"
        className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
        style={inputDynamic}
      />

      <LevelSelector selected={level} onSelect={setLevel} isDark={isDark} />

      {/* Representantes */}
      <View className="mt-5">
        <Text
          className="text-[13px] font-bold uppercase opacity-90 mb-[10px]"
          style={{ color: textPrimary, letterSpacing: 0.4 }}
        >
          Representantes del equipo
        </Text>

        {teamMembers.map((member, index) => (
          <View
            key={index}
            className="rounded-[10px] p-3 mb-2"
            style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : Colors.light.surface }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold" style={{ color: textPrimary }}>Miembro {index + 1}</Text>
              <Pressable onPress={() => removeTeamMember(index)}>
                <Trash2 size={16} color="#FF6B6B" />
              </Pressable>
            </View>

            <TextInput
              placeholder="Nombre"
              placeholderTextColor={textMuted}
              value={member.name}
              onChangeText={(value) => updateTeamMember(index, 'name', value)}
              className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-2"
              style={inputDynamic}
            />

            <TextInput
              placeholder="Rol"
              placeholderTextColor={textMuted}
              value={member.role}
              onChangeText={(value) => updateTeamMember(index, 'role', value)}
              className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
              style={inputDynamic}
            />
          </View>
        ))}

        <Pressable
          onPress={addTeamMember}
          className="flex-row items-center justify-center rounded-[10px] py-3 mb-5 mt-3"
          style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
        >
          <UserPlus size={16} color={Colors.gold[400]} />
          <Text
            className="ml-2 font-semibold text-sm"
            style={{ color: Colors.gold[400], letterSpacing: 0.3 }}
          >
            Agregar representante
          </Text>
        </Pressable>
      </View>

      {/* Botones */}
      <View className="flex-row gap-3">
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
            Crear empresa
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default CompanyForm;

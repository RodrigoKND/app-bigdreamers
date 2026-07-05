import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Trash2, UserPlus, Mail, MessageCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import ImagePickerField from '@/components/shared/ImagePickerField';
import { Colors } from '@/constants/colors';
import { CompanyLevel, CompanyTeamMember, Company } from '@/constants/mockCompanies';
import LevelSelector from '@/components/admin/companies/LevelSelector';
import { useTheme } from '@/context/ThemeContext';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

interface CompanyFormProps {
  onPublish: (company: Partial<Company>) => void;
  onUpdate?: (id: string, company: Partial<Company>) => void;
  onCancel: () => void;
  initialData?: Company | null;
}

const CompanyForm = ({ onPublish, onUpdate, onCancel, initialData }: CompanyFormProps) => {
  const { isDark } = useTheme();
  const isEditing = !!initialData;
  const [name, setName] = useState(initialData?.name ?? '');
  const [description, setDescription] = useState(initialData?.description ?? '');
  const [gems, setGems] = useState(initialData?.gems?.toString() ?? '');
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '');
  const [level, setLevel] = useState<CompanyLevel>(initialData?.level ?? 'bronze');
  const [teamMembers, setTeamMembers] = useState<CompanyTeamMember[]>(() => {
    const existing = initialData?.teamMembers?.map(m => ({ ...m, contactType: m.contactType ?? (m.contact?.includes('@') ? 'email' : 'whatsapp') })) ?? [];
    // El primer representante es SIEMPRE el representante legal (obligatorio).
    // Si no hay ninguno, sembramos uno con el rol prellenado.
    return existing.length > 0
      ? existing
      : [{ name: '', role: 'Representante legal', contact: '+591 ', contactType: 'whatsapp' as const }];
  });

  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const inputDynamic = {
    backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
    borderColor:     isDark ? 'rgba(255,255,255,0)' : '#E2E8F0',
    color:           textPrimary,
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para seleccionar una imagen de portada. Puedes habilitarlo en Ajustes > Privacidad.');
      return;
    }

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
    setTeamMembers([...teamMembers, { name: '', role: '', contact: '', contactType: 'whatsapp' }]);
  };

  const updateTeamMember = (index: number, field: keyof CompanyTeamMember, value: string) => {
    const updated = [...teamMembers];
    updated[index] = { ...updated[index], [field]: value };

    // Auto-add +591 when switching to WhatsApp with empty contact
    if (field === 'contactType') {
      if (value === 'whatsapp' && (!updated[index].contact || updated[index].contact === '')) {
        updated[index].contact = '+591 ';
      }
      if (value === 'email' && updated[index].contact?.startsWith('+591')) {
        updated[index].contact = '';
      }
    }

    setTeamMembers(updated);
  };

  const removeTeamMember = (index: number) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const legalRep = teamMembers[0];
  const legalRepValid = !!legalRep
    && legalRep.name.trim().length > 0
    && legalRep.role.trim().length > 0
    && (legalRep.contact?.trim().length ?? 0) > 0;

  const handlePublish = () => {
    if (!name.trim() || !description.trim() || !level) return;

    if (!legalRepValid) {
      Alert.alert(
        'Representante legal requerido',
        'Debes registrar al representante legal con nombre, rol y contacto antes de crear la empresa.'
      );
      return;
    }

    const payload: Partial<Company> = {
      name: name.trim(),
      description: description.trim(),
      gems: parseInt(gems) || 0,
      imageUrl: imageUrl.trim() || '',
      level,
      teamMembers: teamMembers.filter(m => m.name.trim() && m.role.trim()).map(m => ({
        name: m.name,
        role: m.role,
        contact: m.contact?.trim() ?? '',
        contactType: m.contactType,
      })),
    };

    if (isEditing && initialData && onUpdate) {
      onUpdate(initialData.id, payload);
    } else {
      onPublish(payload);
    }
  };

  const canPublish = name.trim() && description.trim() && level && legalRepValid;

  return (
    <KeyboardAvoidingView
      className="flex-1"
      style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}
      behavior="padding"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
    <ScrollView
      className="flex-1"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ padding: 20, paddingTop: 28, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center mb-6 pt-2">
        <ButtonBackScreen />
        <Text
          className="flex-1 text-center text-2xl font-bold mr-8"
          style={{ color: isDark ? '#FFFFFF' : Colors.text.primary }}
        >
          {isEditing ? 'Editar Empresa' : 'Nueva Empresa'}
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
          className="text-[13px] font-bold uppercase opacity-90 mb-1"
          style={{ color: textPrimary, letterSpacing: 0.4 }}
        >
          Representantes del equipo
        </Text>
        <Text className="text-[12px] mb-[10px]" style={{ color: textMuted }}>
          El representante legal es obligatorio.
        </Text>

        {teamMembers.map((member, index) => (
          <View
            key={index}
            className="rounded-[10px] p-3 mb-2"
            style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : Colors.light.surface }}
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="font-semibold" style={{ color: index === 0 ? Colors.gold[400] : textPrimary }}>
                {index === 0 ? 'Representante legal *' : `Miembro ${index + 1}`}
              </Text>
              {index !== 0 && (
                <Pressable onPress={() => removeTeamMember(index)}>
                  <Trash2 size={16} color="#FF6B6B" />
                </Pressable>
              )}
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
              className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-2"
              style={inputDynamic}
            />

            {/* Contact type selector */}
            <View className="flex-row mb-2 gap-2">
              <Pressable
                onPress={() => updateTeamMember(index, 'contactType', 'whatsapp')}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl flex-1"
                style={{
                  backgroundColor: member.contactType === 'whatsapp'
                    ? 'rgba(37,211,102,0.15)'
                    : isDark ? 'rgba(255,255,255,0.05)' : Colors.light.surface,
                  borderWidth: 1,
                  borderColor: member.contactType === 'whatsapp'
                    ? '#25D366'
                    : 'transparent',
                }}
              >
                <MessageCircle size={14} color={member.contactType === 'whatsapp' ? '#25D366' : textMuted} />
                <Text className="text-xs font-semibold" style={{ color: member.contactType === 'whatsapp' ? '#25D366' : textMuted }}>
                  WhatsApp
                </Text>
              </Pressable>
              <Pressable
                onPress={() => updateTeamMember(index, 'contactType', 'email')}
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl flex-1"
                style={{
                  backgroundColor: member.contactType === 'email'
                    ? 'rgba(96,165,250,0.15)'
                    : isDark ? 'rgba(255,255,255,0.05)' : Colors.light.surface,
                  borderWidth: 1,
                  borderColor: member.contactType === 'email'
                    ? '#60A5FA'
                    : 'transparent',
                }}
              >
                <Mail size={14} color={member.contactType === 'email' ? '#60A5FA' : textMuted} />
                <Text className="text-xs font-semibold" style={{ color: member.contactType === 'email' ? '#60A5FA' : textMuted }}>
                  Correo
                </Text>
              </Pressable>
            </View>

            {member.contactType === 'whatsapp' ? (
              <TextInput
                placeholder="+591 12345678"
                placeholderTextColor={textMuted}
                value={member.contact ?? ''}
                onChangeText={(value) => updateTeamMember(index, 'contact', value)}
                className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
                style={inputDynamic}
                keyboardType="phone-pad"
              />
            ) : (
              <TextInput
                placeholder="correo@ejemplo.com"
                placeholderTextColor={textMuted}
                value={member.contact ?? ''}
                onChangeText={(value) => updateTeamMember(index, 'contact', value)}
                className="rounded-xl border px-[14px] py-[14px] text-[15px] mb-3"
                style={inputDynamic}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
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
            {isEditing ? 'Guardar cambios' : 'Crear empresa'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CompanyForm;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, User, Image as ImageIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useUpdateUser } from '@/hooks/user/useUpdateUser';
import BaseInput from '@/components/shared/BaseInput';

export default function EditProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();
  const { user, loading: loadingUser } = useCurrentUser(authUser?.id ?? null);
  const { update, loading: updating } = useUpdateUser();

  const [name, setName]     = useState('');
  const [avatar, setAvatar] = useState('');

  // Pre-cargar valores actuales cuando llega el usuario
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAvatar(user.avatar ?? '');
    }
  }, [user]);

  const bg          = isDark ? Colors.blue.primary : Colors.light.bg;
  const cardBg      = isDark ? 'rgba(0,0,0,0.25)' : Colors.light.card;
  const cardBorder  = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted   = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const iconColor   = isDark ? Colors.gold[400] : Colors.light.accent;

  const canSave = name.trim().length > 0 && !updating && !loadingUser;

  const handleSave = async () => {
    if (!user?.id || !canSave) return;
    try {
      await update(user.id, {
        name: name.trim(),
        ...(avatar.trim() ? { avatar: avatar.trim() } : {}),
      });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar los cambios. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: bg }} edges={['top']}>

      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 20,
          paddingBottom: 12,
        }}
      >
        {/* Izquierda: back + título */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Pressable
            onPress={() => router.back()}
            accessible
            accessibilityLabel="Volver"
            accessibilityRole="button"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.surface,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowLeft size={18} color={iconColor} />
          </Pressable>
          <Text style={{ fontSize: 22, fontWeight: '700', color: textPrimary }}>
            Editar perfil
          </Text>
        </View>

        {/* Derecha: botón Guardar */}
        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          accessible
          accessibilityLabel="Guardar cambios"
          accessibilityRole="button"
          style={{
            paddingHorizontal: 18,
            paddingVertical: 9,
            borderRadius: 12,
            backgroundColor: canSave
              ? isDark ? Colors.gold[400] : Colors.light.accent
              : isDark ? 'rgba(255,255,255,0.08)' : Colors.light.surface,
            opacity: canSave ? 1 : 0.45,
          }}
        >
          {updating ? (
            <ActivityIndicator size="small" color={isDark ? '#000' : '#fff'} />
          ) : (
            <Text
              style={{
                fontSize: 14,
                fontWeight: '700',
                color: canSave
                  ? isDark ? '#000' : '#fff'
                  : textMuted,
              }}
            >
              Guardar
            </Text>
          )}
        </Pressable>
      </View>

      {/* Contenido */}
      {loadingUser ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: cardBorder,
              padding: 20,
              marginTop: 8,
              gap: 20,
            }}
          >
            {/* Campo: Nombre */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: textMuted,
                  letterSpacing: 0.5,
                }}
              >
                NOMBRE
              </Text>
              <BaseInput
                value={name}
                onChangeText={setName}
                placeholder="Tu nombre"
                autoCapitalize="words"
                returnKeyType="next"
                leftIcon={<User size={18} color={Colors.text.muted} />}
              />
            </View>

            {/* Campo: Avatar */}
            <View style={{ gap: 8 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '600',
                  color: textMuted,
                  letterSpacing: 0.5,
                }}
              >
                AVATAR (URL de imagen)
              </Text>
              <BaseInput
                value={avatar}
                onChangeText={setAvatar}
                placeholder="https://..."
                autoCapitalize="none"
                keyboardType="url"
                returnKeyType="done"
                onSubmitEditing={handleSave}
                leftIcon={<ImageIcon size={18} color={Colors.text.muted} />}
              />
              <Text
                style={{ fontSize: 12, color: textMuted }}
              >
                Dejá vacío para conservar el avatar actual.
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}

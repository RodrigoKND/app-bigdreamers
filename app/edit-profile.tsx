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
import { ArrowLeft, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useUpdateUser } from '@/hooks/user/useUpdateUser';
import BaseInput from '@/components/shared/BaseInput';
import ImagePickerField from '@/components/shared/ImagePickerField';
import { invalidateCache, invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import { uploadAvatarImage } from '@/services/supabase/storageService';

export default function EditProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user: authUser, refreshUser } = useAuth();
  const { user, loading: loadingUser } = useCurrentUser(authUser?.id ?? null);
  const { update, loading: updating } = useUpdateUser();
  const [uploading, setUploading] = useState(false);

  const [name, setName]     = useState('');
  const [avatar, setAvatar] = useState('');

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

  const canSave = name.trim().length > 0 && !updating && !uploading && !loadingUser;

  const handlePickAvatar = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar tu foto de perfil. Puedes habilitarlo en Ajustes > Privacidad.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !canSave) return;
    try {
      let avatarUrl = avatar.trim();
      // Si es una imagen local recién elegida (file://...), la subimos a Storage
      // y guardamos la URL pública. Si ya es http(s), se deja tal cual.
      if (avatarUrl && !avatarUrl.startsWith('http')) {
        setUploading(true);
        try {
          avatarUrl = await uploadAvatarImage(avatarUrl);
        } finally {
          setUploading(false);
        }
      }

      await update(user.id, {
        name: name.trim(),
        avatar: avatarUrl,
      });
      await invalidateCache(CacheKeys.currentUser(user.id));
      // Invalidamos los rankings de comunidad (semanal/mensual/global) para que
      // no sigan mostrando el avatar anterior desde el caché.
      await invalidateCachePattern('ranking_');
      await invalidateCachePattern('community_ranking_');
      // Refrescamos el authUser para que el tab y el resto se actualicen al instante.
      await refreshUser();
      router.back();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'No se pudo guardar los cambios. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: bg }} edges={['top']}>

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-5 pb-3">
        <View className="flex-row items-center gap-3">
          <Pressable
            onPress={() => router.back()}
            accessible
            accessibilityLabel="Volver"
            accessibilityRole="button"
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.surface }}
          >
            <ArrowLeft size={18} color={iconColor} />
          </Pressable>
          <Text className="text-[22px] font-bold" style={{ color: textPrimary }}>
            Editar perfil
          </Text>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          accessible
          accessibilityLabel="Guardar cambios"
          accessibilityRole="button"
          className="px-[18px] py-[9px] rounded-xl"
          style={{
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
              className="text-sm font-bold"
              style={{ color: canSave ? (isDark ? '#000' : '#fff') : textMuted }}
            >
              Guardar
            </Text>
          )}
        </Pressable>
      </View>

      {/* Contenido */}
      {loadingUser ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        >
          <View
            className="rounded-[20px] border p-5 mt-2 gap-5"
            style={{ backgroundColor: cardBg, borderColor: cardBorder }}
          >
            {/* Campo: Nombre */}
            <View className="gap-2">
              <Text
                className="text-[11px] font-semibold uppercase"
                style={{ color: textMuted, letterSpacing: 0.5 }}
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
            <View className="gap-2">
              <ImagePickerField
                isDark={isDark}
                imageUri={avatar || null}
                onPick={handlePickAvatar}
                onRemove={() => setAvatar('')}
                variant="cover"
                label="Foto de perfil"
              />
            </View>
          </View>
        </ScrollView>
      )}

    </SafeAreaView>
  );
}
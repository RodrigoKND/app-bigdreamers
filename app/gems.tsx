import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import GemsHeader from '@/components/gems/GemsHeader';
import GemPackageCard from '@/components/gems/GemPackageCard';
import PaymentInstructions from '@/components/gems/PaymentInstructions';
import ConfirmRequestModal from '@/components/gems/ConfirmRequestModal';
import RequestSentBanner from '@/components/gems/RequestSentBanner';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useGemPackages } from '@/hooks/gem/useGemPackages';
import { useCreateGemRequest } from '@/hooks/gem/useCreateGemRequest';
import { uploadReceiptImage } from '@/services/supabase/storageService';
import { Package, ArrowRight, CreditCard } from 'lucide-react-native';

const GemsScreen = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const { packages, loading: packagesLoading } = useGemPackages();
  const { create: createGemRequest, loading: creatingRequest } = useCreateGemRequest();
  
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const insets = useSafeAreaInsets();

  const selectedPackage = packages.find((item) => item.id === selectedPackageId) ?? null;
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para subir el comprobante de pago. Puedes habilitarlo en Ajustes > Privacidad.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleRequestPress = () => {
    if (selectedPackageId && imageUri) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = async () => {
    setShowConfirmModal(false);
    if (!user?.id || !selectedPackageId || !selectedPackage) return;

    try {
      let receiptImageUrl = '';
      if (imageUri) {
        try {
          receiptImageUrl = await uploadReceiptImage(imageUri);
        } catch {
          Alert.alert('Error', 'No se pudo subir el comprobante. Intenta de nuevo.');
          return;
        }
      }

      await createGemRequest({
        userId: user.id,
        packageId: selectedPackageId,
        gems: selectedPackage.gems,
        bsPrice: selectedPackage.bsPrice,
        receiptImageUrl,
      });
      setRequestSent(true);
    } catch (error: any) {
      const msg = error?.message || 'Ocurrió un error inesperado';
      Alert.alert('Error al enviar', `No se pudo crear la solicitud:\n\n${msg}`);
    }
  };

  const handleBack = () => {
    setRequestSent(false);
    setSelectedPackageId(null);
    setImageUri(null);
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}>
      <GemsHeader currentGems={user?.gems ?? 0} />

      {requestSent ? (
        <RequestSentBanner gems={selectedPackage?.gems ?? 0} isDark={isDark} onBack={handleBack} />
      ) : (
        <View className="flex-1">
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160 }}>
            {/* Section title */}
            <Animated.View entering={FadeInDown.delay(200).duration(500)} className="flex-row items-center gap-2 mb-4">
              <CreditCard size={16} color={accentColor} />
              <Text className="text-[15px] font-bold" style={{ color: textPrimary }}>
                Elige tu paquete
              </Text>
            </Animated.View>

            {/* Packages grid */}
            {packagesLoading ? (
              <View className="py-10 items-center">
                <Text style={{ color: textMuted }}>Cargando paquetes...</Text>
              </View>
            ) : packages.length === 0 ? (
              <View className="py-10 items-center">
                <Package size={48} color={textMuted} />
                <Text className="text-base text-center mt-4" style={{ color: textMuted }}>
                  No hay paquetes disponibles
                </Text>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {packages.map((gemPackage, i) => (
                  <Animated.View
                    key={gemPackage.id}
                    entering={FadeInDown.delay(250 + i * 100).duration(500)}
                    style={{ width: '48%' }}
                  >
                    <GemPackageCard
                      package={gemPackage}
                      selected={selectedPackageId === gemPackage.id}
                      onSelect={() => setSelectedPackageId(gemPackage.id)}
                      isDark={isDark}
                    />
                  </Animated.View>
                ))}
              </View>
            )}

            <View className="h-6" />
            <PaymentInstructions isDark={isDark} imageUri={imageUri} onPickImage={handlePickImage} />
          </ScrollView>

          {/* Bottom CTA */}
          <View className="absolute left-5 right-5" style={{ bottom: insets.bottom + 20 }}>
            <Pressable
              onPress={handleRequestPress}
              disabled={!selectedPackageId || !imageUri || creatingRequest}
              className="rounded-2xl py-4 items-center active:opacity-70"
              style={{
                opacity: selectedPackageId && imageUri && !creatingRequest ? 1 : 0.4,
              }}
            >
              <LinearGradient
                colors={['#F9A825', '#FFD740', '#F9A825']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full rounded-2xl py-4 items-center flex-row justify-center gap-2"
              >
                <Text className="font-extrabold text-[15px]" style={{ color: '#1a1a2e' }}>
                  {creatingRequest ? 'Enviando...' : 'Solicitar gemas'}
                </Text>
                {!creatingRequest && <ArrowRight size={16} color="#1a1a2e" />}
              </LinearGradient>
            </Pressable>
          </View>
        </View>
      )}

      <ConfirmRequestModal
        visible={showConfirmModal}
        selectedPackage={selectedPackage}
        onConfirm={handleConfirm}
        onCancel={() => setShowConfirmModal(false)}
        isDark={isDark}
      />
    </SafeAreaView>
  );
};

export default GemsScreen;

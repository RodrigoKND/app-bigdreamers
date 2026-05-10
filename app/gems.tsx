import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/context/ThemeContext';
import { Colors } from '@/constants/colors';
import GemsHeader from '@/components/gems/GemsHeader';
import GemPackageCard from '@/components/gems/GemPackageCard';
import PaymentInstructions from '@/components/gems/PaymentInstructions';
import ConfirmRequestModal from '@/components/gems/ConfirmRequestModal';
import RequestSentBanner from '@/components/gems/RequestSentBanner';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useGemPackages } from '@/hooks/gem/useGemPackages';
import { useCreateGemRequest } from '@/hooks/gem/useCreateGemRequest';
import { Package } from 'lucide-react-native';

//.

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
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const secondaryText = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textPrimary;

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
      await createGemRequest({
        userId: user.id,
        packageId: selectedPackageId,
        gems: selectedPackage.gems,
        bsPrice: selectedPackage.bsPrice,
      });
      setRequestSent(true);
    } catch (error) {
      console.error('Error creating gem request:', error);
    }
  };

  const handleBack = () => {
    setRequestSent(false);
    setSelectedPackageId(null);
    setImageUri(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}>
      <GemsHeader currentGems={user?.gems ?? 0} />

      {requestSent ? (
        <RequestSentBanner gems={selectedPackage?.gems ?? 0} isDark={isDark} onBack={handleBack} />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: textMuted, letterSpacing: 0.5, marginBottom: 16 }}>
              Elige tu paquete
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {packagesLoading ? (
                <Text style={{ color: textMuted }}>Cargando paquetes...</Text>
              ) : packages.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                  <Package size={48} color={textMuted} style={{ marginBottom: 16 }} />
                  <Text style={{ color: textMuted, fontSize: 16, textAlign: 'center' }}>
                    No hay paquetes disponibles en este momento
                  </Text>
                </View>
              ) : (
                packages.map((gemPackage) => (
                  <GemPackageCard
                    key={gemPackage.id}
                    package={gemPackage}
                    selected={selectedPackageId === gemPackage.id}
                    onSelect={() => setSelectedPackageId(gemPackage.id)}
                    isDark={isDark}
                  />
                ))
              )}
            </View>
            <View style={{ height: 24 }} />
            <PaymentInstructions isDark={isDark} imageUri={imageUri} onPickImage={handlePickImage} />
          </ScrollView>

          <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 20 }}>
            <Pressable
              onPress={handleRequestPress}
              disabled={!selectedPackageId || !imageUri || creatingRequest}
              style={{
                backgroundColor: selectedPackageId && imageUri && !creatingRequest ? Colors.gold[400] : Colors.navy?.[700] ?? '#1E3A5F',
                opacity: selectedPackageId && imageUri && !creatingRequest ? 1 : 0.4,
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 15  }}>
                {creatingRequest ? 'Enviando...' : 'Solicitar gemas'}
              </Text>
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

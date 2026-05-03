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
import { GEM_PACKAGES } from '@/constants/gemPackages';

const GemsScreen = () => {
  const { isDark } = useTheme();
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [hasImage, setHasImage] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  const selectedPackage = GEM_PACKAGES.find((item) => item.id === selectedPackageId) ?? null;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;
  const secondaryText = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textPrimary;

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (!result.canceled) {
      setHasImage(true);
    }
  };

  const handleRequestPress = () => {
    if (selectedPackageId && hasImage) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = () => {
    setShowConfirmModal(false);
    setRequestSent(true);
  };

  const handleBack = () => {
    setRequestSent(false);
    setSelectedPackageId(null);
    setHasImage(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }}>
      <GemsHeader currentGems={1240} />

      {requestSent ? (
        <RequestSentBanner gems={selectedPackage?.gems ?? 0} isDark={isDark} onBack={handleBack} />
      ) : (
        <View style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 160 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: textMuted, letterSpacing: 0.5, marginBottom: 16 }}>
              Elige tu paquete
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {GEM_PACKAGES.map((gemPackage) => (
                <GemPackageCard
                  key={gemPackage.id}
                  package={gemPackage}
                  selected={selectedPackageId === gemPackage.id}
                  onSelect={() => setSelectedPackageId(gemPackage.id)}
                  isDark={isDark}
                />
              ))}
            </View>
            <View style={{ height: 24 }} />
            <PaymentInstructions isDark={isDark} hasImage={hasImage} onPickImage={handlePickImage} />
          </ScrollView>

          <View style={{ position: 'absolute', left: 20, right: 20, bottom: 30 }}>
            <Pressable
              onPress={handleRequestPress}
              style={{
                backgroundColor: selectedPackageId && hasImage ? Colors.gold[400] : Colors.navy?.[700] ?? '#1E3A5F',
                borderRadius: 16,
                paddingVertical: 16,
                alignItems: 'center',
                opacity: selectedPackageId && hasImage ? 1 : 0.4,
              }}
            >
              <Text style={{ color: '#000', fontWeight: '800', fontSize: 16 }}>Solicitar gemas</Text>
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

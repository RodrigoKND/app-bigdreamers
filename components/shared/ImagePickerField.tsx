import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { ImagePlus, Upload, CheckCircle, X } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

type ImagePickerVariant = 'receipt' | 'cover';

interface ImagePickerFieldProps {
  isDark: boolean;
  imageUri: string | null;
  onPick: () => void;
  onRemove?: () => void;
  variant?: ImagePickerVariant;
  label?: string;
}

const ImagePickerField = ({
  isDark,
  imageUri,
  onPick,
  onRemove,
  variant = 'cover',
  label,
}: ImagePickerFieldProps) => {
  const textPrimary = isDark ? Colors.text.primary : Colors.light.textPrimary;
  const textMuted = isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted;

  const isReceipt = variant === 'receipt';

  if (isReceipt) {
    const cardStyle = {
      backgroundColor: isDark ? 'rgba(0,0,0,0.25)' : Colors.light.surface,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0',
      borderWidth: 1,
      borderRadius: 16,
      padding: 16,
    };

    return (
      <Pressable onPress={onPick} style={cardStyle}>
        {imageUri ? (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={{ uri: imageUri }}
              style={{ width: '100%', height: 220, borderRadius: 12, resizeMode: 'cover' }}
            />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
              <CheckCircle size={18} color="#4ADE80" />
              <Text style={{ color: '#4ADE80', fontWeight: '700', marginLeft: 8 }}>
                Comprobante cargado
              </Text>
            </View>
            <Text style={{ color: textMuted, fontSize: 12, marginTop: 4 }}>Toca para cambiar</Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 24 }}>
            <Upload size={28} color={Colors.gold[400]} />
            <View style={{ marginTop: 12, alignItems: 'center' }}>
              <Text style={{ color: textMuted, marginBottom: 4 }}>Toca para subir comprobante</Text>
              <Text style={{ color: textMuted, fontSize: 12 }}>JPG, PNG · Máx 5MB</Text>
            </View>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View className="mb-3">
      {label && (
        <Text
          className="text-[13px] font-bold uppercase opacity-90 mb-[10px]"
          style={{ color: textPrimary, letterSpacing: 0.4 }}
        >
          {label}
        </Text>
      )}

      {imageUri ? (
        <View
          className="relative rounded-xl overflow-hidden border mb-3"
          style={{
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
            shadowColor: '#000',
            shadowOpacity: isDark ? 0.2 : 0.08,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 3 },
            elevation: 2,
          }}
        >
          <Image
            source={{ uri: imageUri }}
            className="w-full h-[180px]"
            style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}
            resizeMode="cover"
          />
          {onRemove && (
            <Pressable
              onPress={onRemove}
              className="absolute top-[10px] right-[10px] w-8 h-8 rounded-full items-center justify-center"
              style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
            >
              <X size={16} color="#fff" />
            </Pressable>
          )}
          <Pressable
            onPress={onPick}
            className="absolute bottom-[10px] right-[10px] flex-row items-center px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: Colors.gold[400] }}
          >
            <ImagePlus size={14} color="#000" />
            <Text className="ml-1.5 text-xs font-bold" style={{ color: '#000', letterSpacing: 0.3 }}>
              Cambiar
            </Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={onPick}
          className="rounded-xl border-2 border-dashed py-7 px-4 items-center justify-center"
          style={{
            backgroundColor: isDark ? 'rgba(0,0,0,0.3)' : '#F1F5F9',
            borderColor: isDark ? 'rgba(255,255,255,0.12)' : '#E2E8F0',
          }}
        >
          <View
            className="w-12 h-12 rounded-full items-center justify-center mb-[10px]"
            style={{ backgroundColor: 'rgba(212,175,55,0.15)' }}
          >
            <ImagePlus size={22} color={Colors.gold[400]} />
          </View>
          <Text className="font-bold text-sm mb-1" style={{ color: textPrimary }}>
            Subir imagen
          </Text>
          <Text className="text-xs text-center" style={{ color: textMuted }}>
            Toca para elegir una foto desde tu galería
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default ImagePickerField;
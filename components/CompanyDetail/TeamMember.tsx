import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Mail, Phone } from 'lucide-react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import Avatar from '@/components/shared/Avatar';

function isEmail(contact: string) {
  return contact.includes('@');
}

function openContact(contact: string, name: string) {
  if (!contact) return;

  if (isEmail(contact)) {
    const url = `mailto:${contact}?subject=Contacto BigDreamers&body=Hola ${name}, me contacto desde la app BigDreamers.`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir el cliente de correo.')
    );
  } else {
    // Limpiar el número: solo dígitos y el + inicial
    const cleaned = contact.replace(/\s|-/g, '');
    const url = `https://wa.me/${cleaned.startsWith('+') ? cleaned.slice(1) : cleaned}?text=Hola%20${encodeURIComponent(name)}%2C%20me%20contacto%20desde%20la%20app%20BigDreamers.`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir WhatsApp.')
    );
  }
}

export default function TeamMember({ name, role, contact }: { name: string; role: string; contact?: string }) {
  const { isDark } = useTheme();
  const hasContact = !!contact?.trim();
  const isEmailContact = hasContact && isEmail(contact!);

  const iconColor = isDark ? 'rgba(255,255,255,0.7)' : Colors.light.textMuted;
  const buttonBg  = isDark ? 'rgba(255,255,255,0.1)' : Colors.light.surface;

  return (
    <View
      className="flex-row items-center p-5 rounded-[28px] mb-4 border"
      style={{
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card,
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border,
      }}
    >
      <Avatar name={name} size={56} />

      <View className="ml-5 flex-1">
        <Text
          className="text-lg font-bold tracking-tight"
          style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
        >
          {name}
        </Text>
        <Text
          className="text-sm font-medium uppercase tracking-wider"
          style={{ color: isDark ? 'rgba(156,195,255,0.6)' : Colors.light.textSecond }}
        >
          {role}
        </Text>
      </View>

      {hasContact ? (
        <TouchableOpacity
          onPress={() => openContact(contact!, name)}
          activeOpacity={0.7}
          className="p-3 rounded-xl"
          style={{ backgroundColor: isEmailContact ? 'rgba(96,165,250,0.15)' : 'rgba(37,211,102,0.15)' }}
        >
          {isEmailContact
            ? <Mail size={20} color={isDark ? '#60A5FA' : '#1D4ED8'} />
            : <Phone size={20} color="#25D366" />
          }
        </TouchableOpacity>
      ) : (
        <View className="p-3 rounded-xl" style={{ backgroundColor: buttonBg }}>
          <Mail size={20} color={iconColor} />
        </View>
      )}
    </View>
  );
}

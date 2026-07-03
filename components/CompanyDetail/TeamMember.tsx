import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert } from 'react-native';
import { Mail, MessageCircle } from 'lucide-react-native';
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
    const cleaned = contact.replace(/[\s\-\(\)]/g, '');
    const number = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
    const url = `https://wa.me/${number}?text=Hola%20${encodeURIComponent(name)}%2C%20me%20contacto%20desde%20la%20app%20BigDreamers.`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'No se pudo abrir WhatsApp.')
    );
  }
}

export default function TeamMember({ name, role, contact }: { name: string; role: string; contact?: string }) {
  const { isDark } = useTheme();
  const hasContact = !!contact?.trim();
  const isEmailContact = hasContact && isEmail(contact!);

  const bgColor      = isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card;
  const borderColor  = isDark ? 'rgba(255,255,255,0.1)'  : Colors.light.border;
  const nameColor    = isDark ? '#FFFFFF' : Colors.light.textPrimary;
  const roleColor    = isDark ? 'rgba(156,195,255,0.6)' : Colors.light.textSecond;
  const tagBg        = isDark ? 'rgba(255,255,255,0.08)'  : Colors.light.surface;
  const tagColor     = isEmailContact
    ? (isDark ? '#60A5FA' : '#1D4ED8')
    : '#25D366';
  const tagText      = isEmailContact ? 'Correo' : 'WhatsApp';

  return (
    <TouchableOpacity
      activeOpacity={hasContact ? 0.7 : 1}
      onPress={hasContact ? () => openContact(contact!, name) : undefined}
      className="flex-row items-center p-4 rounded-2xl mb-3 border"
      style={{ backgroundColor: bgColor, borderColor: borderColor }}
    >
      <Avatar name={name} size={48} />

      <View className="ml-4 flex-1">
        <Text className="text-base font-bold" style={{ color: nameColor }}>
          {name}
        </Text>
        <Text className="text-xs font-medium uppercase tracking-wider mt-0.5" style={{ color: roleColor }}>
          {role}
        </Text>
      </View>

      {hasContact && (
        <View
          className="flex-row items-center px-3 py-1.5 rounded-full"
          style={{ backgroundColor: tagBg }}
        >
          {isEmailContact
            ? <Mail size={14} color={tagColor} />
            : <MessageCircle size={14} color={tagColor} />
          }
          <Text className="text-xs font-semibold ml-1.5" style={{ color: tagColor }}>
            {tagText}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

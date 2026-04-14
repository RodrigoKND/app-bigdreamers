import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { getLevelConfig } from '@/constants/levels';
import LevelBadge from '@/components/shared/LevelBadge';
import GemBadge from '@/components/shared/GemBadge';

interface ProfileHeaderProps {
  user: User;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  const config = getLevelConfig(user.level);
  const joinDate = new Date(user.joinedAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <LinearGradient
      colors={[Colors.navy[700], Colors.blue.card]}
      style={styles.container}
    >
      <View style={styles.avatarWrapper}>
        {user.avatar ? (
          <Image source={{ uri: user.avatar }} style={[styles.avatar, { borderColor: config.color }]} />
        ) : (
          <View style={[styles.avatarPlaceholder, { borderColor: config.color }]}>
            <Text style={styles.initials}>
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>
      <View style={styles.badges}>
        <LevelBadge level={user.level} size="md" />
        <GemBadge count={user.gems} size="md" showLabel />
      </View>
      <View style={styles.joined}>
        <Calendar size={13} color={Colors.text.muted} />
        <Text style={styles.joinedText}>Miembro desde {joinDate}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 30,
    paddingBottom: 24,
    paddingHorizontal: 16,
    gap: 10,
  },
  avatarWrapper: { marginBottom: 4 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3 },
  avatarPlaceholder: {
    width: 90, height: 90, borderRadius: 45, borderWidth: 3,
    backgroundColor: Colors.navy[600],
    alignItems: 'center', justifyContent: 'center',
  },
  initials: { color: Colors.white, fontFamily: 'Inter-Bold', fontSize: 28 },
  name: { color: Colors.white, fontFamily: 'Inter-Bold', fontSize: 22 },
  email: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 13 },
  badges: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  joined: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  joinedText: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 12 },
});

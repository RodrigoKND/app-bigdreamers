import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import LevelBadge from '@/components/shared/LevelBadge';

interface WelcomeBannerProps {
  user: User;
}

export default function WelcomeBanner({ user }: WelcomeBannerProps) {
  const firstName = user.name.split(' ')[0];

  return (
    <LinearGradient
      colors={[Colors.navy[600], Colors.blue.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.left}>
        <Text style={styles.greeting}>Hola, {firstName}</Text>
        <Text style={styles.subtitle}>Sigue creciendo con BigDreamers</Text>
        <View style={styles.row}>
          <LevelBadge level={user.level} size="md" />
          <View style={styles.streakBadge}>
            <Flame size={14} color={Colors.gold[400]} />
            <Text style={styles.streakText}>{user.streak} días</Text>
          </View>
        </View>
      </View>
      {user.avatar && (
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
  },
  left: { flex: 1 },
  greeting: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.text.secondary,
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    marginBottom: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245,194,0,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(245,194,0,0.3)',
  },
  streakText: {
    color: Colors.gold[400],
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: Colors.gold[500],
    marginLeft: 16,
  },
});

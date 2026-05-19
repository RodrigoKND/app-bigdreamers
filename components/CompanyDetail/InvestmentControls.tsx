import React from 'react';
import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import Button from '@/components/shared/Button';

export default function InvestmentControls({ currentGems }: { currentGems: number }) {
    const { isDark } = useTheme();

    return (
        <View className="mb-8">
            <View className="flex-row items-center justify-between p-4 rounded-3xl border" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.card, borderColor: isDark ? Colors.gold[400] : Colors.light.borderAccent }}>
                <View>
                    <Text className="text-xs text-gold-500 uppercase font-bold">Tus Gemas</Text>
                    <Text className="text-lg font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>{currentGems} G</Text>
                </View>
                
                <Button
                    title="Invertir"
                    variant='secondary'                    
                    size='md'
                    className="px-8 rounded-full py-3"
                    onPress={() => { }}
                />
            </View>
        </View>
    );
}
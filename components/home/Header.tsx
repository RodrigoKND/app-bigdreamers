import React from 'react';
import { View, Text, Image } from "react-native";
import { Gem } from "lucide-react-native";
import { Colors } from "@/constants/colors";
import { useTheme } from "@/context/ThemeContext";
import { IMAGES } from "@/constants/images";

export default function Header({ points }: { points: number }) {
    const { isDark } = useTheme();

    return (
        <View className="flex-row justify-between items-center px-5 py-3">
            <View className="flex-row items-center gap-2.5">
                <View
                    className="w-9 h-9 rounded-xl items-center justify-center"
                    style={{ backgroundColor: isDark ? Colors.navy[700] : Colors.light.surface }}
                >
                    <Image source={IMAGES.LOGO_BIGDREAMERS} style={{ width: 22, height: 22 }} resizeMode="contain" />
                </View>
                <Text
                    className="text-[15px] font-bold tracking-wide"
                    style={{ color: isDark ? Colors.text.primary : Colors.light.textPrimary }}
                >
                    BigDreamers
                </Text>
            </View>

            <View
                className="flex-row items-center gap-1.5 px-3 py-2 rounded-xl"
                style={{ backgroundColor: isDark ? 'rgba(255,215,64,0.14)' : Colors.light.goldLight }}
            >
                <Gem size={14} color={isDark ? Colors.gold[400] : Colors.light.gold} />
                <Text
                    className="font-bold text-sm"
                    style={{ color: isDark ? Colors.gold[400] : Colors.light.goldDark }}
                >
                    {points.toLocaleString()}
                </Text>
            </View>
        </View>
    );
}

import { View, Text, Image, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import ButtonSocialMedia from '@/components/shared/ButtonSocialMedia';

export default function DetailHeader({ name, description, gems, imageUrl }: { name: string; description: string; gems: number; imageUrl: string }) {
    return (
        <View className="mb-8 overflow-hidden rounded-[40px] border border-white/20  shadow-2xl">
            <LinearGradient
                colors={['rgba(255,255,255,0.15)', 'rgba(255,255,255,0.05)']}
                className="p-8"
            >
                <View className="flex-row justify-between items-start">
                    <View className="flex-1 pr-6">
                        <View className="bg-yellow-400 self-start px-3 py-1 rounded-full mb-3">
                            <Text className="text-[10px] font-black uppercase tracking-widest text-blue-900 text-center">Empresa Verificada</Text>
                        </View>
                        <Text className="text-4xl font-black text-white leading-tight">{name}</Text>
                        <Text className="text-blue-100/70 text-base mt-2 font-medium" numberOfLines={8}>
                            {description}
                        </Text>
                    </View>

                    <View className="relative">
                        <View className="absolute w-32 h-32 bg-blue-400/30 blur-3xl rounded-full -top-4 -left-4" />
                        <View className="bg-white/90 rounded-[30px] p-4 shadow-lg rotate-3">
                            <Image source={{ uri: imageUrl }} className="w-24 h-24" resizeMode="contain" />
                        </View>
                    </View>
                </View>

                <View className="flex-row items-center mt-4 gap-3">
                    <ButtonSocialMedia icon={<FontAwesome name="instagram" size={24} color="yellow" />} url="https://instagram.com/bytetwoo" />
                    <ButtonSocialMedia icon={<FontAwesome name="facebook-f" size={24} color="yellow" />} url="https://facebook.com/bytetwo" />
                </View>

                <View className="mt-8 flex-row items-baseline">
                    <Text className="text-2xl font-black text-yellow-400 tracking-tighter">G {gems.toLocaleString()}</Text>
                </View>
            </LinearGradient>
        </View>
    );
}
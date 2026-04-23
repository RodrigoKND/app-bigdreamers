import { View, Text, Image } from 'react-native';
import { IMAGES } from '@/constants/images';
import { User } from '@/types';

export default function UserProfileCard({ user }: { user: User }) {
    return (
        <View className={`mx-4 p-5 rounded-3xl relative overflow-hidden dark:bg-blue-user bg-gray-100 shadow-md`}>
            <View className="flex-row justify-between items-center">
                <View>
                    <Text className="opacity-80 dark:text-white text-black">Buenos días,</Text>
                    <Text className="text-2xl font-bold mb-2 dark:text-white text-black">{user.name} 👋</Text>

                    <View className="bg-gold-500 self-start px-3 py-1 rounded-full mb-3">
                        <Text className="text-xs font-bold dark:text-white text-black">⭐ Nivel {user.level}</Text>
                    </View>

                    <View className="flex-row items-center">
                        <Text className="text-sm font-medium dark:text-white text-black">⚡ {user.streak} días de racha</Text>
                    </View>
                </View>

                {/* Avatar Circular */}
                <View className="w-20 h-20 rounded-full border-2 border-white/20 items-center justify-center bg-gray-100">
                    <Image source={IMAGES.BUHO} className="w-20 h-20" resizeMode="contain" />
                </View>
            </View>

            <View className="mt-4">
                <Text className="text-xs mb-1 text-levels-gold">Progreso al nivel Oro {15}%</Text>
                <View className="h-2 w-full bg-black/30 rounded-full overflow-hidden">
                    <View style={{ width: `${15}%` }} className="h-full bg-levels-gold" />
                </View>
            </View>
        </View>
    );
}
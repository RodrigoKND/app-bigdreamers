import { View, Text, Image } from "react-native";
import { Star } from "lucide-react-native";
import { IMAGES } from "@/constants/images";

export default function Header({ points }: { points: number }) {
    return (
        <View className="flex-row justify-between items-center px-4 py-4 w-full">
            <View className="w-14 h-14 rounded-md items-center justify-center bg-gray-100">
                <Image source={IMAGES.LOGO_BIGDREAMERS} className="w-10 h-10" resizeMode="cover" />
            </View>
            <View className="flex-row items-center gap-2 rounded-md px-3 py-1 border-2 border-gold-500 bg-gold-500/80 opacity-90">
                <Star className="w-4 h-4" color={"white"} />
                <Text className="font-bold text-base px-3 py-1 text-yellow-200">{points.toLocaleString()}</Text>
            </View>
        </View>
    );
}
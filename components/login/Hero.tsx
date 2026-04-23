import { View, Image } from "react-native";
import {IMAGES} from "@/constants/images";

export default function Hero() {
    return (
        <View className="relative justify-center items-center">
            <Image
                source={IMAGES.LOGO_BIGDREAMERS}
                className="absolute w-60 h-60 opacity-90"
                resizeMode="contain"
            />
            <Image
                source={IMAGES.BUHO}
                className="w-80 h-80"
                resizeMode="cover"
            />
        </View>
    );
}
import { View, Image } from "react-native";

const IMAGES = {
    BUHO: require("../../assets/images/morfeus.webp"),
    LOGO_BIGDREAMERS: require("../../assets/images/logo.png"),
}

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
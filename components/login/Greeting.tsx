import { View, Text } from "react-native";

export default function Greeting() {
  return (
    <View className="mt-6 mb-4 items-center gap-1">
        <Text className={"dark:text-white text-black text-[16px]"}>
            Bienvenido a BigDreamerss
        </Text>
        <Text className={"dark:text-white italic text-black text-[16px]"}>
            “Sueña alto, aprende jugando”
        </Text>
    </View>
  );
}
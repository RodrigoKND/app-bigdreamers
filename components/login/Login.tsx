import { View } from "react-native";
import ButtonLoginGoogle from "@/components/login/ButtonLoginGoogle";
import Greeting from "@/components/login/Greeting";
import Hero from "@/components/login/Hero";

export default function Login() {
  return (
    <View className="flex-1 flex-col justify-center items-center bg-blue-primary">
        <Hero />
        <Greeting />
        <ButtonLoginGoogle />
    </View>
  );
}

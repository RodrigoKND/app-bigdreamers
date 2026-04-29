import { Pressable, Text } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { getCurrentUser } from "@/services/userService";
import { useRouter } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign'

export default function ButtonLoginGoogle() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const user = await getCurrentUser();
      login(user);
      router.replace('/onboarding');
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Pressable
      className="bg-white border border-gray-300 rounded-full px-8 py-2 mt-4 flex flex-row items-center gap-2"
      onPress={handleLogin}
    >
      <AntDesign name="google" size={30} color="blue" />
      <Text className={"text-black font-semibold text-[16px]"}>
        Login with Google
      </Text>
    </Pressable>
  );
}
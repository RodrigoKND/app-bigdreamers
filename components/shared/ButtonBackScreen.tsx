import AntDesign from '@expo/vector-icons/AntDesign';
import { Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ButtonBackScreen({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { isDark: dark } = useTheme();

  const redirectToScreen = () => {
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.back();
    }
  };

  return (
    <Pressable className='p-2 px-6' onPress={redirectToScreen}>
      <AntDesign name="arrow-left" size={24} color={dark ? 'white' : 'black'} />
    </Pressable>
  );
}
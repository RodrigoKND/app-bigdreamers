import { TextInput, View, Text } from 'react-native';

export default function SearchBar() {
  return (
    <View className="flex-row bg-gray-100 rounded-md px-4 py-2 items-center mb-6">
      <TextInput
        placeholder="Buscar empresas..."
        className="flex-1 text-gray-600"
      />
      <Text className="ml-2 text-gray-400">| ⌥</Text>
    </View>
  );
}

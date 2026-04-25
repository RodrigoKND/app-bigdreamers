import { View, Text } from 'react-native';
import Button from '@/components/shared/Button';

export default function InvestmentControls({ currentGems }: { currentGems: number }) {
    return (
        <View className="mb-8">
            <Text className="text-xl font-bold mb-2">Sobre la empresa</Text>
            <Text className="text-gray-500 leading-5 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.
            </Text>

            <View className="flex-row items-center justify-between bg-gray-50 p-4 rounded-3xl border border-gray-100">
                <View>
                    <Text className="text-xs text-gray-400 uppercase font-bold">Inversión estimada</Text>
                    <Text className="text-lg font-bold text-indigo-600">{currentGems} Gemas</Text>
                </View>

                <Button
                    title="Invertir"
                    variant='primary'
                    size='md'
                    className="px-8 rounded-full py-3"
                    onPress={() => { }}
                />
            </View>
        </View>
    );
}
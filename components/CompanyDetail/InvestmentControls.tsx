import { View, Text } from 'react-native';
import Button from '@/components/shared/Button';

export default function InvestmentControls({ currentGems }: { currentGems: number }) {
    return (
        <View className="mb-8">
            <Text className="text-xl font-bold mb-2 dark:text-white text-black">Sobre la empresa</Text>
            <Text className="dark:text-gray-100 text-gray-600 leading-5 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat.
            </Text>

            <View className="flex-row items-center justify-between bg-white/5 p-4 rounded-3xl border dark:border-gold-500 border-blue-primary">
                <View>
                    <Text className="text-xs text-gold-500 uppercase font-bold">Tus Gemas</Text>
                    <Text className="text-lg font-bold dark:text-white text-black">{currentGems} G</Text>
                </View>
                
                {/* TODO: Implementar el método para invertir y deshabilitar el button
                si las currentGems es menor a las gemas actuales de la empresa */}
                <Button
                    title="Invertir"
                    variant='secondary'                    
                    size='md'
                    className="px-8 rounded-full py-3"
                    onPress={() => { }}
                />
            </View>
        </View>
    );
}
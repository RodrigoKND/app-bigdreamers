import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OfferItem from '@/components/invest/OfferItem';
import SearchBar from '@/components/shared/SearchBar';
import LevelGold from '@/components/invest/levelGold/LevelGold';
import LevelSilver from '@/components/invest/levelSilver/LevelSilver';
import LevelBronce from '@/components/invest/levelBronce/LevelBronce';

export default function Invest() {
  return (
    <SafeAreaView className="flex-1 bg-blue-primary" edges={['top']}>

      <View className="p-6">
        <Text className="dark:text-white text-black text-3xl font-bold">
          Empresas disponibles
        </Text>
        <Text className="text-indigo-200 mt-1">
          Invierte en empresas reales verificadas
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View className="px-6 mt-6">
          
          <SearchBar />
          <LevelGold />
          <LevelSilver />
          <LevelBronce />

          <View className="mt-8 mb-4 flex-row justify-between items-center">
            <Text className="text-lg font-bold dark:text-white text-black">Ofertas</Text>
            <Text className="dark:text-gray-300 text-black text-xs">Ver todas</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <OfferItem name="Empresa X" gems={4000} imageUrl="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/6XQ2V2HNRRMDHDJ55MPMNBJ4E4.jpg" />
            <OfferItem name="Empresa Y" gems={1200} imageUrl="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/6XQ2V2HNRRMDHDJ55MPMNBJ4E4.jpg" />
            <OfferItem name="Empresa Z" gems={850} imageUrl="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/6XQ2V2HNRRMDHDJ55MPMNBJ4E4.jpg" />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
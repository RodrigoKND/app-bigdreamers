import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CompanyCard from '@/components/invest/CompanyCard';
import OfferItem from '@/components/invest/OfferItem';
import SearchBar from '@/components/shared/SearchBar';

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
        contentContainerStyle={{ paddingBottom: 40 }} // Espacio extra al final para que no quede pegado
      >
        <View className="px-6 mt-6">
          <SearchBar />

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold dark:text-white text-black">Destacadas</Text>
            <Text className="dark:text-gray-300 text-black">Ver todas</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <CompanyCard 
              name="Tech Innovate" 
              gems={4500} 
              imageUrl="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/6XQ2V2HNRRMDHDJ55MPMNBJ4E4.jpg" 
            />
            <CompanyCard 
              name="Green Earth" 
              gems={2800} 
              imageUrl="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/6XQ2V2HNRRMDHDJ55MPMNBJ4E4.jpg" 
            />
          </ScrollView>

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
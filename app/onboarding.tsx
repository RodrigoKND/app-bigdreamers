import { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
  ViewToken,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SLIDES } from "@/constants/slides";

const { width } = Dimensions.get('window');

function OwlImage({ source }: { source: any }) {
  return (
    <Image
      source={source}
      style={{ width: width * 0.72, height: width * 0.72 }}
      className="self-center"
      resizeMode="cover"
    />
  );
}

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    }
  ).current;

  const finish = async () => {
    await AsyncStorage.setItem('onboarding_done', 'true');
    router.replace('/(tabs)');
  };

  const goToNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      finish();
    }
  };

  const goToSlide = (index: number) => {
    flatListRef.current?.scrollToIndex({ index });
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <SafeAreaView className="flex-1 bg-blue-primary">
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1">
            <View className="flex-1">
              <SafeAreaView className="flex-1 justify-center px-8">
                
                {/* Imagen del Búho */}
                <OwlImage source={item.image} />

                {/* Contenedor de Texto con margen superior para respiro */}
                <View className="mt-4 items-center">
                  <Text className="text-3xl font-bold text-center mb-4 text-white">
                    {item.title}
                  </Text>
                  <Text 
                    className="text-base text-center text-white/80 leading-6"
                  >
                    {item.text}
                  </Text>
                </View>

                {/* Espacio inferior para que el texto no choque con los controles */}
                <View className="h-40" /> 
              </SafeAreaView>
            </View>
          </View>
        )}
      />

      {/* Controles inferiores (Absolute) */}
      <View className="absolute bottom-16 left-0 right-0 px-8 items-center">
        
        {/* Indicadores (Dots) */}
        <View className="flex-row items-center mb-8">
          {SLIDES.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => goToSlide(index)}
              className={`h-4 w-4 rounded-full mx-1 ${
                activeIndex === index ? 'w-7' : 'w-2.5'
              }`}
              style={{
                backgroundColor: activeIndex === index 
                  ? '#FFD740' 
                  : 'rgba(255,255,255,0.35)'
              }}
            />
          ))}
        </View>

        {/* Botón Principal */}
        <Pressable
          onPress={goToNext}
          className="active:opacity-90 w-full rounded-2xl py-4 items-center bg-[#FFD740]"
        >
          <Text className="text-black text-lg font-bold">
            {isLast ? '¡Comenzar!' : 'Siguiente'}
          </Text>
        </Pressable>

        {/* Botón Saltar */}
        {!isLast && (
          <Pressable
            onPress={finish}
            className="active:opacity-70 mt-5"
          >
            <Text className="text-white/50 text-sm font-semibold">
              Saltar
            </Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}
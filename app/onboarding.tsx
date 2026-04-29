import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  SafeAreaView,
  Dimensions,
  ViewToken,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    bg: '#035380',
    title: 'Aprende a manejar\ntu dinero',
    text: 'BigDreamers te enseña finanzas personales de forma fácil y divertida, a tu ritmo y desde tu celular.',
    image: require('../assets/images/morfeus_aprende.png'),
  },
  {
    id: '2',
    bg: '#035380',
    title: 'Crece con cada\nlección',
    text: 'Gana gemas, sube de nivel y desbloquea nuevos módulos mientras construyes hábitos financieros reales.',
    image: require('../assets/images/morfeus_dinero.png'),
  },
  {
    id: '3',
    bg: '#035380',
    title: 'Compite y avanza\nen comunidad',
    text: 'Únete al ranking semanal, comparte tu progreso y motívate con otros BigDreamers como tú.',
    image: require('../assets/images/morfeus_volando.png'),
  },
];

function OwlImage({ source }: { source: any }) {
  return (
    <Image
      source={source}
      style={{ width: width * 0.72, height: width * 0.72 }}
      resizeMode="contain"
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
    <View style={{ flex: 1, backgroundColor: '#035380' }}>
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
          <View
            style={{ width, flex: 1, backgroundColor: item.bg }}
            className="items-center"
          >
            <SafeAreaView style={{ flex: 1, width: '100%', alignItems: 'center' }}>
              {/* Spacer top */}
              <View style={{ flex: 1 }} />

              {/* Owl image */}
              <OwlImage source={item.image} />

              {/* Text */}
              <View className="w-full px-8 mt-10 items-center" style={{ flex: 1 }}>
                <Text
                  className="text-3xl font-bold text-center mb-4"
                  style={{ color: '#fff' }}
                >
                  {item.title}
                </Text>
                <Text
                  className="text-sm text-center"
                  style={{ color: 'rgba(255,255,255,0.75)', lineHeight: 22 }}
                >
                  {item.text}
                </Text>
              </View>

              {/* Spacer bottom */}
              <View style={{ flex: 1 }} />
            </SafeAreaView>
          </View>
        )}
      />

      {/* Bottom controls */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          paddingHorizontal: 32,
          paddingBottom: 48,
          alignItems: 'center',
          gap: 20,
        }}
      >
        {/* Dots */}
        <View className="flex-row gap-2 items-center">
          {SLIDES.map((_, index) => (
            <Pressable
              key={index}
              onPress={() => goToSlide(index)}
              accessible={true}
              accessibilityLabel={`Ir a slide ${index + 1}`}
              className="active:opacity-70 rounded-full"
              style={{
                width: activeIndex === index ? 28 : 10,
                height: 10,
                backgroundColor: activeIndex === index
                  ? '#FFD740'
                  : 'rgba(255,255,255,0.35)',
              }}
            />
          ))}
        </View>

        {/* Next / Start button */}
        <Pressable
          onPress={goToNext}
          accessible={true}
          accessibilityLabel={isLast ? 'Comenzar' : 'Siguiente'}
          className="active:opacity-80 w-full rounded-2xl py-4 items-center"
          style={{ backgroundColor: '#FFD740' }}
        >
          <Text className="text-base font-bold" style={{ color: '#000' }}>
            {isLast ? '¡Comenzar!' : 'Siguiente'}
          </Text>
        </Pressable>

        {/* Skip */}
        {!isLast && (
          <Pressable
            onPress={finish}
            accessible={true}
            accessibilityLabel="Saltar onboarding"
            className="active:opacity-70"
          >
            <Text
              className="text-sm font-semibold"
              style={{ color: 'rgba(255,255,255,0.50)' }}
            >
              Saltar
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
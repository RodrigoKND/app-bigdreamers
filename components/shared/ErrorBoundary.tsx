import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Colors } from '@/constants/colors';

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
  stack?: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message ?? String(error),
      stack: error?.stack,
    };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Queda en el log y, sobre todo, visible en pantalla abajo.
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, message: undefined, stack: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: Colors.blue.primary }}>
          <Text className="text-3xl mb-4" style={{ color: Colors.gold[400] }}>!</Text>
          <Text className="text-lg font-bold mb-2 text-center" style={{ color: Colors.text.primary }}>
            Algo salió mal
          </Text>
          <Text className="text-sm mb-4 text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Ocurrió un error inesperado. Presiona "Reintentar" para volver a cargar la aplicación.
          </Text>

          {/* Detalle del error: útil para diagnosticar sin adb. */}
          {!!this.state.message && (
            <ScrollView
              style={{ maxHeight: 220, alignSelf: 'stretch', marginBottom: 16 }}
              contentContainerStyle={{ padding: 12 }}
              className="rounded-xl"
              // eslint-disable-next-line react-native/no-inline-styles
            >
              <Text selectable style={{ color: '#FF9C9C', fontSize: 12, fontWeight: '700' }}>
                {this.state.message}
              </Text>
              {!!this.state.stack && (
                <Text selectable style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, marginTop: 8 }}>
                  {this.state.stack}
                </Text>
              )}
            </ScrollView>
          )}

          <Pressable
            onPress={this.handleRetry}
            className="px-6 py-3 rounded-xl"
            style={{ backgroundColor: Colors.gold[400] }}
          >
            <Text className="font-bold" style={{ color: '#000' }}>Reintentar</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

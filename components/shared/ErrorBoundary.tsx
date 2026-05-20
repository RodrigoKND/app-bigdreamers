import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Colors } from '@/constants/colors';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center px-6" style={{ backgroundColor: Colors.blue.primary }}>
          <Text className="text-3xl mb-4" style={{ color: Colors.gold[400] }}>!</Text>
          <Text className="text-lg font-bold mb-2 text-center" style={{ color: Colors.text.primary }}>
            Algo salió mal
          </Text>
          <Text className="text-sm mb-6 text-center" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Ocurrió un error inesperado. Presiona "Reintentar" para volver a cargar la aplicación.
          </Text>
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

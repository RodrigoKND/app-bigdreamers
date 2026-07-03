import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';
import { getSession, signOut } from '@/services/supabase/googleService';
import { getUserById } from '@/services/supabase/userService';

const ONBOARDING_KEY = 'onboarding_done';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoggedIn: boolean;
  onboardingDone: boolean | null;
  completeOnboarding: () => void;
}

const DEFAULT_AUTH: AuthContextType = {
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  refreshUser: async () => {},
  isLoggedIn: false,
  onboardingDone: null,
  completeOnboarding: () => {},
};

const AuthContext = createContext<AuthContextType>(DEFAULT_AUTH);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    // Simular carga del usuario guardado
    const loadUser = async () => {
      try {
        const session = await getSession();
        if (session?.user?.id) {
          const dbUser = await getUserById(session.user.id);
          if (dbUser) {
            const avatar = dbUser.avatar || session.user.user_metadata?.avatar_url;
            setUser(avatar ? { ...dbUser, avatar } : dbUser);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // El estado de onboarding se comparte con el guard de _layout para evitar
  // loops: cuando termina, se actualiza aquí y el guard deja pasar a /(tabs).
  useEffect(() => {
    if (user) {
      AsyncStorage.getItem(ONBOARDING_KEY)
        .then((val) => setOnboardingDone(val === 'true'))
        .catch(() => setOnboardingDone(false));
    } else {
      setOnboardingDone(null);
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const refreshUser = async () => {
    try {
      const session = await getSession();
      if (session?.user?.id) {
        const dbUser = await getUserById(session.user.id);
        if (dbUser) setUser(dbUser);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const logout = () => {
    // Limpiamos el estado local de inmediato para que el guard redirija a /login,
    // y cerramos la sesión de Supabase para que no se restaure al reabrir la app.
    setUser(null);
    signOut().catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  const completeOnboarding = () => {
    setOnboardingDone(true);
    AsyncStorage.setItem(ONBOARDING_KEY, 'true').catch((error) => {
      console.error('Error saving onboarding flag:', error);
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        refreshUser,
        isLoggedIn: user !== null,
        onboardingDone,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

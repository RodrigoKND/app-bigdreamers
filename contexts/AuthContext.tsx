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
    let finished = false;

    // Fail-safe absoluto: pase lo que pase (SecureStore colgado, red muerta,
    // getSession que nunca resuelve), a los 6s dejamos de mostrar el loader.
    const safety = setTimeout(() => {
      if (!finished) {
        console.warn('[Auth] Fail-safe: forzando isLoading=false tras 6s');
        setIsLoading(false);
      }
    }, 6000);

    const loadUser = async () => {
      try {
        console.log('[Auth] loadUser: pidiendo sesión...');
        const session = await Promise.race([
          getSession(),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
        ]);
        console.log('[Auth] loadUser: sesión =', session?.user?.id ?? 'null');
        if (session?.user?.id) {
          const dbUser = await Promise.race([
            getUserById(session.user.id),
            new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000)),
          ]);
          console.log('[Auth] loadUser: dbUser =', dbUser ? 'ok' : 'null');
          if (dbUser) {
            const avatar = dbUser.avatar || session.user.user_metadata?.avatar_url;
            setUser(avatar ? { ...dbUser, avatar } : dbUser);
          }
        }
      } catch (error) {
        console.error('[Auth] Error restoring session:', error);
      } finally {
        finished = true;
        clearTimeout(safety);
        setIsLoading(false);
        console.log('[Auth] loadUser: listo (isLoading=false)');
      }
    };

    loadUser();
    return () => clearTimeout(safety);
  }, []);

  // El estado de onboarding se comparte con el guard de _layout para evitar
  // loops: cuando termina, se actualiza aquí y el guard deja pasar a /(tabs).
  useEffect(() => {
    if (user) {
      // Fail-safe: si AsyncStorage no responde, asumimos onboarding no hecho
      // para que el guard no se quede esperando con onboardingDone===null.
      const t = setTimeout(() => setOnboardingDone((v) => (v === null ? false : v)), 4000);
      AsyncStorage.getItem(ONBOARDING_KEY)
        .then((val) => { clearTimeout(t); setOnboardingDone(val === 'true'); })
        .catch(() => { clearTimeout(t); setOnboardingDone(false); });
      return () => clearTimeout(t);
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
